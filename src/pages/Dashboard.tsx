import { useEffect } from "react";
import Topbar from "@/components/Topbar";
import ParamPanel from "@/components/ParamPanel";
import AssetList from "@/components/AssetList/index";
import LaunchButton from "@/components/LaunchButton";
import MetricsBar from "@/components/MetricsBar";
import ProgressBar from "@/components/ProgressBar";
import ResultsBanner from "@/components/ResultsBanner";
import ConvergenceChart from "@/components/ConvergenceChart";
import ParetoChart from "@/components/ParetoChart";
import { useGeneticAlgorithm } from "@/hooks/useGeneticAlgorithm";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
	const {
		params,
		updateParam,
		start,
		pause,
		/* stop, */
		reset,
		running,
		paused,
		generation,
		best,
		population,
		paretoFront,
		fitnessHistory,
	} = useGeneticAlgorithm();

	const navigate = useNavigate();

	useEffect(() => {
		document.documentElement.classList.add("dark");
	}, []);

	const topbarStatus = running ? "optimizing" : paused ? "paused" : "ready";

	return (
		<div className="h-screen flex flex-col bg-base text-gray-900 overflow-hidden">
			<Topbar status={topbarStatus} />

			<div className="flex flex-1 gap-4 p-4 overflow-hidden">
				{/* Colonne gauche */}
				<aside className="w-80 xl:w-90 shrink-0 flex flex-col gap-2 overflow-hidden h-full">
					<div className="shrink-0">
						<ParamPanel values={params} onChange={updateParam} />
					</div>

					<div className="flex-1 min-h-0 p-1">
						<AssetList />
					</div>

					<div className="shrink-0 flex flex-col gap-2">
						<LaunchButton
							status={running ? "running" : paused ? "paused" : "idle"}
							onStart={start}
							onPause={pause}
							onResume={start}
						/>
						<Button
							variant="outline"
							onClick={reset}
							disabled={running}
							className="w-full h-10 text-[14px] font-semibold gap-2"
						>
							<RotateCcw size={15} strokeWidth={2} />
							Reset
						</Button>
					</div>
				</aside>

				{/* Colonne droite — placeholder */}
				<main className="flex-1 flex flex-col gap-3 overflow-hidden">
					<MetricsBar
						expectedReturn={best?.expectedReturn ?? null}
						volatility={best?.volatility ?? null}
						sharpe={best?.sharpe ?? null}
						generation={generation}
						maxGenerations={params.generations}
						populationSize={population.length}
						paretoSize={paretoFront.length}
					/>
					{!running && !paused && best && generation > 0 ? (
						<ResultsBanner
							paretoSize={paretoFront.length}
							onViewResults={() =>
								navigate("/results", {
									state: { paretoFront, best, params },
								})
							}
						/>
					) : (
						<ProgressBar
							generation={generation}
							maxGenerations={params.generations}
							populationSize={params.populationSize}
							crossover={params.crossoverRate}
							mutation={params.mutationRate}
						/>
					)}
					<div className="flex flex-1 gap-3 overflow-hidden">
						<ConvergenceChart data={fitnessHistory} />
						<ParetoChart population={population} paretoFront={paretoFront} />
					</div>
				</main>
			</div>
		</div>
	);
}
