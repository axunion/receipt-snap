import type { JSX } from "solid-js";
import styles from "./Button.module.css";

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
	return (
		<button
			type={props.type ?? "button"}
			class={`${styles.base} ${styles[props.variant ?? "primary"]} ${styles[props.size ?? "md"]} ${props.class ?? ""}`}
			disabled={props.disabled}
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
}
