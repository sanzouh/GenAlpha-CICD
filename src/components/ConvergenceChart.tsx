import { memo, type FC } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	type TooltipContentProps,
} from "recharts";

interface ConvergenceChartProps {
	// Un point par génération : { gen: 1, sharpe: 0.42 }
	data: { gen: number; sharpe: number }[];
}

// Tooltip custom — le tooltip par défaut de Recharts est en thème light
const CustomTooltip: FC<Partial<TooltipContentProps<number, string>>> = ({
	active,
	payload,
}) => {
	if (!active || !payload?.length) return null;
	const point = payload[0];
	const gen =
		typeof point.payload?.gen === "number" ? point.payload.gen : undefined;
	const value =
		typeof point.value === "number" ? point.value : Number(point.value);
	return (
		<div className="bg-elevated border border-gray-200 rounded-md px-3 py-2">
			<p className="font-mono text-[11px] text-gray-600">Gen {gen}</p>
			<p className="font-mono text-[12px] text-green-400 font-medium">
				Sharpe {Number(value).toFixed(3)}
			</p>
		</div>
	);
};

export default memo(function ConvergenceChart({ data }: ConvergenceChartProps) {
	return (
		<div className="card flex-1 flex flex-col gap-3 overflow-hidden">
			<p className="text-[13px] font-semibold uppercase text-gray-900">
				Fitness Convergence
			</p>

			{data.length === 0 ? (
				// État vide — avant que l'algo tourne
				<div className="flex-1 flex items-center justify-center">
					<span className="text-gray-400 text-sm">
						Waiting for optimization...
					</span>
				</div>
			) : (
				<ResponsiveContainer width="100%" height="100%" debounce={0}>
					<LineChart
						data={data}
						margin={{ top: 12, right: 12, bottom: 8, left: 0 }}
					>
						<XAxis
							dataKey="gen"
							tick={{
								fontFamily: "JetBrains Mono",
								fontSize: 9,
								fill: "#5c5b57",
							}}
							tickLine={true}
							axisLine={true}
							padding={{ left: 8, right: 8 }}
						/>
						<YAxis
							domain={["auto", "auto"]}
							tick={{
								fontFamily: "JetBrains Mono",
								fontSize: 9,
								fill: "#5c5b57",
							}}
							tickLine={true}
							axisLine={true}
							tickFormatter={(v) => v.toFixed(2)}
							padding={{ top: 8, bottom: 8 }}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Line
							type="monotone"
							dataKey="sharpe"
							stroke="#1d9e75"
							strokeWidth={1.5}
							dot={false}
							activeDot={{ r: 3, fill: "#3db890" }}
							isAnimationActive={false}
							animationDuration={0}
						/>
					</LineChart>
				</ResponsiveContainer>
			)}
		</div>
	);
});
