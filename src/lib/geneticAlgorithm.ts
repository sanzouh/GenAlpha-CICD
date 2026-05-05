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

export function mutate(weights: number[], mutationRate: number, amplitude = 0.15): number[] {
	const mutated = weights.map((w) => {
		if (Math.random() < mutationRate / 100) {
			return w + (Math.random() - 0.5) * amplitude;
		}
		return w;
	});

	const positive = mutated.map((w) => Math.max(0.01, w));
	return normalize(positive);
}

// ─────────────────────────────────────────────
//  DOMINATION (stricte, sans EPS)
// ─────────────────────────────────────────────
function dominates(a: Portfolio, b: Portfolio): boolean {
	return (
		a.expectedReturn >= b.expectedReturn &&
		a.volatility <= b.volatility &&
		(a.expectedReturn > b.expectedReturn || a.volatility < b.volatility)
	);
}

export function getParetoFront(population: Portfolio[]): Portfolio[] {
	return population.filter((p) => !population.some((q) => dominates(q, p)));
}

// ─────────────────────────────────────────────
//  NSGA-II
// ─────────────────────────────────────────────
interface RankedPortfolio extends Portfolio {
	rank: number;
	crowding: number;
}

function nonDominatedSort(population: Portfolio[], maxRisk: number): RankedPortfolio[] {
	const n = population.length;
	const INFEASIBLE = n + 1;
	const feasible = population.map((p) => p.volatility <= maxRisk);

	const dominationCount = new Array<number>(n).fill(0);
	const dominated: number[][] = Array.from({ length: n }, () => []);
	const ranks = new Array<number>(n).fill(INFEASIBLE);
	const crowding = new Array<number>(n).fill(0);

	// Les infaisables reçoivent une crowding distance inversement proportionnelle à leur violation
	for (let i = 0; i < n; i++) {
		if (!feasible[i]) {
			crowding[i] = -(population[i].volatility - maxRisk);
			continue;
		}
		for (let j = 0; j < n; j++) {
			if (i === j || !feasible[j]) continue;
			if (dominates(population[i], population[j])) {
				dominated[i].push(j);
			} else if (dominates(population[j], population[i])) {
				dominationCount[i]++;
			}
		}
	}

	const fronts: number[][] = [[]];
	for (let i = 0; i < n; i++) {
		if (feasible[i] && dominationCount[i] === 0) {
			ranks[i] = 0;
			fronts[0].push(i);
		}
	}

	let f = 0;
	while (fronts[f].length > 0) {
		const next: number[] = [];
		for (const i of fronts[f]) {
			for (const j of dominated[i]) {
				if (--dominationCount[j] === 0) {
					ranks[j] = f + 1;
					next.push(j);
				}
			}
		}
		f++;
		fronts.push(next);
	}

	for (let fi = 0; fi < f; fi++) {
		const front = fronts[fi];
		if (front.length <= 2) {
			for (const i of front) crowding[i] = Infinity;
			continue;
		}
		for (const obj of ["expectedReturn", "volatility"] as const) {
			const sorted = [...front].sort(
				(a, b) => population[a][obj] - population[b][obj],
			);
			crowding[sorted[0]] = Infinity;
			crowding[sorted[sorted.length - 1]] = Infinity;
			const range =
				population[sorted[sorted.length - 1]][obj] - population[sorted[0]][obj];
			if (range === 0) continue;
			for (let k = 1; k < sorted.length - 1; k++) {
				crowding[sorted[k]] +=
					(population[sorted[k + 1]][obj] - population[sorted[k - 1]][obj]) /
					range;
			}
		}
	}

	return population.map((p, i) => ({ ...p, rank: ranks[i], crowding: crowding[i] }));
}

function nsgaTournamentSelect(pool: RankedPortfolio[], k = 2): RankedPortfolio {
	const candidates = Array.from(
		{ length: k },
		() => pool[Math.floor(Math.random() * pool.length)],
	);
	return candidates.reduce((best, c) => {
		if (c.rank < best.rank) return c;
		if (c.rank === best.rank && c.crowding > best.crowding) return c;
		return best;
	});
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

	let bestEver: Portfolio | null = null;

	for (let gen = 0; gen < generations; gen++) {
		await new Promise((r) => setTimeout(r, 16));

		// Rang + crowding sur la population courante
		const ranked = nonDominatedSort(population, maxRisk);

		// Génération des enfants (même taille que la population)
		const offspring: Portfolio[] = [];
		const amplitude = 0.3 * (1 - gen / generations);

		while (offspring.length < populationSize) {
			const parentA = nsgaTournamentSelect(ranked);
			const parentB = nsgaTournamentSelect(ranked);

			let childWeights =
				Math.random() < crossoverRate / 100
					? crossover(parentA.weights, parentB.weights)
					: [...parentA.weights];

			childWeights = mutate(childWeights, mutationRate, amplitude);
			offspring.push(evaluatePortfolio(childWeights, volatilityMode));
		}

		// Sélection NSGA-II : trier parents + enfants par (rank asc, crowding desc)
		const combined = nonDominatedSort([...population, ...offspring], maxRisk);
		combined.sort((a, b) =>
			a.rank !== b.rank ? a.rank - b.rank : b.crowding - a.crowding,
		);

		population = combined.slice(0, populationSize);

		const paretoFront = population.filter((p) => (p as RankedPortfolio).rank === 0);
		const currentBest = [...paretoFront].sort((a, b) => b.sharpe - a.sharpe)[0];
		if (!bestEver || currentBest.sharpe > bestEver.sharpe) bestEver = currentBest;

		yield {
			generation: gen + 1,
			best: bestEver,
			population,
			paretoFront,
			progress: Math.round(((gen + 1) / generations) * 100),
		};
	}
}
