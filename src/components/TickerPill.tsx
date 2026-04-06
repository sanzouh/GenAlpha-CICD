interface TickerPillProps {
	symbol: string;
	value: string;
	positive: boolean;
}

export default function TickerPill({
	symbol,
	value,
	positive,
}: TickerPillProps) {
	return (
		<span className={positive ? "pill-positive" : "pill-negative"}>
			{symbol}&nbsp;{value}
		</span>
	);
}
