interface ProgressBarProps {
	generation: number;
	maxGenerations: number;
	populationSize: number;
	crossover: number;
	mutation: number;
}

export default function ProgressBar({
	generation,
	maxGenerations,
	populationSize,
	crossover,
	mutation,
}: ProgressBarProps) {
	const pct = maxGenerations > 0 ? (generation / maxGenerations) * 100 : 0;

	// Élite = top 25% de la population qui survit à chaque génération
	const survivors = Math.floor(populationSize * 0.25);
	// Nombre de croisements = population totale × taux de crossover
	const crossovers = Math.floor(populationSize * (crossover / 100));
	// Nombre de mutations = population totale × taux de mutation
	const mutations = Math.floor(populationSize * (mutation / 100));

	return (
		<div className="card flex flex-col gap-2">
			{/* Barre de progression */}
			<div className="h-1 w-full bg-elevated rounded-full overflow-hidden">
				<div
					className="h-full bg-green-500 rounded-full transition-all duration-300"
					style={{ width: `${pct}%` }}
				/>
			</div>

			{/* Log de génération — style terminal */}
			<p className="font-mono text-[11px] text-gray-600">
				{generation === 0 ? (
					<span className="text-gray-400">Waiting for optimization...</span>
				) : (
					<>
						<span className="text-green-500">→</span> Gen {generation} —{" "}
						<span className="text-gray-900">{survivors} survivors</span>
						{" · "}
						<span className="text-gray-900">{crossovers} crossovers</span>
						{" · "}
						<span className="text-gray-900">{mutations} mutations</span>
					</>
				)}
			</p>
		</div>
	);
}
