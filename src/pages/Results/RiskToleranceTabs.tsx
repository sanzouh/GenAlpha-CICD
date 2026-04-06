type RiskProfile = "conservative" | "balanced" | "aggressive";

interface RiskToleranceTabsProps {
	active: RiskProfile;
	onChange: (profile: RiskProfile) => void;
}

const TABS: { key: RiskProfile; label: string }[] = [
	{ key: "conservative", label: "Conservative" },
	{ key: "balanced", label: "Balanced" },
	{ key: "aggressive", label: "Aggressive" },
];

export default function RiskToleranceTabs({
	active,
	onChange,
}: RiskToleranceTabsProps) {
	return (
		<div className="flex items-center gap-3">
			<span className="text-[12px] text-gray-600">Risk Tolerance:</span>
			<div className="flex gap-1 bg-elevated rounded-lg p-1 border border-gray-200/30">
				{TABS.map((tab) => (
					<button
						key={tab.key}
						onClick={() => onChange(tab.key)}
						className={`px-4 py-1.5 rounded-md text-[12px] font-medium transition-all duration-150 ${
							active === tab.key
								? "bg-green-500 text-white"
								: "text-gray-600 hover:text-gray-900"
						}`}
					>
						{tab.label}
					</button>
				))}
			</div>
		</div>
	);
}
