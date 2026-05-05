interface MetricsBarProps {
	expectedReturn: number | null;
	volatility: number | null;
	sharpe: number | null;
	generation: number;
	maxGenerations: number;
	populationSize: number;
	paretoSize: number;
}

// Cercle de progression SVG pour la génération
// r=14 → circonférence = 2π×14 ≈ 88px
// strokeDashoffset contrôle combien du cercle est "dessiné"
function GenerationRing({ current, max }: { current: number; max: number }) {
	const r = 14;
	const circ = 2 * Math.PI * r; // ≈ 88
	const progress = max > 0 ? current / max : 0;
	const offset = circ * (1 - progress); // portion non remplie

	return (
		<svg width="40" height="40" className="-rotate-90">
			{" "}
			{/* -rotate-90 : départ en haut */}
			{/* Cercle de fond */}
			<circle
				cx="20"
				cy="20"
				r={r}
				fill="none"
				strokeWidth="2.5"
				className="stroke-elevated"
			/>
			{/* Cercle de progression */}
			<circle
				cx="20"
				cy="20"
				r={r}
				fill="none"
				strokeWidth="2.5"
				strokeDasharray={circ}
				strokeDashoffset={offset}
				strokeLinecap="round"
				className="stroke-green-500 transition-all duration-300"
			/>
		</svg>
	);
}

interface MetricCardProps {
	label: string;
	value: string; // valeur formatée ex: "11.1%"
	valueClass: string; // couleur ex: "text-green-400"
	children?: React.ReactNode;
}

function MetricCard({ label, value, valueClass, children }: MetricCardProps) {
	return (
		<div className="card flex flex-col gap-1 flex-1">
			<span className="section-label">{label}</span>
			<div className="flex items-center justify-between">
				<span className={`font-mono text-3xl font-medium ${valueClass}`}>
					{value}
				</span>
				{children}
			</div>
		</div>
	);
}

export default function MetricsBar({
	expectedReturn,
	volatility,
	sharpe,
	generation,
	maxGenerations,
	populationSize,
}: MetricsBarProps) {
	// Tant que l'algo n'a pas tourné, on affiche "—"
	const fmt = (v: number | null, decimals: number, suffix = "") =>
		v === null ? "—" : `${v.toFixed(decimals)}${suffix}`;

	return (
		<div className="flex gap-3">
			<MetricCard
				label="Expected Return"
				value={fmt(expectedReturn, 1, "%")}
				valueClass={
					expectedReturn === null ? "text-gray-400" : "text-green-400"
				}
			/>
			<MetricCard
				label="Volatility Σ"
				value={fmt(volatility, 1, "%")}
				valueClass={volatility === null ? "text-gray-400" : "text-red-400"}
			/>
			<MetricCard
				label="Sharpe Ratio"
				value={fmt(sharpe, 2)}
				valueClass={sharpe === null ? "text-gray-400" : "text-blue-300"}
			/>
			<MetricCard
				label="Generation"
				value={`${generation}/${maxGenerations}`}
				valueClass="text-gray-900"
			>
				{/* Le ring SVG s'affiche uniquement quand l'algo tourne */}
				<GenerationRing current={generation} max={maxGenerations} />
			</MetricCard>
			<MetricCard
				label="Population"
				value={`${populationSize}`}
				valueClass="text-purple-400"
			/>
		</div>
	);
}
