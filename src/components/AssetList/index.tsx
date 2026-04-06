import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAssets } from "@/hooks/useAssets";
import AssetTable from "./AssetTable";
import AssetFormModal from "./AssetFormModal";
import DeleteModal from "./DeleteModal";
import type { Asset } from "@/lib/geneticAlgorithm";

type ModalState =
	| { type: "none" }
	| { type: "add" }
	| { type: "edit"; asset: Asset }
	| { type: "delete"; asset: Asset };

export default function AssetList() {
	const { assets, add, edit, remove } = useAssets();
	const [modal, setModal] = useState<ModalState>({ type: "none" });

	const close = () => setModal({ type: "none" });

	return (
		<>
			<div className="bg-surface border border-gray-200 rounded-xl p-3 flex flex-col gap-3 h-full">
				<div className="flex items-center justify-between shrink-0">
					<p className="text-[13px] font-semibold uppercase text-gray-900">
						Assets
					</p>
					<Button
						variant="outline"
						size="sm"
						className="h-8 px-4 text-[11px] gap-1"
						onClick={() => setModal({ type: "add" })}
					>
						<Plus size={12} />
						Add
					</Button>
				</div>

				<div className="flex-1 min-h-0 overflow-y-auto pr-1">
					<AssetTable
						assets={assets}
						onEdit={(asset) => setModal({ type: "edit", asset })}
						onDelete={(asset) => setModal({ type: "delete", asset })}
					/>
				</div>
			</div>

			{/* Modals */}
			{modal.type === "add" && (
				<AssetFormModal key="add" mode="add" onSave={add} onClose={close} />
			)}

			{modal.type === "edit" && (
				<AssetFormModal
					key={`edit-${modal.asset.ticker}`}
					mode="edit"
					initial={modal.asset}
					onSave={(data) => edit(modal.asset.ticker, data)}
					onClose={close}
				/>
			)}

			{modal.type === "delete" && (
				<DeleteModal
					asset={modal.asset}
					onConfirm={() => {
						remove(modal.asset.ticker);
						close();
					}}
					onCancel={close}
				/>
			)}
		</>
	);
}
