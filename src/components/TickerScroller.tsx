import TickerPill from "./TickerPill";

interface TickerScrollerProps {
	tickers: Array<{ symbol: string; value: string; positive: boolean }>;
}

export default function TickerScroller({ tickers }: TickerScrollerProps) {
	const shouldAnimate = tickers.length >= 6;

	if (!shouldAnimate) {
		// Affichage statique pour 5 éléments ou moins
		return (
			<div className="flex items-center gap-2">
				{tickers.map((t) => (
					<TickerPill key={t.symbol} {...t} />
				))}
			</div>
		);
	}

	// Animation continue pour 6+ éléments
	return (
		<div className="relative overflow-hidden min-w-56 w-full max-w-140 xl:max-w-2xl">
			<div className="ticker-scroll flex items-center gap-2 whitespace-nowrap">
				{/* Première copie pour l'effet seamless */}
				{tickers.map((t) => (
					<TickerPill key={`first-${t.symbol}`} {...t} />
				))}
				{/* Deuxième copie pour l'effet seamless */}
				{tickers.map((t) => (
					<TickerPill key={`second-${t.symbol}`} {...t} />
				))}
			</div>
		</div>
	);
}
