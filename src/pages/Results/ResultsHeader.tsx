import { ArrowLeft } from "lucide-react";
import type { Portfolio, GAParams } from "@/lib/geneticAlgorithm";

interface ResultsHeaderProps {
	best: Portfolio;
	paretoCount: number;
	params: GAParams;
	onBack: () => void;
}

function ParamPill({ label, value }: { label: string; value: string }) {
	return (
		<span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-elevated border border-gray-200/50 text-gray-600">
			{label}: <span className="text-gray-900">{value}</span>
		</span>
	);
}

export default function ResultsHeader({ best, paretoCount, params, onBack }: ResultsHeaderProps) {
	return (
		<div className="border-b border-gray-200/30 px-8 py-4 flex items-start justify-between">
			{/* Left — back + scores */}
			<div className="flex flex-col gap-3">
				<button
					onClick={onBack}
					className="flex items-center gap-2 text-[12px] text-gray-600 hover:text-gray-900 transition-colors w-fit"
				>
					<ArrowLeft size={14} />
					Back to Dashboard
				</button>

				<div className="flex items-end gap-8">
					<div>
						<p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
							Best Sharpe Ratio
						</p>
						<p className="font-mono text-[42px] font-semibold leading-none text-green-400">
							{best.sharpe.toFixed(2)}
						</p>
					</div>
					<div>
						<p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
							Pareto Solutions
						</p>
						<p className="font-mono text-[42px] font-semibold leading-none text-blue-300">
							{paretoCount}
						</p>
					</div>
				</div>
			</div>

			<div className="flex flex-wrap gap-2 justify-end max-w-xs">
				<ParamPill label="Population" value={String(params.populationSize)} />
				<ParamPill label="Generations" value={String(params.generations)} />
				<ParamPill label="Crossover" value={`${params.crossoverRate}%`} />
				<ParamPill label="Mutation" value={`${params.mutationRate}%`} />
			</div>
		</div>
	);
}
