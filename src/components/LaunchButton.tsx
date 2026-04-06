import { Play, Pause } from "lucide-react";

type LaunchStatus = "idle" | "running" | "paused";

interface LaunchButtonProps {
	status: LaunchStatus;
	onStart: () => void;
	onPause: () => void;
	onResume: () => void;
}

export default function LaunchButton({
	status,
	onStart,
	onPause,
	onResume,
}: LaunchButtonProps) {
	const isRunning = status === "running";
	const isPaused = status === "paused";

	const handleClick = () => {
		if (isRunning) onPause();
		else if (isPaused) onResume();
		else onStart();
	};

	return (
		<button
			onClick={handleClick}
			className={`
        w-full rounded-lg py-3 text-[14px] font-semibold transition-all duration-150
        hover:-translate-y-px hover:shadow-lg
        ${
					isRunning
						? "bg-green-500/20 text-green-300 border border-green-500/40 hover:bg-green-500/30"
						: isPaused
							? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
							: "bg-green-500 text-white hover:bg-green-400 border border-transparent"
				}
      `}
		>
			{isRunning ? (
				<span className="inline-flex items-center justify-center gap-2">
					<Pause size={15} strokeWidth={2} />
					<span>Pause</span>
					<span className="inline-flex items-center gap-0.5">
						{[0, 150, 300].map((delay) => (
							<span
								key={delay}
								className="h-1 w-1 rounded-full bg-green-300 animate-bounce"
								style={{ animationDelay: `${delay}ms` }}
							/>
						))}
					</span>
				</span>
			) : isPaused ? (
				<span className="inline-flex items-center justify-center gap-2">
					<Play size={15} strokeWidth={2} />
					<span>Resume</span>
				</span>
			) : (
				<span className="inline-flex items-center justify-center gap-2">
					<Play size={15} strokeWidth={2} />
					<span>Launch optimisation ↗</span>
				</span>
			)}
		</button>
	);
}
