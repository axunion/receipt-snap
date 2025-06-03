import type { JSX } from "solid-js";

interface CardProps {
	children: JSX.Element;
	class?: string;
}

export function Card(props: CardProps) {
	const baseClasses = "bg-white rounded-lg border border-gray-200 shadow-sm";

	return (
		<div class={`${baseClasses} ${props.class || ""}`}>{props.children}</div>
	);
}

interface CardHeaderProps {
	children: JSX.Element;
	class?: string;
}

export function CardHeader(props: CardHeaderProps) {
	const baseClasses = "px-6 py-4 border-b border-gray-200";

	return (
		<div class={`${baseClasses} ${props.class || ""}`}>{props.children}</div>
	);
}

interface CardContentProps {
	children: JSX.Element;
	class?: string;
}

export function CardContent(props: CardContentProps) {
	const baseClasses = "px-6 py-4";

	return (
		<div class={`${baseClasses} ${props.class || ""}`}>{props.children}</div>
	);
}
