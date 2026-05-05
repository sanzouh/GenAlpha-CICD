import { useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle, X } from "lucide-react";
import type { Portfolio, Asset } from "@/lib/geneticAlgorithm";

interface ConfirmModalProps {
	portfolio: Portfolio;
	assets: Asset[];
	profile: string;
	onClose: () => void;
}

export default function ConfirmModal({ portfolio, assets, profile, onClose }: ConfirmModalProps) {
	useEffect(() => {
		confetti({
			particleCount: 120,
			spread: 80,
			origin: { y: 0.55 },
			colors: ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"],
			scalar: 0.9,
		});
	}, []);

	const top5 = assets
		.map((a, i) => ({ ticker: a.ticker, weight: portfolio.weights[i] }))
		.filter((x) => x.weight >= 0.03)
		.sort((a, b) => b.weight - a.weight)
		.slice(0, 5);

	const vsMarket = portfolio.expectedReturn - 8.0;

	return (
		<div
			className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
			onClick={onClose}
		>
			<div
				className="bg-elevated border border-gray-200/30 rounded-xl p-6 w-full max-w-md mx-4 flex flex-col gap-5"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-full bg-green-500/15 flex items-center justify-center">
							<CheckCircle size={20} className="text-green-400" />
						</div>
						<div>
							<p className="text-[14px] font-semibold text-gray-900">Portfolio Confirmed</p>
							<p className="text-[12px] text-gray-400 capitalize">{profile} profile</p>
						</div>
					</div>
					<button onClick={onClose} className="text-gray-600 hover:text-gray-900 transition-colors">
						<X size={16} />
					</button>
				</div>

				{/* Métriques */}
				<div className="grid grid-cols-4 gap-2">
					{[
						{ label: "Return", value: `${portfolio.expectedReturn.toFixed(1)}%`, color: "text-green-400" },
						{ label: "Risk", value: `${portfolio.volatility.toFixed(1)}%`, color: "text-red-400" },
						{ label: "Sharpe", value: portfolio.sharpe.toFixed(2), color: "text-gray-900" },
						{
							label: "vs S&P 500",
							value: `${vsMarket >= 0 ? "+" : ""}${vsMarket.toFixed(1)}%`,
							color: vsMarket >= 0 ? "text-green-400" : "text-amber-300",
						},
					].map(({ label, value, color }) => (
						<div key={label} className="bg-overlay rounded-lg p-3">
							<p className="text-[9px] text-gray-400 uppercase tracking-wider mb-1">{label}</p>
							<p className={`font-mono text-[15px] font-semibold ${color}`}>{value}</p>
						</div>
					))}
				</div>

				{/* Top allocations */}
				<div>
					<p className="text-[11px] text-gray-400 uppercase tracking-wider mb-3">Top Allocations</p>
					<div className="flex flex-col gap-2.5">
						{top5.map(({ ticker, weight }) => (
							<div key={ticker} className="flex items-center gap-3">
								<span
									className="w-2 h-2 rounded-full shrink-0"
									style={{ background: `var(--color-${ticker.toLowerCase()})` }}
								/>
								<span className="font-mono text-[12px] font-semibold text-gray-900 w-14">{ticker}</span>
								<div className="flex-1 h-1 bg-gray-200/20 rounded-full overflow-hidden">
									<div
										className="h-full rounded-full"
										style={{
											width: `${Math.round(weight * 100)}%`,
											background: `var(--color-${ticker.toLowerCase()})`,
										}}
									/>
								</div>
								<span className="font-mono text-[12px] text-gray-600 w-8 text-right">
									{Math.round(weight * 100)}%
								</span>
							</div>
						))}
					</div>
				</div>

				<button
					onClick={onClose}
					className="w-full py-2.5 rounded-lg bg-green-500 hover:bg-green-700 text-white font-semibold text-[13px] transition-colors duration-150"
				>
					Done
				</button>
			</div>
		</div>
	);
}
