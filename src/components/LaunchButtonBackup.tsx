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

	return (
		<button
			onClick={() => {
				if (isRunning) onPause();
				else if (isPaused) onResume();
				else onStart();
			}}
			className={`
        w-full rounded-lg py-3 text-[14px] font-semibold transition-all duration-150
        ${
					isRunning
						? "bg-red-500 text-white hover:bg-red-400 hover:-translate-y-px hover:shadow-lg"
						: isPaused
							? "bg-sky-500 text-white hover:bg-sky-400 hover:-translate-y-px hover:shadow-lg"
							: "bg-green-500 text-white hover:bg-green-400 hover:-translate-y-px hover:shadow-lg"
				}
      `}
		>
			{isRunning ? (
				<span className="inline-flex items-center gap-2">
					<span>Pause optimisation</span>
					<span className="flex items-center gap-0.5">
						<span className="h-1 w-1 rounded-full bg-white animate-bounce" />
						<span
							className="h-1 w-1 rounded-full bg-white animate-bounce"
							style={{ animationDelay: "150ms" }}
						/>
						<span
							className="h-1 w-1 rounded-full bg-white animate-bounce"
							style={{ animationDelay: "300ms" }}
						/>
					</span>
				</span>
			) : isPaused ? (
				<span className="inline-flex items-center gap-2">
					<span>Resume optimisation</span>
				</span>
			) : (
				<span className="inline-flex items-center gap-2">
					<span>▶</span>
					<span>Launch optimisation ↗</span>
				</span>
			)}
		</button>
	);
}
