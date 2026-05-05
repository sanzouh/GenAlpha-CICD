import { useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ASSETS } from "@/data/assets";
import type { Asset } from "@/lib/geneticAlgorithm";

interface AssetFormData {
	ticker: string;
	name: string;
	expectedReturn: number;
	volatility: number;
	marketCorr: number;
}

const Modal = ({
	isOpen,
	onClose,
	title,
	children,
}: {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}) => {
	if (!isOpen) return null;
	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold">{title}</h3>
					<Button variant="ghost" size="sm" onClick={onClose}>
						<X size={16} />
					</Button>
				</div>
				{children}
			</div>
		</div>
	);
};

export default function AssetList() {
	const [assets, setAssets] = useState<Asset[]>(ASSETS);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
	const [deletingAsset, setDeletingAsset] = useState<Asset | null>(null);
	const [formData, setFormData] = useState<AssetFormData>({
		ticker: "",
		name: "",
		expectedReturn: 0,
		volatility: 0,
		marketCorr: 0.3,
	});

	const handleAdd = () => {
		setFormData({ ticker: "", name: "", expectedReturn: 0, volatility: 0, marketCorr: 0.3 });
		setShowAddModal(true);
	};

	const handleEdit = (asset: Asset) => {
		setFormData({
			ticker: asset.ticker,
			name: asset.name,
			expectedReturn: asset.expectedReturn,
			volatility: asset.volatility,
			marketCorr: asset.marketCorr,
		});
		setEditingAsset(asset);
		setShowEditModal(true);
	};

	const handleDelete = (asset: Asset) => {
		setDeletingAsset(asset);
		setShowDeleteModal(true);
	};

	const confirmDelete = () => {
		if (deletingAsset) {
			setAssets(assets.filter((a) => a.ticker !== deletingAsset.ticker));
			setShowDeleteModal(false);
			setDeletingAsset(null);
		}
	};

	const saveAsset = () => {
		if (showAddModal) {
			const newAsset: Asset = {
				...formData,
				color: `bg-${formData.ticker.toLowerCase()}`,
			};
			setAssets([...assets, newAsset]);
			setShowAddModal(false);
		} else if (showEditModal && editingAsset) {
			setAssets(
				assets.map((a) =>
					a.ticker === editingAsset.ticker
						? { ...formData, color: editingAsset.color }
						: a,
				),
			);
			setShowEditModal(false);
			setEditingAsset(null);
		}
	};

	return (
		<div className="card flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between mb-3">
				<p className="text-[13px] font-semibold uppercase text-gray-900">
					Assets
				</p>
				<Button
					variant="outline"
					size="sm"
					className="h-7 px-2 text-[11px] gap-1"
					onClick={handleAdd}
				>
					<Plus size={12} />
					Add
				</Button>
			</div>

			{/* Table */}
			<div className="border border-gray-200 rounded-md overflow-hidden">
				{/* Table Header */}
				<div className="bg-gray-50 border-b border-gray-200 px-3 py-2">
					<div className="grid grid-cols-4 gap-2 text-[11px] font-medium text-gray-600">
						<span>Ticker</span>
						<span>Return</span>
						<span>Vol</span>
						<span>Actions</span>
					</div>
				</div>

				{/* Table Body */}
				<div className="max-h-32 overflow-y-auto">
					{assets.map((asset) => (
						<div
							key={asset.ticker}
							className="border-b border-gray-100 last:border-b-0 px-3 py-2 hover:bg-gray-50 cursor-pointer"
							onClick={() => handleEdit(asset)}
						>
							<div className="grid grid-cols-4 gap-2 items-center">
								{/* Ticker */}
								<div className="flex items-center gap-2">
									<span className={`w-2 h-2 rounded-full ${asset.color}`} />
									<span className="font-mono text-[12px] font-medium">
										{asset.ticker}
									</span>
								</div>

								{/* Return */}
								<span className="font-mono text-[11px] text-green-600">
									+{asset.expectedReturn.toFixed(1)}%
								</span>

								{/* Volatility */}
								<span className="font-mono text-[11px] text-orange-600">
									{asset.volatility.toFixed(1)}%
								</span>

								{/* Actions */}
								<div className="flex items-center gap-1">
									<Button
										variant="ghost"
										size="sm"
										className="h-6 w-6 p-0 hover:bg-blue-100"
										onClick={(e) => {
											e.stopPropagation();
											handleEdit(asset);
										}}
									>
										<Edit size={12} className="text-blue-600" />
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="h-6 w-6 p-0 hover:bg-red-100"
										onClick={(e) => {
											e.stopPropagation();
											handleDelete(asset);
										}}
									>
										<Trash2 size={12} className="text-red-600" />
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Add Modal */}
			<Modal
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
				title="Add Asset"
			>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">Ticker</label>
						<input
							type="text"
							className="w-full px-3 py-2 border border-gray-300 rounded-md"
							value={formData.ticker}
							onChange={(e) =>
								setFormData({
									...formData,
									ticker: e.target.value.toUpperCase(),
								})
							}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Name</label>
						<input
							type="text"
							className="w-full px-3 py-2 border border-gray-300 rounded-md"
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-1">
								Expected Return (%)
							</label>
							<input
								type="number"
								step="0.1"
								className="w-full px-3 py-2 border border-gray-300 rounded-md"
								value={formData.expectedReturn}
								onChange={(e) =>
									setFormData({
										...formData,
										expectedReturn: parseFloat(e.target.value) || 0,
									})
								}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">
								Volatility (%)
							</label>
							<input
								type="number"
								step="0.1"
								className="w-full px-3 py-2 border border-gray-300 rounded-md"
								value={formData.volatility}
								onChange={(e) =>
									setFormData({
										...formData,
										volatility: parseFloat(e.target.value) || 0,
									})
								}
							/>
						</div>
					</div>
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => setShowAddModal(false)}>
							Cancel
						</Button>
						<Button onClick={saveAsset}>Add Asset</Button>
					</div>
				</div>
			</Modal>

			{/* Edit Modal */}
			<Modal
				isOpen={showEditModal}
				onClose={() => setShowEditModal(false)}
				title="Edit Asset"
			>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">Ticker</label>
						<input
							type="text"
							className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
							value={formData.ticker}
							disabled
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Name</label>
						<input
							type="text"
							className="w-full px-3 py-2 border border-gray-300 rounded-md"
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-1">
								Expected Return (%)
							</label>
							<input
								type="number"
								step="0.1"
								className="w-full px-3 py-2 border border-gray-300 rounded-md"
								value={formData.expectedReturn}
								onChange={(e) =>
									setFormData({
										...formData,
										expectedReturn: parseFloat(e.target.value) || 0,
									})
								}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">
								Volatility (%)
							</label>
							<input
								type="number"
								step="0.1"
								className="w-full px-3 py-2 border border-gray-300 rounded-md"
								value={formData.volatility}
								onChange={(e) =>
									setFormData({
										...formData,
										volatility: parseFloat(e.target.value) || 0,
									})
								}
							/>
						</div>
					</div>
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => setShowEditModal(false)}>
							Cancel
						</Button>
						<Button onClick={saveAsset}>Save Changes</Button>
					</div>
				</div>
			</Modal>

			{/* Delete Modal */}
			<Modal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				title="Delete Asset"
			>
				<div className="space-y-4">
					<p className="text-gray-600">
						Are you sure you want to delete{" "}
						<strong>{deletingAsset?.ticker}</strong>? This action cannot be
						undone.
					</p>
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => setShowDeleteModal(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={confirmDelete}>
							Delete
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
}
