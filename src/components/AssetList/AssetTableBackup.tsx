import { Edit, Trash2 } from "lucide-react";
import type { Asset } from "@/lib/geneticAlgorithm";

interface AssetTableProps {
	assets: Asset[];
	onEdit: (asset: Asset) => void;
	onDelete: (asset: Asset) => void;
}

export default function AssetTable({
	assets,
	onEdit,
	onDelete,
}: AssetTableProps) {
	return (
		<div className="grid grid-cols-2 gap-2">
			{assets.map((asset) => (
				<div
					key={asset.ticker}
					className="bg-elevated rounded-lg p-3 flex flex-col gap-2 border border-gray-200/50 
           hover:border-gray-200 hover:bg-overlay transition-all duration-200"
				>
					{/* Header card */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span
								className={`w-2 h-2 rounded-full shrink-0 ${asset.color}`}
							/>
							<span className="font-mono text-[12px] font-semibold text-gray-900">
								{asset.ticker}
							</span>
						</div>
						<div className="flex items-center gap-0.5">
							<button
								className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
								onClick={() => onEdit(asset)}
							>
								<Edit size={11} />
							</button>
							<button
								className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
								onClick={() => onDelete(asset)}
							>
								<Trash2 size={11} />
							</button>
						</div>
					</div>

					{/* Nom */}
					<p className="text-[10px] text-gray-400 leading-none truncate">
						{asset.name}
					</p>

					{/* Métriques */}
					<div className="flex items-center justify-between pt-1 border-t border-gray-200/30">
						<div className="flex flex-col gap-0.5">
							<span className="text-[9px] text-gray-400 uppercase tracking-wider">
								Return
							</span>
							<span className="font-mono text-[12px] font-medium text-green-400">
								+{asset.expectedReturn.toFixed(1)}%
							</span>
						</div>
						<div className="flex flex-col gap-0.5 items-end">
							<span className="text-[9px] text-gray-400 uppercase tracking-wider">
								Vol
							</span>
							<span className="font-mono text-[12px] font-medium text-red-400">
								{asset.volatility.toFixed(1)}%
							</span>
						</div>
					</div>

					{/* Barre visuelle rendement */}
					<div className="h-0.5 bg-gray-200/20 rounded-full overflow-hidden">
						<div
							className={`h-full rounded-full ${asset.color}`}
							style={{
								width: `${Math.min(100, (asset.expectedReturn / 30) * 100)}%`,
							}}
						/>
					</div>
				</div>
			))}
		</div>
	);
}
