import { useState, useRef, useEffect } from "react";
import { Trash2, MoreHorizontal } from "lucide-react";
import type { Asset } from "@/lib/geneticAlgorithm";

interface AssetTableProps {
	assets: Asset[];
	onEdit: (asset: Asset) => void;
	onDelete: (asset: Asset) => void;
}

function AssetCard({
	asset,
	onEdit,
	onDelete,
}: {
	asset: Asset;
	onEdit: () => void;
	onDelete: () => void;
}) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	// Ferme le dropdown si on clique ailleurs
	useEffect(() => {
		if (!open) return;
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [open]);

	return (
		<div
			onClick={onEdit}
			className="group bg-elevated rounded-lg p-2 flex flex-col gap-2
                    border border-gray-200/50 hover:border-gray-200
                    hover:bg-overlay transition-all duration-200 relative cursor-pointer"
		>
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className={`w-2 h-2 rounded-full shrink-0 ${asset.color}`} />
					<span className="font-mono text-[12px] font-semibold text-gray-900">
						{asset.ticker}
					</span>
				</div>

				{/* Bouton ⋯ — invisible au repos, visible au hover de la card */}
				<div ref={ref} className="relative">
					<button
						onClick={(e) => {
							e.stopPropagation();
							setOpen((v) => !v);
						}}
						className="w-6 h-6 flex items-center justify-center rounded
                       text-gray-400 opacity-300 group-hover:opacity-100
                       hover:text-gray-900 hover:bg-gray-200/20
                       transition-all duration-150"
					>
						<MoreHorizontal size={13} />
					</button>

					{/* Dropdown */}
					{open && (
						<div
							className="absolute right-0 top-7 z-50 w-23
                            bg-highlight border border-gray-200
                            rounded-lg shadow-lg overflow-hidden"
						>
							<button
								onClick={(e) => {
									e.stopPropagation();
									onDelete();
									setOpen(false);
								}}
								className="w-full flex items-center gap-2.5 px-3 py-2
                           text-[12px] text-red-400 hover:text-red-300
                           hover:bg-red-400/10 transition-colors duration-150"
							>
								<Trash2 size={11} />
								Delete
							</button>
						</div>
					)}
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
					<span
						className={`font-mono text-[12px] font-medium ${asset.expectedReturn >= 0 ? "text-green-400" : "text-red-400"}`}
					>
						{asset.expectedReturn >= 0 ? "+" : ""}
						{asset.expectedReturn.toFixed(1)}%
					</span>
				</div>
				<div className="flex flex-col gap-0.5 items-end">
					<span className="text-[9px] text-gray-400 uppercase tracking-wider">
						Vol
					</span>
					<span className="font-mono text-[12px] font-medium text-amber-300">
						{asset.volatility.toFixed(1)}%
					</span>
				</div>
			</div>

			{/* Barre rendement */}
			<div className="h-0.5 bg-gray-200/20 rounded-full overflow-hidden">
				<div
					className={`h-full rounded-full ${asset.color}`}
					style={{
						width: `${Math.min(100, (asset.expectedReturn / 30) * 100)}%`,
					}}
				/>
			</div>
		</div>
	);
}

export default function AssetTable({
	assets,
	onEdit,
	onDelete,
}: AssetTableProps) {
	return (
		<div className="grid grid-cols-2 gap-2 xl:grid-cols-3">
			{assets.map((asset) => (
				<AssetCard
					key={asset.ticker}
					asset={asset}
					onEdit={() => onEdit(asset)}
					onDelete={() => onDelete(asset)}
				/>
			))}
		</div>
	);
}
