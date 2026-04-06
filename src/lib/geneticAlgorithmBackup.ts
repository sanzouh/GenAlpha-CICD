import { ASSETS, CORRELATION } from "@/data/assets";

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
	rank?: number;
	crowding?: number;
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

const RISK_FREE_RATE = 2;

function normalize(weights: number[]): number[] {
	const sum = weights.reduce((a, b) => a + b, 0);
	return weights.map((w) => w / sum);
}

export function randomPortfolio(): number[] {
	return normalize(ASSETS.map(() => Math.random() + 0.02));
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
		let variance = 0;
		ASSETS.forEach((_, i) => {
			ASSETS.forEach((_, j) => {
				variance +=
					weights[i] *
					weights[j] *
					ASSETS[i].volatility *
					ASSETS[j].volatility *
					CORRELATION[i][j];
			});
		});
		volatility = Math.sqrt(variance);
	}

	const sharpe = (expectedReturn - RISK_FREE_RATE) / volatility;
	return { weights, expectedReturn, volatility, sharpe };
}

// ── Dominance Pareto pure — sans EPS, sans Sharpe ──
function dominates(a: Portfolio, b: Portfolio): boolean {
	return (
		a.expectedReturn >= b.expectedReturn &&
		a.volatility <= b.volatility &&
		(a.expectedReturn > b.expectedReturn || a.volatility < b.volatility)
	);
}

// ── Tri par rang NSGA-II ──
function nondominatedSort(population: Portfolio[]): Portfolio[][] {
	const fronts: Portfolio[][] = [[]];
	const domCount = new Map<Portfolio, number>();
	const domSet = new Map<Portfolio, Portfolio[]>();

	population.forEach((p) => {
		domCount.set(p, 0);
		domSet.set(p, []);
	});

	population.forEach((p) => {
		population.forEach((q) => {
			if (p === q) return;
			if (dominates(p, q)) {
				domSet.get(p)!.push(q);
			} else if (dominates(q, p)) {
				domCount.set(p, domCount.get(p)! + 1);
			}
		});
		if (domCount.get(p) === 0) {
			fronts[0].push(p);
			p.rank = 0;
		}
	});

	for (let i = 0; i < fronts.length; i++) {
		if (fronts[i].length === 0) break;
		const next: Portfolio[] = [];
		fronts[i].forEach((p) => {
			domSet.get(p)!.forEach((q) => {
				const count = domCount.get(q)! - 1;
				domCount.set(q, count);
				if (count === 0) {
					q.rank = i + 1;
					next.push(q);
				}
			});
		});
		if (next.length > 0) {
			fronts.push(next);
		}
	}

	return fronts.filter((f) => f.length > 0);
}

// ── Distance de crowding — préserve la diversité le long du front ──
function crowdingDistance(front: Portfolio[]): void {
	const n = front.length;
	front.forEach((p) => (p.crowding = 0));
	if (n <= 2) {
		front.forEach((p) => (p.crowding = Infinity));
		return;
	}

	// Crowding sur le rendement
	const byReturn = [...front].sort(
		(a, b) => a.expectedReturn - b.expectedReturn,
	);
	byReturn[0].crowding = Infinity;
	byReturn[n - 1].crowding = Infinity;
	const retRange =
		byReturn[n - 1].expectedReturn - byReturn[0].expectedReturn || 1;
	for (let i = 1; i < n - 1; i++) {
		byReturn[i].crowding! +=
			(byReturn[i + 1].expectedReturn - byReturn[i - 1].expectedReturn) /
			retRange;
	}

	// Crowding sur la volatilité
	const byVol = [...front].sort((a, b) => a.volatility - b.volatility);
	byVol[0].crowding = Infinity;
	byVol[n - 1].crowding = Infinity;
	const volRange = byVol[n - 1].volatility - byVol[0].volatility || 1;
	for (let i = 1; i < n - 1; i++) {
		byVol[i].crowding! +=
			(byVol[i + 1].volatility - byVol[i - 1].volatility) / volRange;
	}
}

// ── Sélection par tournoi NSGA-II ──
function nsgaTournament(evaluated: Portfolio[]): Portfolio {
	const a = evaluated[Math.floor(Math.random() * evaluated.length)];
	const b = evaluated[Math.floor(Math.random() * evaluated.length)];

	if (a.rank! < b.rank!) return a;
	if (b.rank! < a.rank!) return b;
	return (a.crowding ?? 0) >= (b.crowding ?? 0) ? a : b;
}

export function crossover(parentA: number[], parentB: number[]): number[] {
	return normalize(
		parentA.map((w, i) => (Math.random() < 0.5 ? w : parentB[i])),
	);
}

export function mutate(weights: number[], mutationRate: number): number[] {
	const mutated = weights.map((w) =>
		Math.random() < mutationRate / 100
			? Math.max(0.01, w + (Math.random() - 0.5) * 0.2)
			: w,
	);
	return normalize(mutated);
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
		volatilityMode,
	} = params;

	let population: Portfolio[] = Array.from({ length: populationSize }, () =>
		evaluatePortfolio(randomPortfolio(), volatilityMode),
	);

	for (let gen = 0; gen < generations; gen++) {
		await new Promise((r) => setTimeout(r, 16));

		// ── Phase 1 : classer la population courante ──
		const fronts = nondominatedSort(population);
		fronts.forEach((front) => crowdingDistance(front));
		const best = fronts[0].reduce((a, b) => (a.sharpe > b.sharpe ? a : b));

		// Debug: vérifier que la population évolue
		const avgSharpe =
			population.reduce((sum, p) => sum + p.sharpe, 0) / population.length;
		console.log(
			`Gen ${gen + 1}: fronts=${fronts.length}, best Sharpe=${best.sharpe.toFixed(3)}, avg Sharpe=${avgSharpe.toFixed(3)}`,
		);

		// ── Phase 2 : créer les enfants depuis la population courante ──
		const children: Portfolio[] = [];
		while (children.length < populationSize) {
			const parentA = nsgaTournament(population);
			const parentB = nsgaTournament(population);

			let childWeights =
				Math.random() < crossoverRate / 100
					? crossover(parentA.weights, parentB.weights)
					: [...parentA.weights];

			childWeights = mutate(childWeights, mutationRate);
			children.push(evaluatePortfolio(childWeights, volatilityMode));
		}

		// ── Phase 3 : combiner parents + enfants (taille 2N) ──
		const combined = [...population, ...children];
		const combinedFronts = nondominatedSort(combined);
		combinedFronts.forEach((front) => crowdingDistance(front));

		// ── Phase 4 : sélectionner les N meilleurs pour la prochaine génération ──
		population = [];
		for (const front of combinedFronts) {
			if (population.length + front.length <= populationSize) {
				population.push(...front);
			} else {
				// Trier par crowding décroissant (plus diversifié d'abord)
				const sorted = [...front].sort(
					(a, b) => (b.crowding ?? 0) - (a.crowding ?? 0),
				);
				const remaining = populationSize - population.length;
				population.push(...sorted.slice(0, remaining));
				break;
			}
		}

		// Sécurité : si population vide ou trop petite, régénérer
		if (population.length < populationSize) {
			while (population.length < populationSize) {
				population.push(evaluatePortfolio(randomPortfolio(), volatilityMode));
			}
		}

		const paretoFront = getParetoFront(population);

		yield {
			generation: gen + 1,
			best,
			population,
			paretoFront,
			progress: Math.round(((gen + 1) / generations) * 100),
		};
	}
}
