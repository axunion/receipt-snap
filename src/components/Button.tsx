import type { JSX } from "solid-js";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md" | "lg";
type ButtonType = "button" | "submit" | "reset";

interface ButtonProps {
	children: JSX.Element;
	type?: ButtonType;
	variant?: ButtonVariant;
	size?: ButtonSize;
	disabled?: boolean;
	onClick?: () => void;
	class?: string;
}

export function Button(props: ButtonProps) {
	const baseClasses =
		"inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border";

	const getVariantClasses = (): string => {
		switch (props.variant) {
			case "secondary":
				return "bg-slate-50 text-slate-700 hover:bg-slate-100 focus:ring-sky-300 border-slate-200 hover:border-slate-300";
			default:
				return "bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-300 shadow-sm hover:shadow-md border-transparent";
		}
	};

	const getSizeClasses = (): string => {
		switch (props.size) {
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
			type={props.type ?? "button"}
			class={`${baseClasses} ${getVariantClasses()} ${getSizeClasses()} ${props.class ?? ""}`}
			disabled={props.disabled}
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
}
