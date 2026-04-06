import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAssets } from "@/hooks/useAssets";
import type { Portfolio, GAParams } from "@/lib/geneticAlgorithm";
import ResultsHeader from "./ResultsHeader";
import RiskToleranceTabs from "./RiskToleranceTabs";
import ParetoTable from "./ParetoTable";
import PortfolioDetail from "./PortfolioDetail";
import AcademicContext from "./AcademicContext";

type RiskProfile = "conservative" | "balanced" | "aggressive";

interface ResultsState {
	paretoFront: Portfolio[];
	best: Portfolio;
	params: GAParams;
}

export default function Results() {
	const { state } = useLocation();
	const navigate = useNavigate();
	const { assets } = useAssets();
	const { paretoFront, best, params } = state as ResultsState;

	const [profile, setProfile] = useState<RiskProfile>("balanced");
	const [selected, setSelected] = useState<number | null>(null);

	// Calcul des percentiles de volatilité
	const filtered = useMemo(() => {
		const vols = paretoFront.map((p) => p.volatility).sort((a, b) => a - b);
		const p33 = vols[Math.floor(vols.length * 0.33)];
		const p66 = vols[Math.floor(vols.length * 0.66)];

		return paretoFront
			.filter((p) => {
				if (profile === "conservative") return p.volatility <= p33;
				if (profile === "aggressive") return p.volatility >= p66;
				return p.volatility > p33 && p.volatility < p66;
			})
			.sort((a, b) => b.sharpe - a.sharpe); // meilleur Sharpe en premier
	}, [paretoFront, profile]);

	return (
		<div className="min-h-screen bg-base text-gray-900">
			<ResultsHeader
				best={best}
				paretoCount={paretoFront.length}
				params={params}
				onBack={() => navigate("/")}
			/>

			<div className="px-8 py-6 flex flex-col gap-5">
				<RiskToleranceTabs
					active={profile}
					onChange={(p) => {
						setProfile(p);
						setSelected(null);
					}}
				/>

				<ParetoTable
					portfolios={filtered}
					assets={assets}
					selected={selected}
					best={best}
					onSelect={setSelected}
				/>

				{/* Portfolio Detail — prochain commit */}
				{selected !== null && (
					<PortfolioDetail
						portfolio={filtered[selected]}
						assets={assets}
						onConfirm={() => {
							// Pour l'instant — alert simple
							// Plus tard : export PDF, localStorage, etc.
							alert(`Portfolio ${selected + 1} confirmed!`);
						}}
					/>
				)}
				<AcademicContext />
			</div>
		</div>
	);
}
