import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Asset } from "@/lib/geneticAlgorithm";
import type { ReactNode } from "react";

type FormData = {
	ticker: string;
	name: string;
	expectedReturn: string;
	volatility: number;
	marketCorr: number;
};

interface AssetFormModalProps {
	mode: "add" | "edit";
	initial?: Asset;
	onSave: (data: Omit<Asset, "color">) => void;
	onClose: () => void;
}

const EMPTY: FormData = {
	ticker: "",
	name: "",
	expectedReturn: "0",
	volatility: 0,
	marketCorr: 0.3,
};

function Field({
	label,
	children,
	error,
}: {
	label: string;
	children: ReactNode;
	error?: string;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<label className="text-[11px] font-medium text-gray-600 uppercase tracking-wide">
				{label}
			</label>
			{children}
			{error && <p className="text-[10px] text-red-500">{error}</p>}
		</div>
	);
}

const inputClass =
	"w-full px-3 py-2 rounded-md text-[13px] font-mono text-gray-900 " +
	"bg-overlay border border-gray-200 outline-none " +
	"focus:border-green-500 transition-colors";

export default function AssetFormModal({
	mode,
	initial,
	onSave,
	onClose,
}: AssetFormModalProps) {
	const [form, setForm] = useState<FormData>(() =>
		initial
			? {
					ticker: initial.ticker,
					name: initial.name,
					expectedReturn: initial.expectedReturn.toString(),
					volatility: initial.volatility,
					marketCorr: initial.marketCorr,
				}
			: EMPTY,
	);

	const [errors, setErrors] = useState<{ [key in keyof FormData]?: string }>(
		{},
	);

	const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
		setForm((prev) => ({ ...prev, [key]: value }));
		// Clear error on change
		if (errors[key]) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next[key];
				return next;
			});
		}
		// Validate volatility
		if (key === "volatility" && (value as number) <= 0) {
			setErrors((prev) => ({
				...prev,
				volatility: "Volatility must be positive",
			}));
		}
	};

	const valid =
		form.ticker.trim() &&
		form.name.trim() &&
		!Number.isNaN(parseFloat(form.expectedReturn)) &&
		form.volatility > 0 &&
		Object.keys(errors).length === 0;

	const handleSave = useCallback(() => {
		onSave({
			ticker: form.ticker,
			name: form.name,
			expectedReturn: parseFloat(form.expectedReturn),
			volatility: form.volatility,
			marketCorr: form.marketCorr,
		});
		onClose();
	}, [form, onClose, onSave]);

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				onClose();
			}
			if (event.key === "Enter" && valid) {
				event.preventDefault();
				handleSave();
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [valid, onClose, handleSave]);

	return (
		<div
			className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
			onClick={onClose}
		>
			<div
				className="bg-elevated border border-gray-200 rounded-lg p-6 w-96"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between mb-5">
					<h3 className="text-[14px] font-semibold text-gray-900">
						{mode === "add" ? "Add Asset" : "Edit Asset"}
					</h3>
					<button
						onClick={onClose}
						className="text-gray-600 hover:text-gray-900 transition-colors"
					>
						<X size={16} />
					</button>
				</div>

				{/* Form */}
				<div className="flex flex-col gap-4">
					<div className="grid grid-cols-2 gap-4">
						<Field label="Ticker">
							<input
								className={inputClass}
								value={form.ticker}
								disabled={mode === "edit"}
								onChange={(e) => set("ticker", e.target.value.toUpperCase())}
								placeholder="AAPL"
								maxLength={8}
							/>
						</Field>
						<Field label="Name">
							<input
								className={inputClass}
								value={form.name}
								onChange={(e) => set("name", e.target.value)}
								placeholder="Apple Inc."
							/>
						</Field>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<Field label="Expected Return (%)">
							<input
								type="number"
								step="0.1"
								className={inputClass}
								value={form.expectedReturn}
								onChange={(e) => set("expectedReturn", e.target.value)}
							/>
						</Field>
						<Field label="Volatility (%)" error={errors.volatility}>
							<input
								type="number"
								step="0.1"
								min="0"
								className={inputClass}
								value={form.volatility}
								onChange={(e) =>
									set("volatility", parseFloat(e.target.value) || 0)
								}
							/>
						</Field>
					</div>

					<Field label="Market Correlation [-1 to 1]">
						<input
							type="number"
							step="0.05"
							min="-1"
							max="1"
							className={inputClass}
							value={form.marketCorr}
							onChange={(e) =>
								set("marketCorr", Math.max(-1, Math.min(1, parseFloat(e.target.value) || 0)))
							}
						/>
					</Field>
				</div>

				{/* Footer */}
				<div className="flex gap-2 mt-6">
					<Button
						variant="outline"
						className="flex-1 text-[13px]"
						onClick={onClose}
					>
						Cancel
					</Button>
					<Button
						className="flex-1 text-[13px] bg-green-500 hover:bg-green-600 text-white border-0"
						disabled={!valid}
						onClick={handleSave}
					>
						{mode === "add" ? "Add Asset" : "Save Changes"}
					</Button>
				</div>
			</div>
		</div>
	);
}
