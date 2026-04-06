import { useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Asset } from "@/lib/geneticAlgorithm";

interface DeleteModalProps {
	asset: Asset;
	onConfirm: () => void;
	onCancel: () => void;
}

export default function DeleteModal({
	asset,
	onConfirm,
	onCancel,
}: DeleteModalProps) {
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				onCancel();
			}
			if (event.key === "Enter") {
				event.preventDefault();
				onConfirm();
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [onCancel, onConfirm]);

	return (
		<div
			className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
			onClick={onCancel}
		>
			<div
				className="bg-elevated border border-gray-200 rounded-lg p-6 w-80"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center gap-3 mb-4">
					<div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
						<Trash2 size={14} className="text-red-500" />
					</div>
					<h3 className="text-[14px] font-semibold text-gray-900">
						Delete Asset
					</h3>
				</div>

				<p className="text-[13px] text-gray-600 mb-6">
					Are you sure you want to remove{" "}
					<span className="font-mono font-semibold text-gray-900">
						{asset.ticker}
					</span>
					? This cannot be undone.
				</p>

				<div className="flex gap-2">
					<Button
						variant="outline"
						className="flex-1 text-[13px]"
						onClick={onCancel}
					>
						Cancel
					</Button>
					<Button
						className="flex-1 text-[13px] bg-red-500 hover:bg-red-600 text-white border-0"
						onClick={onConfirm}
					>
						Delete
					</Button>
				</div>
			</div>
		</div>
	);
}
