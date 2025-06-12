import type { SelectOption } from "@/types/ui";
import { For } from "solid-js";

interface SelectProps {
	options: SelectOption[];
	value?: string;
	placeholder?: string;
	onSelect?: (value: string) => void;
	required?: boolean;
	disabled?: boolean;
	class?: string;
}

export function Select(props: SelectProps) {
	const baseClasses =
		"w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 disabled:bg-slate-50 disabled:cursor-not-allowed bg-white transition-all duration-200 hover:border-slate-300";

	return (
		<select
			value={props.value ?? ""}
			onChange={(e) => props.onSelect?.(e.currentTarget.value)}
			required={props.required}
			disabled={props.disabled}
			class={`${baseClasses} ${props.class ?? ""}`}
		>
			{props.placeholder && (
				<option value="" disabled>
					{props.placeholder}
				</option>
			)}
			<For each={props.options}>
				{(option) => <option value={option.value}>{option.label}</option>}
			</For>
		</select>
	);
}
