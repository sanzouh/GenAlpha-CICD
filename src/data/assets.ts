import type { Asset } from "../lib/geneticAlgorithm";

export const ASSETS: Asset[] = [
	// ── Défensifs ──────────────────────────────────────────────
	{
		ticker: "TBOND",
		name: "US Treasury Bond 10Y",
		expectedReturn: 3.5,
		volatility: 8.0,
		color: "bg-tbond",
	},
	{
		ticker: "TIP",
		name: "TIPS ETF (inflation-protected)",
		expectedReturn: 3.2,
		volatility: 6.5,
		color: "bg-tip",
	},
	{
		ticker: "GOLD",
		name: "Gold ETF",
		expectedReturn: 7.5,
		volatility: 13.5,
		color: "bg-gold",
	},
	// ── Diversifiés ────────────────────────────────────────────
	{
		ticker: "REIT",
		name: "Real Estate ETF",
		expectedReturn: 8.5,
		volatility: 17.0,
		color: "bg-reit",
	},
	{
		ticker: "SPY",
		name: "S&P 500 ETF",
		expectedReturn: 10.5,
		volatility: 17.5,
		color: "bg-spy",
	},
	{
		ticker: "EEM",
		name: "Emerging Markets ETF",
		expectedReturn: 8.0,
		volatility: 21.5,
		color: "bg-eem",
	},
	// ── Tech large-cap ─────────────────────────────────────────
	{
		ticker: "MSFT",
		name: "Microsoft Corp.",
		expectedReturn: 14.5,
		volatility: 23.0,
		color: "bg-msft",
	},
	{
		ticker: "AAPL",
		name: "Apple Inc.",
		expectedReturn: 13.0,
		volatility: 21.0,
		color: "bg-aapl",
	},
	{
		ticker: "XLE",
		name: "Energy Sector ETF",
		expectedReturn: 10.0,
		volatility: 26.0,
		color: "bg-xle",
	},
	// ── Haute volatilité ───────────────────────────────────────
	{
		ticker: "NVDA",
		name: "Nvidia Corp.",
		expectedReturn: 28.0,
		volatility: 45.0,
		color: "bg-nvda",
	},
	{
		ticker: "TSLA",
		name: "Tesla Inc.",
		expectedReturn: 24.0,
		volatility: 58.0,
		color: "bg-tsla",
	},
	{
		ticker: "BTC",
		name: "Bitcoin ETF",
		expectedReturn: 40.0,
		volatility: 78.0,
		color: "bg-btc",
	},
];

//  CORR[i][j] — matrice symétrique 12×12
//  Ordre : TBOND TIP GOLD REIT SPY EEM MSFT AAPL XLE NVDA TSLA BTC
export const CORRELATION: number[][] = [
	//TBOND   TIP    GOLD   REIT   SPY    EEM    MSFT   AAPL   XLE    NVDA   TSLA   BTC
	[ 1.00,  0.80, -0.10, -0.15, -0.20, -0.12,  0.00,  0.00, -0.12, -0.02,  0.00, -0.05], // TBOND
	[ 0.80,  1.00, -0.08, -0.10, -0.15, -0.08,  0.00,  0.00, -0.08, -0.02,  0.00, -0.03], // TIP
	[-0.10, -0.08,  1.00,  0.08,  0.05,  0.12,  0.05,  0.04,  0.15,  0.05,  0.08,  0.20], // GOLD
	[-0.15, -0.10,  0.08,  1.00,  0.62,  0.48,  0.52,  0.50,  0.32,  0.38,  0.28,  0.12], // REIT
	[-0.20, -0.15,  0.05,  0.62,  1.00,  0.68,  0.82,  0.80,  0.58,  0.68,  0.48,  0.22], // SPY
	[-0.12, -0.08,  0.12,  0.48,  0.68,  1.00,  0.58,  0.55,  0.52,  0.52,  0.42,  0.28], // EEM
	[ 0.00,  0.00,  0.05,  0.52,  0.82,  0.58,  1.00,  0.80,  0.42,  0.75,  0.50,  0.30], // MSFT
	[ 0.00,  0.00,  0.04,  0.50,  0.80,  0.55,  0.80,  1.00,  0.40,  0.70,  0.48,  0.28], // AAPL
	[-0.12, -0.08,  0.15,  0.32,  0.58,  0.52,  0.42,  0.40,  1.00,  0.38,  0.32,  0.18], // XLE
	[-0.02, -0.02,  0.05,  0.38,  0.68,  0.52,  0.75,  0.70,  0.38,  1.00,  0.58,  0.35], // NVDA
	[ 0.00,  0.00,  0.08,  0.28,  0.48,  0.42,  0.50,  0.48,  0.32,  0.58,  1.00,  0.42], // TSLA
	[-0.05, -0.03,  0.20,  0.12,  0.22,  0.28,  0.30,  0.28,  0.18,  0.35,  0.42,  1.00], // BTC
];
