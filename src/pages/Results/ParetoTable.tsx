import type { Portfolio } from "@/lib/geneticAlgorithm";
import type { Asset } from "@/lib/geneticAlgorithm";

interface ParetoTableProps {
	portfolios: Portfolio[]; // déjà filtrés par le tab
	assets: Asset[];
	selected: number | null;
	best: Portfolio;
	onSelect: (index: number) => void;
}

// Pill d'allocation par asset — ex: "AAPL 25%"
function AllocationPill({
	ticker,
	weight,
}: {
	ticker: string;
	weight: number;
	color: string;
}) {
	return (
		<span
			className="font-mono text-[10px] px-1.5 py-0.5 rounded border"
			style={{
				color: `var(--color-${ticker.toLowerCase()})`,
				borderColor: `color-mix(in srgb, var(--color-${ticker.toLowerCase()}) 30%, transparent)`,
				background: `color-mix(in srgb, var(--color-${ticker.toLowerCase()}) 10%, transparent)`,
			}}
		>
			{ticker} {Math.round(weight * 100)}%
		</span>
	);
}

export default function ParetoTable({
	portfolios,
	assets,
	selected,
	best,
	onSelect,
}: ParetoTableProps) {
	const isBest = (p: Portfolio) => p === best;

	return (
		<div className="card overflow-hidden p-0">
			{/* Header */}
			<div
				className="grid grid-cols-[40px_140px_100px_100px_100px_1fr_120px]
                      px-4 py-2.5 border-b border-gray-200/30
                      text-[10px] font-medium text-gray-400 uppercase tracking-wider"
			>
				<span>#</span>
				<span>Portfolio</span>
				<span>Return</span>
				<span>Risk</span>
				<span>Sharpe</span>
				<span>Allocations</span>
				<span></span>
			</div>

			{/* Rows */}
			<div className="max-h-72 overflow-y-auto">
				{portfolios.map((p, i) => (
					<div
						key={i}
						className={`grid grid-cols-[40px_140px_100px_100px_100px_1fr_120px]
                        px-4 py-3 border-b border-gray-200/10 items-center
                        transition-colors duration-150 cursor-pointer
                        ${
													selected === i
														? "bg-blue-500/10 border-l-2 border-l-blue-500"
														: "hover:bg-elevated"
												}`}
						onClick={() => onSelect(i)}
					>
						<span className="font-mono text-[12px] text-gray-400">{i + 1}</span>

						<div className="flex items-center gap-2">
							<span className="text-[12px] text-gray-900">
								Portfolio {i + 1}
							</span>
							{isBest(p) && (
								<span
									className="text-[9px] px-1.5 py-0.5 rounded-full
                                 bg-green-500/15 text-green-400 border border-green-500/25"
								>
									★ Best
								</span>
							)}
						</div>

						<span className="font-mono text-[13px] text-green-400">
							{p.expectedReturn.toFixed(1)}%
						</span>

						<span className="font-mono text-[13px] text-red-400">
							{p.volatility.toFixed(1)}%
						</span>

						<span className="font-mono text-[13px] text-gray-900">
							{p.sharpe.toFixed(2)}
						</span>

						<div className="flex flex-wrap gap-1">
							{assets.map((asset, j) => (
								<AllocationPill
									key={asset.ticker}
									ticker={asset.ticker}
									weight={p.weights[j]}
									color={asset.color}
								/>
							))}
						</div>

						<div className="flex justify-end">
							<button
								onClick={() => onSelect(i)}
								className={`px-3 py-1.5 rounded-md text-[11px] font-medium
                            transition-all duration-150
                            ${
															selected === i
																? "bg-green-500 text-white"
																: "border border-gray-200/40 text-gray-600 hover:text-gray-900 hover:border-gray-200"
														}`}
							>
								{selected === i ? "Selected →" : "Select →"}
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
