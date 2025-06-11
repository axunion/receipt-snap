interface TabButtonProps {
	active: boolean;
	onClick: () => void;
	position: "left" | "center" | "right";
	children: string;
}

export function TabButton(props: TabButtonProps) {
	const baseClasses =
		"flex-1 px-2 py-3 text-xs sm:text-sm font-medium cursor-pointer";
	const positionClasses = {
		left: "rounded-tl-lg",
		center: "border-l border-slate-200",
		right: "border-l border-slate-200 rounded-tr-lg",
	};
	const stateClasses = {
		active: "bg-white",
		inactive: "bg-slate-50 border-b border-slate-200 text-slate-500",
	};

	return (
		<button
			type="button"
			onClick={props.onClick}
			class={`${baseClasses} ${positionClasses[props.position]} ${stateClasses[props.active ? "active" : "inactive"]}`}
		>
			{props.children}
		</button>
	);
}
