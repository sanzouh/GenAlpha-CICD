interface ContextCard {
	title: string;
	description: string;
	accentColor: string;
}

const CARDS: ContextCard[] = [
	{
		title: "Pareto Front",
		description:
			"Each solution is non-dominated. Improving return requires accepting more risk. No single optimal solution exists.",
		accentColor: "var(--color-blue-500)",
	},
	{
		title: "Genetic Algorithm",
		description: `Population evolved through selection, crossover and mutation. Explores millions of portfolios to find the efficient frontier.`,
		accentColor: "var(--color-green-500)",
	},
	{
		title: "Your Role (MCDSS)",
		description:
			"The algorithm finds the frontier. You apply risk tolerance to choose. This is Multi-Criteria Decision Support.",
		accentColor: "var(--color-purple-500)",
	},
];

export default function AcademicContext() {
	return (
		<div className="flex flex-col gap-3">
			<p className="text-[13px] font-semibold uppercase text-gray-900">
				Academic Context
			</p>
			<div className="grid grid-cols-3 gap-4">
				{CARDS.map((card) => (
					<div
						key={card.title}
						className="bg-elevated rounded-lg p-4 border border-gray-200/30
                       flex flex-col gap-2"
						style={{ borderLeft: `2px solid ${card.accentColor}` }}
					>
						<p className="text-[13px] font-semibold text-gray-900">
							{card.title}
						</p>
						<p className="text-[12px] text-gray-600 leading-relaxed">
							{card.description}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
