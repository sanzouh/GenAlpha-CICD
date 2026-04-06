import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import type { GAParams } from "@/lib/geneticAlgorithm";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type NumericGAParamKey = {
	[K in keyof GAParams]: GAParams[K] extends number ? K : never;
}[keyof GAParams];

interface ParamConfig {
	key: NumericGAParamKey;
	label: string;
	min: number;
	max: number;
	step: number;
	unit?: string;
	trackClassName?: string;
	explain: (v: number) => string;
}

const PARAM_CONFIG: ParamConfig[] = [
	{
		key: "populationSize",
		label: "Population",
		min: 20,
		max: 200,
		step: 10,
		trackClassName: "bg-green-500",
		explain: (v) =>
			v <= 40
				? "Small population — fast but may miss good solutions."
				: v <= 100
					? "Balanced size — good diversity and speed."
					: "Large — thorough search, slower per generation.",
	},
	{
		key: "generations",
		label: "Generations",
		min: 20,
		max: 100,
		step: 10,
		trackClassName: "bg-green-500",
		explain: (v) =>
			v <= 30
				? "Few generations — quick result, may not fully converge."
				: v <= 60
					? "Standard run — enough time to find good solutions."
					: "Long run — maximizes convergence, takes more time.",
	},
	{
		key: "crossoverRate",
		label: "Crossover",
		min: 50,
		max: 95,
		step: 5,
		unit: "%",
		trackClassName: "bg-green-500",
		explain: (v) =>
			v >= 80
				? "High — fast convergence but narrow exploration."
				: "Balanced — combines solutions while keeping diversity.",
	},
	{
		key: "mutationRate",
		label: "Mutation",
		min: 1,
		max: 10, // Réduit de 20 à 10% pour mutations plus fines
		step: 1,
		unit: "%",
		trackClassName: "bg-amber-500",
		explain: (v) =>
			v >= 5
				? "Moderate — balances exploration and stability."
				: "Low — fine-tunes existing solutions steadily.",
	},
	{
		key: "maxRisk",
		label: "Max Risk",
		min: 5,
		max: 90,
		step: 1,
		unit: "%",
		trackClassName: "bg-red-500",
		explain: (v) =>
			v <= 15
				? "Conservative — prioritizes stability over returns."
				: v <= 25
					? "Balanced — moderate risk for better returns."
					: "Aggressive — maximizes returns, accepts high volatility.",
	},
];

const VOLATILITY_EXPLAIN: Record<GAParams["volatilityMode"], string> = {
	markowitz: "Realistic risk modeling, ideal for analysis.",
	linear: "More dispersed results, ideal for exploration.",
};

interface ParamPanelProps {
	values: GAParams;
	onChange: <K extends keyof GAParams>(key: K, value: GAParams[K]) => void;
}

export default function ParamPanel({ values, onChange }: ParamPanelProps) {
	const [activeKey, setActiveKey] = useState<
		NumericGAParamKey | "volatilityMode" | null
	>(null);

	const explanation = (() => {
		if (!activeKey) return "Hover or move a slider to see guidance.";
		if (activeKey === "volatilityMode")
			return VOLATILITY_EXPLAIN[values.volatilityMode];
		const config = PARAM_CONFIG.find((p) => p.key === activeKey);
		return config?.explain(values[activeKey]) ?? "";
	})();

	return (
		<div className="card flex flex-col gap-1 p-2">
			<p className="text-[12px] font-semibold uppercase text-gray-900 mb-1">
				Algorithm Parameters
			</p>

			{/* Grid 3x2 pour les sliders */}
			<div className="grid grid-cols-2 gap-2">
				{PARAM_CONFIG.map((p) => (
					<div
						key={p.key}
						className="flex flex-col gap-1"
						onMouseEnter={() => setActiveKey(p.key)}
						onMouseLeave={() => setActiveKey(null)}
					>
						<div className="flex items-center justify-between">
							<span className="text-[11px] text-gray-600">{p.label}</span>
							<span className="font-mono text-[11px] font-medium text-gray-900">
								{values[p.key]}
								{p.unit ?? ""}
							</span>
						</div>
						<Slider
							min={p.min}
							max={p.max}
							step={p.step}
							value={[values[p.key]]}
							onValueChange={([v]) => {
								onChange(p.key, v);
								setActiveKey(p.key);
							}}
							trackClassName={p.trackClassName}
							className="w-full"
						/>
					</div>
				))}
			</div>

			{/* Volatility mode */}
			<div
				className="flex items-center justify-between py-1 border-t border-gray-100 mt-1"
				onMouseEnter={() => setActiveKey("volatilityMode")}
				onMouseLeave={() => setActiveKey(null)}
			>
				<span className="text-[11px] text-gray-600">Volatility model</span>
				<Select
					value={values.volatilityMode}
					onValueChange={(v) =>
						onChange("volatilityMode", v as GAParams["volatilityMode"])
					}
				>
					<SelectTrigger className="w-28 h-7 text-[10px] bg-elevated border-gray-300/40">
						<SelectValue />
					</SelectTrigger>
					<SelectContent className="bg-elevated border-gray-300/40">
						<SelectItem value="markowitz" className="text-[10px]">
							markowitz
						</SelectItem>
						<SelectItem value="linear" className="text-[10px]">
							linear
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Zone d'explication unique — dynamique */}
			<div className="mt-1 rounded-sm border border-purple-300/30 bg-purple-100 px-3 py-2">
				<p className="text-[11px] text-gray-600 leading-relaxed italic transition-all duration-150">
					{explanation}
				</p>
			</div>
		</div>
	);
}
