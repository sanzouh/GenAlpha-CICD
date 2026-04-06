import { Slider } from "@/components/ui/slider";
import type { GAParams } from "@/lib/geneticAlgorithm";
import {
	Select,
	SelectContent,
	/* SelectGroup, */
	SelectItem,
	/* SelectLabel, */
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
}

const PARAM_CONFIG: ParamConfig[] = [
	{
		key: "populationSize",
		label: "Population",
		min: 20,
		max: 200,
		step: 10,
		trackClassName: "bg-green-500",
	},
	{
		key: "generations",
		label: "Generations",
		min: 20,
		max: 100,
		step: 10,
		trackClassName: "bg-green-500",
	},
	{
		key: "crossoverRate",
		label: "Crossover",
		min: 50,
		max: 95,
		step: 5,
		unit: "%",
		trackClassName: "bg-green-500",
	},
	{
		key: "mutationRate",
		label: "Mutation",
		min: 1,
		max: 20,
		step: 1,
		unit: "%",
		trackClassName: "bg-amber-500",
	},
	{
		key: "maxRisk",
		label: "Max Risk",
		min: 5,
		max: 40,
		step: 1,
		unit: "%",
		trackClassName: "bg-red-500",
	},
];

interface ParamPanelProps {
	values: GAParams;
	onChange: <K extends keyof GAParams>(key: K, value: GAParams[K]) => void;
}

const VOLATILITY_MODES = ["markowitz", "linear"] as const;

export default function ParamPanel({ values, onChange }: ParamPanelProps) {
	return (
		<div className="card flex flex-col gap-1">
			{/* Header */}
			<p className="text-[13px] font-semibold uppercase text-gray-900">
				Algorithm parameters
			</p>

			{PARAM_CONFIG.map((p, i) => (
				<div
					key={p.key}
					className={`flex flex-col gap-2 py-2.5 ${
						i < PARAM_CONFIG.length - 1 ? "border-b border-gray-100" : ""
					}`}
				>
					{/* Label + valeur */}
					<div className="flex items-center justify-between">
						<span className="text-[13px] text-gray-600">{p.label}</span>
						<span className="font-mono text-[13px] font-medium text-gray-900">
							{values[p.key]}
							{p.unit ?? ""}
						</span>
					</div>

					{/* Slider shadcn customisé */}
					<Slider
						min={p.min}
						max={p.max}
						step={p.step}
						value={[values[p.key]]}
						onValueChange={([v]) => onChange(p.key, v)}
						trackClassName={p.trackClassName}
						className="w-full"
					/>
				</div>
			))}

			<div className="flex flex-col gap-2 py-2.5 border-b border-gray-100">
				<div className="flex items-center justify-between">
					<span className="text-[13px] text-gray-600">Volatility model</span>
					<Select
						value={values.volatilityMode}
						onValueChange={(v) =>
							onChange("volatilityMode", v as GAParams["volatilityMode"])
						}
					>
						<SelectTrigger className="w-32 h-7 text-[12px] bg-elevated border-gray-300/50">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="bg-elevated border-gray-300/50">
							{VOLATILITY_MODES.map((mode) => (
								<SelectItem key={mode} value={mode} className="text-[12px]">
									{mode}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Explainer */}
			<div
				className="mt-3 rounded-sm border border-purple-300/30
                      bg-purple-100 px-3 py-2.5 space-y-2"
			>
				<div className="space-y-1">
					<p className="text-[11px] text-gray-700 font-medium">
						Crossover {values.crossoverRate}% (Inheritance)
					</p>
					<p className="text-[10px] text-gray-600 leading-relaxed">
						{values.crossoverRate >= 80
							? "Strong focus on proven solutions. Like picking the best from top performers—fast convergence but narrow scope."
							: "Balanced blend. Combines strengths of different solutions—explores while building on success."}
					</p>
				</div>

				<div className="space-y-1 pt-2 border-t border-purple-200/50">
					<p className="text-[11px] text-gray-700 font-medium">
						Mutation {values.mutationRate}% (Innovation)
					</p>
					<p className="text-[10px] text-gray-600 leading-relaxed">
						{values.mutationRate >= 10
							? "Aggressive random changes. Discovers completely new portfolios—higher risk of instability but finds breakthrough solutions."
							: "Conservative tweaks. Fine-tunes existing solutions slightly—stable, predictable improvements."}
					</p>
				</div>
				<div className="mt-2 pt-2 border-t border-purple-200/50">
					<p className="text-[11px] text-gray-700 font-medium">
						Max Risk = {values.maxRisk}%:
					</p>
					<p className="text-[10px] text-gray-600 leading-relaxed">
						{values.maxRisk <= 15
							? "Conservative: prioritizes low-risk portfolios, may limit high-return opportunities."
							: values.maxRisk <= 25
								? "Balanced: allows moderate risk for better returns, good for most investors."
								: "Aggressive: explores high-risk portfolios, maximizes potential returns but increases volatility."}
					</p>
				</div>
				<div className="mt-2 pt-2 border-t border-purple-200/50">
					<p className="text-[11px] text-gray-700 font-medium">
						Volatility Model: {values.volatilityMode}
					</p>
					<p className="text-[10px] text-gray-600 leading-relaxed">
						{values.volatilityMode === "markowitz"
							? "Markowitz (classical): Uses correlation matrix for realistic portfolio behavior. Best for academic/theoretical analysis."
							: "Linear (simplified): Direct asset variance sum. Produces more dispersed, varied portfolios—ideal for exploration."}
					</p>
				</div>
			</div>
		</div>
	);
}
