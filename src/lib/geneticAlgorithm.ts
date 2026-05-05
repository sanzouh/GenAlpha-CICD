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
	marketCorr: number; // corrélation avec le marché [-1, 1] — utilisée pour les actifs custom
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
//  MATRICE DE CORRÉLATION DYNAMIQUE
// ─────────────────────────────────────────────
export function buildCorrelationMatrix(assets: Asset[]): number[][] {
	return assets.map((a, i) =>
		assets.map((b, j) => {
			if (i === j) return 1;
			const bi = ASSETS.findIndex((x) => x.ticker === a.ticker);
			const bj = ASSETS.findIndex((x) => x.ticker === b.ticker);
			if (bi >= 0 && bj >= 0) return CORRELATION[bi][bj];
			// Actif custom : approximation par produit des corrélations marché
			return a.marketCorr * b.marketCorr;
		}),
	);
}

// ─────────────────────────────────────────────
//  UTILITAIRES
// ─────────────────────────────────────────────
function normalize(weights: number[]): number[] {
	const sum = weights.reduce((acc, w) => acc + w, 0);
	return weights.map((w) => w / sum);
}

// Plafonne chaque poids à maxW puis renormalise (itératif pour garantir la contrainte)
function enforceMaxWeight(weights: number[], maxW = 0.40): number[] {
	let w = [...weights];
	for (let iter = 0; iter < 20; iter++) {
		const capped = w.map((x) => Math.min(x, maxW));
		const sum = capped.reduce((s, x) => s + x, 0);
		const next = capped.map((x) => x / sum);
		if (next.every((x) => x <= maxW + 1e-9)) return next;
		w = next;
	}
	return w;
}

export function randomPortfolio(n: number): number[] {
	const weights = Array.from({ length: n }, () => Math.random());
	return normalize(weights);
}

export function evaluatePortfolio(
	rawWeights: number[],
	mode: "markowitz" | "linear" = "markowitz",
	assets: Asset[] = ASSETS,
	correlMatrix: number[][] = CORRELATION,
): Portfolio {
	const weights = enforceMaxWeight(rawWeights);
	let expectedReturn = 0;
	let volatility = 0;

	assets.forEach((asset, i) => {
		expectedReturn += weights[i] * asset.expectedReturn;
	});

	if (mode === "linear") {
		assets.forEach((asset, i) => {
			volatility += weights[i] * asset.volatility;
		});
	} else {
		let varianceSum = 0;
		assets.forEach((a, i) => {
			assets.forEach((b, j) => {
				varianceSum +=
					weights[i] *
					weights[j] *
					a.volatility *
					b.volatility *
					correlMatrix[i][j];
			});
		});
		volatility = Math.sqrt(Math.max(0, varianceSum));
	}

	const sharpe = volatility > 0 ? (expectedReturn - RISK_FREE_RATE) / volatility : 0;
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
	assets: Asset[] = ASSETS,
): AsyncGenerator<GAResult, void, unknown> {
	const {
		populationSize,
		generations,
		crossoverRate,
		mutationRate,
		maxRisk,
		volatilityMode,
	} = params;

	const correlMatrix = buildCorrelationMatrix(assets);

	let population: Portfolio[] = Array.from({ length: populationSize }, () =>
		evaluatePortfolio(randomPortfolio(assets.length), volatilityMode, assets, correlMatrix),
	);

	// Tri initial — réutilisé comme cache pour la sélection parentale
	let ranked = nonDominatedSort(population, maxRisk);
	let bestEver: Portfolio | null = null;

	for (let gen = 0; gen < generations; gen++) {
		await new Promise((r) => setTimeout(r, 0)); // cède la main sans délai artificiel

		// Génération des enfants avec les rangs mis en cache (pas de re-tri)
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
			offspring.push(evaluatePortfolio(childWeights, volatilityMode, assets, correlMatrix));
		}

		// Un seul tri par génération sur la pool combinée
		const combined = nonDominatedSort([...population, ...offspring], maxRisk);
		combined.sort((a, b) =>
			a.rank !== b.rank ? a.rank - b.rank : b.crowding - a.crowding,
		);

		population = combined.slice(0, populationSize);
		ranked = population as RankedPortfolio[]; // cache pour la prochaine génération

		const fullFront = population.filter((p) => (p as RankedPortfolio).rank === 0);
		const currentBest = [...fullFront].sort((a, b) => b.sharpe - a.sharpe)[0];
		if (!bestEver || currentBest.sharpe > bestEver.sharpe) bestEver = currentBest;

		const paretoFront = fullFront;

		yield {
			generation: gen + 1,
			best: bestEver,
			population,
			paretoFront,
			progress: Math.round(((gen + 1) / generations) * 100),
		};
	}
}
