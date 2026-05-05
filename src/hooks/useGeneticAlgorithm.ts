import { useState, useRef, useCallback, useEffect } from "react";
import { runGeneticAlgorithm } from "../lib/geneticAlgorithm";
import type {
	GAParams,
	Portfolio,
	GAResult,
} from "../lib/geneticAlgorithm";

// ── Types ──
interface GAState {
	running: boolean;
	paused: boolean;
	progress: number;
	generation: number;
	best: Portfolio | null;
	population: Portfolio[];
	paretoFront: Portfolio[];
	fitnessHistory: { gen: number; sharpe: number }[];
}

const INITIAL_STATE: GAState = {
	running: false,
	paused: false,
	progress: 0,
	generation: 0,
	best: null,
	population: [],
	paretoFront: [],
	fitnessHistory: [],
};

const DEFAULT_PARAMS: GAParams = {
	populationSize: 120,
	generations: 100,
	crossoverRate: 75,
	mutationRate: 3,
	maxRisk: 20,
	volatilityMode: "markowitz",
};

// ── Hook ──
export function useGeneticAlgorithm() {
	const [params, setParams] = useState<GAParams>(DEFAULT_PARAMS);
	const [state, setState] = useState<GAState>({ ...INITIAL_STATE, paused: false });

	const generatorRef = useRef<AsyncGenerator<GAResult, void, unknown> | null>(null);
	const abortRef = useRef(false);
	const pauseRef = useRef(false);

	const updateParam = useCallback(
		<K extends keyof GAParams>(key: K, value: GAParams[K]) => {
			setParams((prev) => ({ ...prev, [key]: value }));
		},
		[],
	);

	const reset = useCallback(() => {
		abortRef.current = true;
		pauseRef.current = false;
		generatorRef.current = null;
		setParams(DEFAULT_PARAMS);
		setState({ ...INITIAL_STATE, paused: false });
	}, []);

	const tickRef = useRef<() => void>(() => {});

	const tick = useCallback(async () => {
		if (abortRef.current) {
			setState((prev) => ({ ...prev, running: false, paused: false }));
			return;
		}

		if (pauseRef.current) {
			setState((prev) => ({ ...prev, running: false, paused: true }));
			return;
		}

		if (!generatorRef.current) {
			setState((prev) => ({ ...prev, running: false, paused: false }));
			return;
		}

		const { value, done } = await generatorRef.current.next();

		if (done || !value) {
			generatorRef.current = null;
			setState((prev) => ({ ...prev, running: false, paused: false }));
			return;
		}

		setState((prev) => ({
			...prev,
			running: true,
			paused: false,
			generation: value.generation,
			progress: value.progress,
			best: value.best,
			population: value.population,
			paretoFront: value.paretoFront,
			fitnessHistory: [...prev.fitnessHistory, { gen: value.generation, sharpe: value.best.sharpe }],
		}));

		setTimeout(() => tickRef.current(), 0);
	}, []);

	useEffect(() => {
		tickRef.current = tick;
	}, [tick]);

	const start = useCallback(() => {
		if (state.running) return;

		if (state.paused && generatorRef.current) {
			pauseRef.current = false;
			setState((prev) => ({ ...prev, running: true, paused: false }));
			tick();
			return;
		}

		abortRef.current = false;
		pauseRef.current = false;
		setState({ ...INITIAL_STATE, running: true, paused: false });
		generatorRef.current = runGeneticAlgorithm(params);
		tick();
	}, [params, state.running, state.paused, tick]);

	const pause = useCallback(() => {
		if (!state.running) return;
		pauseRef.current = true;
		setState((prev) => ({ ...prev, running: false, paused: true }));
	}, [state.running]);

	const stop = useCallback(() => {
		abortRef.current = true;
		pauseRef.current = false;
		generatorRef.current = null;
		setState((prev) => ({ ...prev, running: false, paused: false }));
	}, []);

	return {
		params,
		updateParam,
		reset,
		start,
		pause,
		stop,
		...state,
	};
}
