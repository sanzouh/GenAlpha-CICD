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

	// Un seul champion par profil, sélectionné selon un critère précis
	const champion = useMemo((): Portfolio | null => {
		if (paretoFront.length === 0) return null;
		if (profile === "conservative")
			return paretoFront.reduce((b, p) => p.volatility < b.volatility ? p : b);
		if (profile === "aggressive")
			return paretoFront.reduce((b, p) => p.expectedReturn > b.expectedReturn ? p : b);
		return paretoFront.reduce((b, p) => p.sharpe > b.sharpe ? p : b);
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
					onChange={(p) => setProfile(p)}
				/>

				{champion && (
					<>
						<ParetoTable
							portfolios={[champion]}
							assets={assets}
							selected={0}
							best={best}
							onSelect={() => {}}
						/>
						<PortfolioDetail
							portfolio={champion}
							assets={assets}
							onConfirm={() => alert("Portfolio confirmed!")}
						/>
					</>
				)}
				<AcademicContext />
			</div>
		</div>
	);
}
