import TickerScroller from "./TickerScroller";
import { useAssets } from "@/hooks/useAssets";

interface TopbarProps {
	status: "ready" | "optimizing" | "paused";
}

export default function Topbar({ status }: TopbarProps) {
	const { assets } = useAssets();
	const tickers = assets.map((asset) => ({
		symbol: asset.ticker,
		value: `${asset.expectedReturn >= 0 ? "+" : ""}${asset.expectedReturn.toFixed(2)}%`,
		positive: asset.expectedReturn >= 0,
	}));

	const statusLabel =
		status === "optimizing"
			? "Optimizing..."
			: status === "paused"
				? "Paused"
				: "Ready to start";

	const statusClass =
		status === "optimizing"
			? "bg-green-500 text-white"
			: status === "paused"
				? "bg-blue-500 text-white"
				: "bg-gray-300 text-gray-700";

	return (
		<header
			className="h-13 bg-surface border-b
                       border-gray-200 flex items-center
                       justify-between px-6 shrink-0"
		>
			{/* Logo */}
			<div className="flex items-center gap-2.5">
				<span
					className="w-2 h-2 rounded-full bg-green-500
                         animate-pulse"
				/>
				<span className="text-[15px] font-semibold">GenAlpha</span>
				<span className="w-px h-4 bg-gray-200" />
				<span className="text-[12px] text-gray-600">
					Genetic Algorithm Optimizer
				</span>
			</div>

			{/* Tickers avec animation conditionnelle */}
			<TickerScroller tickers={tickers} />

			{/* Right */}
			<div className="flex items-center gap-3">
				<div
					className={`px-2 py-1 rounded-full text-[10px] font-medium ${statusClass}`}
				>
					{statusLabel}
				</div>
				<span className="text-[12px] text-gray-600">Dark</span>
				<div
					className="w-8 h-8 rounded-full bg-elevated
                        border border-gray-200
                        flex items-center justify-center
                        text-[11px] text-gray-600"
				>
					JR
				</div>
			</div>
		</header>
	);
}
