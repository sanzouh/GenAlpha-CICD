import { memo, type FC } from "react";
import {
	ScatterChart,
	Scatter,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	ReferenceLine,
} from "recharts";
import type { TooltipContentProps } from "recharts";

// Un point du scatter = un portefeuille
export interface ScatterPoint {
	volatility: number;
	expectedReturn: number;
}

interface ParetoChartProps {
	population: ScatterPoint[]; // tous les portefeuilles — points gris
	paretoFront: ScatterPoint[]; // solutions non-dominées — points bleus
}

const CustomTooltip: FC<Partial<TooltipContentProps<number, string>>> = ({
	active,
	payload,
}) => {
	if (!active || !payload?.length) return null;
	const point = payload[0].payload as ScatterPoint;
	return (
		<div className="bg-elevated border border-gray-200 rounded-md px-3 py-2">
			<p className="font-mono text-[11px] text-gray-600">
				Volatilité {point.volatility.toFixed(1)}%
			</p>
			<p className="font-mono text-[12px] text-blue-300 font-medium">
				Rendement {point.expectedReturn.toFixed(1)}%
			</p>
		</div>
	);
};

export default memo(function ParetoChart({
	population,
	paretoFront,
}: ParetoChartProps) {
	return (
		<div className="card flex-1 flex flex-col gap-3 overflow-hidden">
			{/* Header */}
			<div className="flex items-center gap-2 shrink-0">
				<p className="text-[13px] font-semibold uppercase text-gray-900">
					Pareto Front
				</p>
				<span className="pill-academic">Multicriteria</span>
				<span className="pill bg-gray-300/10 text-gray-600 border-gray-200/20">
					Non-dominated
				</span>
			</div>

			{population.length === 0 ? (
				<div className="flex-1 flex items-center justify-center">
					<span className="text-gray-400 text-sm">
						Waiting for optimization...
					</span>
				</div>
			) : (
				<>
					<ResponsiveContainer width="100%" height="100%" debounce={0}>
						<ScatterChart margin={{ top: 12, right: 12, bottom: 8, left: 0 }}>
							<XAxis
								dataKey="volatility"
								name="Volatilité"
								tick={{
									fontFamily: "JetBrains Mono",
									fontSize: 9,
									fill: "#5c5b57",
								}}
								tickLine={true}
								axisLine={true}
								padding={{ left: 8, right: 8 }}
								tickFormatter={(v) => `${v.toFixed(1)}%`}
							/>
							<YAxis
								dataKey="expectedReturn"
								name="Rendement"
								tick={{
									fontFamily: "JetBrains Mono",
									fontSize: 9,
									fill: "#5c5b57",
								}}
								tickLine={true}
								axisLine={true}
								padding={{ top: 8, bottom: 8 }}
							/>
							<Tooltip content={<CustomTooltip />} />
							<ReferenceLine
								y={0}
								stroke="rgba(255,255,255,0.08)"
								strokeDasharray="3 3"
							/>
							{/* Population complète — gris discret */}
							<Scatter
								data={population}
								fill="#5c5b57"
								fillOpacity={0.4}
								r={3}
								isAnimationActive={false}
								animationDuration={0}
							/>

							{/* Front de Pareto — courbe triée par volatilité */}
							<Scatter
								data={[...paretoFront].sort((a, b) => a.volatility - b.volatility)}
								fill="#2e7dd1"
								r={4}
								line={{ stroke: "#2e7dd1", strokeWidth: 1.5 }}
								lineType="joint"
								isAnimationActive={false}
								animationDuration={0}
							/>
						</ScatterChart>
					</ResponsiveContainer>

					{/* Légende pédagogique — image 3 */}
					<p className="font-mono text-[10px] text-gray-600 shrink-0">
						Blue points are Pareto-optimal: improving return requires accepting
						more risk.
					</p>
				</>
			)}
		</div>
	);
});
