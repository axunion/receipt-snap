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
	const variant = () => props.variant || "primary";
	const size = () => props.size || "md";

	const baseClasses =
		"inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

	const variantClasses = () => {
		switch (variant()) {
			case "secondary":
				return "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-500";
			default:
				return "bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-500";
		}
	};

	const sizeClasses = () => {
		switch (size()) {
			case "sm":
				return "px-3 py-2 text-sm";
			case "lg":
				return "px-6 py-3 text-lg";
			default:
				return "px-4 py-2 text-base";
		}
	};

	return (
		<button
			type={props.type || "button"}
			class={`${baseClasses} ${variantClasses()} ${sizeClasses()} ${props.class || ""}`}
			disabled={props.disabled}
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
}
