import { For } from "solid-js";

interface SelectOption {
	value: string;
	label: string;
}

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
		"w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed bg-white";

	return (
		<select
			value={props.value}
			onChange={(e) => props.onSelect?.(e.currentTarget.value)}
			required={props.required}
			disabled={props.disabled}
			class={`${baseClasses} ${props.class || ""}`}
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
