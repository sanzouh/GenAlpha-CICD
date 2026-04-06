import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { Portfolio } from "@/lib/geneticAlgorithm";
import type { Asset } from "@/lib/geneticAlgorithm";

const SP500_RETURN = 8.0; // référence marché

interface PortfolioDetailProps {
	portfolio: Portfolio;
	assets: Asset[];
	onConfirm: () => void;
}

function DonutChart({
	portfolio,
	assets,
}: {
	portfolio: Portfolio;
	assets: Asset[];
}) {
	const data = assets.map((asset, i) => ({
		name: asset.ticker,
		value: Math.round(portfolio.weights[i] * 100),
		color: `var(--color-${asset.ticker.toLowerCase()})`,
	}));

	return (
		<ResponsiveContainer width={160} height={160}>
			<PieChart>
				<Pie
					data={data}
					cx="50%"
					cy="50%"
					innerRadius={50}
					outerRadius={75}
					dataKey="value"
					strokeWidth={0}
					isAnimationActive={false}
				>
					{data.map((entry, i) => (
						<Cell key={i} fill={entry.color} />
					))}
				</Pie>
				<Tooltip
					content={({ active, payload }) => {
						if (!active || !payload?.length) return null;
						return (
							<div className="bg-elevated border border-gray-200 rounded px-2 py-1">
								<p className="font-mono text-[11px] text-gray-900">
									{payload[0].name} — {payload[0].value}%
								</p>
							</div>
						);
					}}
				/>
			</PieChart>
		</ResponsiveContainer>
	);
}

export default function PortfolioDetail({
	portfolio,
	assets,
	onConfirm,
}: PortfolioDetailProps) {
	const vsMarket = useMemo(
		() => portfolio.expectedReturn - SP500_RETURN,
		[portfolio],
	);

	return (
		<div className="card flex flex-col gap-5">
			<p className="text-[13px] font-semibold uppercase text-gray-900">
				Portfolio Detail
			</p>

			{/* Donut + barres */}
			<div className="flex gap-8 items-start">
				<div className="shrink-0">
					<DonutChart portfolio={portfolio} assets={assets} />
				</div>

				{/* Barres d'allocation */}
				<div className="flex-1 flex flex-col gap-2.5">
					{assets.map((asset, i) => {
						const pct = Math.round(portfolio.weights[i] * 100);
						const color = `var(--color-${asset.ticker.toLowerCase()})`;
						return (
							<div key={asset.ticker} className="flex items-center gap-3">
								<div className="flex items-center gap-2 w-36 shrink-0">
									<span
										className="w-2 h-2 rounded-full shrink-0"
										style={{ background: color }}
									/>
									<span className="font-mono text-[12px] font-semibold text-gray-900">
										{asset.ticker}
									</span>
									<span className="text-[11px] text-gray-400 truncate">
										{asset.name}
									</span>
								</div>

								{/* Barre */}
								<div className="flex-1 h-1 bg-gray-200/20 rounded-full overflow-hidden">
									<div
										className="h-full rounded-full transition-all duration-500"
										style={{ width: `${pct}%`, background: color }}
									/>
								</div>

								<span className="font-mono text-[12px] text-gray-900 w-10 text-right">
									{pct}%
								</span>
							</div>
						);
					})}
				</div>
			</div>

			{/* Métriques */}
			<div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200/20">
				<div>
					<p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
						Expected Return
					</p>
					<p className="font-mono text-[20px] font-semibold text-green-400">
						{portfolio.expectedReturn.toFixed(1)}%
					</p>
				</div>
				<div>
					<p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
						Risk
					</p>
					<p className="font-mono text-[20px] font-semibold text-red-400">
						{portfolio.volatility.toFixed(1)}%
					</p>
				</div>
				<div>
					<p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
						Sharpe Ratio
					</p>
					<p className="font-mono text-[20px] font-semibold text-gray-900">
						{portfolio.sharpe.toFixed(2)}
					</p>
				</div>
				<div>
					<p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
						vs S&P 500
					</p>
					<p
						className={`font-mono text-[20px] font-semibold ${
							vsMarket >= 0 ? "text-green-400" : "text-amber-300"
						}`}
					>
						{vsMarket >= 0 ? "+" : ""}
						{vsMarket.toFixed(1)}%
					</p>
				</div>
			</div>

			{/* Confirm */}
			<button
				onClick={onConfirm}
				className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600
                   text-white font-semibold text-[14px] transition-colors duration-150"
			>
				Confirm Portfolio
			</button>
		</div>
	);
}
