import { ASSETS, CORRELATION } from "@/data/assets";

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────

export interface Asset {
	ticker: string;
	name: string;
	expectedReturn: number;
	volatility: number;
	color: string;
}

export interface Portfolio {
	weights: number[];
	expectedReturn: number;
	volatility: number;
	sharpe: number;
}

export interface GAParams {
	populationSize: number;
	generations: number;
	crossoverRate: number;
	mutationRate: number;
	maxRisk: number;
	volatilityMode: "markowitz" | "linear";
}

export interface GAResult {
	generation: number;
	best: Portfolio;
	population: Portfolio[];
	paretoFront: Portfolio[];
	progress: number;
}

// ─────────────────────────────────────────────
//  CONSTANTES
// ─────────────────────────────────────────────
const RISK_FREE_RATE = 2;

// ─────────────────────────────────────────────
//  UTILITAIRES
// ─────────────────────────────────────────────
function normalize(weights: number[]): number[] {
	const sum = weights.reduce((acc, w) => acc + w, 0);
	return weights.map((w) => w / sum);
}

export function randomPortfolio(): number[] {
	const weights = ASSETS.map(() => Math.random() + 0.02);
	return normalize(weights);
}

export function evaluatePortfolio(
	weights: number[],
	mode: "markowitz" | "linear" = "markowitz",
): Portfolio {
	let expectedReturn = 0;
	let volatility = 0;

	ASSETS.forEach((asset, i) => {
		expectedReturn += weights[i] * asset.expectedReturn;
	});

	if (mode === "linear") {
		ASSETS.forEach((asset, i) => {
			volatility += weights[i] * asset.volatility;
		});
	} else {
		let varianceSum = 0;
		ASSETS.forEach((_, i) => {
			ASSETS.forEach((_, j) => {
				varianceSum +=
					weights[i] *
					weights[j] *
					ASSETS[i].volatility *
					ASSETS[j].volatility *
					CORRELATION[i][j];
			});
		});
		volatility = Math.sqrt(varianceSum);
	}

	const sharpe = (expectedReturn - RISK_FREE_RATE) / volatility;
	return { weights, expectedReturn, volatility, sharpe };
}

export function fitness(portfolio: Portfolio, maxRisk: number): number {
	const penalty = Math.max(0, portfolio.volatility - maxRisk) * 0.5;
	return portfolio.sharpe - penalty;
}

export function crossover(parentA: number[], parentB: number[]): number[] {
	const childWeights = parentA.map((w, i) =>
		Math.random() < 0.5 ? w : parentB[i],
	);
	return normalize(childWeights);
}

export function mutate(weights: number[], mutationRate: number): number[] {
	const mutated = weights.map((w) => {
		if (Math.random() < mutationRate / 100) {
			return w + (Math.random() - 0.5) * 0.15;
		}
		return w;
	});

	const positive = mutated.map((w) => Math.max(0.01, w));
	return normalize(positive);
}

function dominates(a: Portfolio, b: Portfolio): boolean {
	const EPS = 0.01;

	return (
		a.expectedReturn >= b.expectedReturn - EPS &&
		a.volatility <= b.volatility + EPS &&
		(a.expectedReturn > b.expectedReturn + EPS ||
			a.volatility < b.volatility - EPS)
	);
}

export function getParetoFront(population: Portfolio[]): Portfolio[] {
	return population.filter((p) => !population.some((q) => dominates(q, p)));
}

export async function* runGeneticAlgorithm(
	params: GAParams,
): AsyncGenerator<GAResult, void, unknown> {
	const {
		populationSize,
		generations,
		crossoverRate,
		mutationRate,
		maxRisk,
		volatilityMode,
	} = params;

	let population: Portfolio[] = Array.from({ length: populationSize }, () =>
		evaluatePortfolio(randomPortfolio(), volatilityMode),
	);

	for (let gen = 0; gen < generations; gen++) {
		await new Promise((r) => setTimeout(r, 16));

		const evaluated = population
			.map((p) => ({ ...p, fit: fitness(p, maxRisk) }))
			.sort((a, b) => b.fit - a.fit);

		// Sélection avec 3 élites
		const sharpeElite = evaluated.slice(0, Math.floor(populationSize * 0.1));
		const returnElite = [...evaluated]
			.sort((a, b) => b.expectedReturn - a.expectedReturn)
			.slice(0, Math.floor(populationSize * 0.05));
		const riskElite = [...evaluated]
			.sort((a, b) => a.volatility - b.volatility)
			.slice(0, Math.floor(populationSize * 0.05));

		const elite = [...sharpeElite, ...returnElite, ...riskElite].filter(
			(p, i, arr) => arr.indexOf(p) === i,
		);

		const newPopulation: Portfolio[] = elite.map((e) => ({ ...e }));

		while (newPopulation.length < populationSize) {
			const parentA = elite[Math.floor(Math.random() * elite.length)];
			const parentB = elite[Math.floor(Math.random() * elite.length)];

			let childWeights =
				Math.random() < crossoverRate / 100
					? crossover(parentA.weights, parentB.weights)
					: [...parentA.weights];

			childWeights = mutate(childWeights, mutationRate);
			newPopulation.push(evaluatePortfolio(childWeights, volatilityMode));
		}

		population = newPopulation;
		const paretoFront = getParetoFront(population);

		yield {
			generation: gen + 1,
			best: evaluated[0],
			population: evaluated,
			paretoFront,
			progress: Math.round(((gen + 1) / generations) * 100),
		};
	}
}
