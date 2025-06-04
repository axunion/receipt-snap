import type { JSX } from "solid-js";

interface ButtonProps {
	children: JSX.Element;
	type?: "button" | "submit" | "reset";
	variant?: "primary" | "secondary";
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
	onClick?: () => void;
	class?: string;
}

export function Button(props: ButtonProps) {
	const baseClasses =
		"inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

	const getVariantClasses = () => {
		if (props.variant === "secondary") {
			return "bg-slate-50 text-slate-700 hover:bg-slate-100 focus:ring-sky-300 border border-slate-200 hover:border-slate-300";
		}
		return "bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-300 shadow-sm hover:shadow-md";
	};

	const getSizeClasses = () => {
		if (props.size === "sm") return "px-3 py-2 text-sm";
		if (props.size === "lg") return "px-6 py-3 text-lg";
		return "px-4 py-2 text-base";
	};

	return (
		<button
			type={props.type || "button"}
			class={`${baseClasses} ${getVariantClasses()} ${getSizeClasses()} ${props.class || ""}`}
			disabled={props.disabled}
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
}
