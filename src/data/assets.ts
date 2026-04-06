import type { Asset } from "../lib/geneticAlgorithm";

export const ASSETS: Asset[] = [
	{
		ticker: "TBOND",
		name: "US Treasury Bond",
		expectedReturn: 3.5,
		volatility: 4.2,
		color: "bg-aapl",
	},
	{
		ticker: "GOLD",
		name: "Gold ETF",
		expectedReturn: 6.8,
		volatility: 12.5,
		color: "bg-msft",
	},
	{
		ticker: "MSFT",
		name: "Microsoft Corp.",
		expectedReturn: 14.2,
		volatility: 22.1,
		color: "bg-googl",
	},
	{
		ticker: "AAPL",
		name: "Apple Inc.",
		expectedReturn: 12.8,
		volatility: 20.4,
		color: "bg-amzn",
	},
	{
		ticker: "TSLA",
		name: "Tesla Inc.",
		expectedReturn: 28.5,
		volatility: 58.3,
		color: "bg-tsla",
	},
	{
		ticker: "BTC",
		name: "Bitcoin ETF",
		expectedReturn: 45.0,
		volatility: 82.0,
		color: "bg-nvda",
	},
];

// CORR[i][j] = corrélation entre l'actif i et l'actif j
export const CORRELATION: number[][] = [
	//TBOND  GOLD   MSFT   AAPL   TSLA   BTC
	[1.0, -0.1, 0.05, 0.05, -0.05, -0.08], // TBOND
	[-0.1, 1.0, 0.1, 0.08, 0.05, 0.15], // GOLD
	[0.05, 0.1, 1.0, 0.75, 0.45, 0.3], // MSFT
	[0.05, 0.08, 0.75, 1.0, 0.42, 0.28], // AAPL
	[-0.05, 0.05, 0.45, 0.42, 1.0, 0.55], // TSLA
	[-0.08, 0.15, 0.3, 0.28, 0.55, 1.0], // BTC
];
