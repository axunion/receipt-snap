import type { JSX } from "solid-js";

interface LabelProps {
	children: JSX.Element;
	for?: string;
	required?: boolean;
	class?: string;
}

export function Label(props: LabelProps) {
	const baseClasses = "block text-sm font-semibold text-slate-700 mb-2";

	return (
		<label for={props.for} class={`${baseClasses} ${props.class || ""}`}>
			{props.children}
			{props.required && <span class="text-red-500 ml-1">*</span>}
		</label>
	);
}
