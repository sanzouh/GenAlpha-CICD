import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultsBannerProps {
	paretoSize: number;
	onViewResults?: () => void | Promise<void>;
}

export default function ResultsBanner({
	paretoSize,
	onViewResults,
}: ResultsBannerProps) {
	return (
		<div className="card flex items-center justify-between bg-linear-to-r from-green-950/20 to-emerald-950/20 border border-green-500/30">
			<p className="font-mono text-[12px] text-green-400">
				<span className="text-green-500">✓</span> 3 profile champions selected from {paretoSize} Pareto candidates
			</p>
			<Button
				onClick={onViewResults}
				className="h-7 px-3 text-[12px] font-semibold gap-1 bg-green-500 hover:bg-green-600 text-white"
			>
				View Results
				<ChevronRight size={14} />
			</Button>
		</div>
	);
}

