import { For } from "solid-js";
import type { SelectOption } from "@/types";
import styles from "./Select.module.css";

interface SelectProps {
	options: SelectOption[];
	value?: string;
	placeholder?: string;
	onSelect?: (value: string) => void;
	required?: boolean;
	disabled?: boolean;
	class?: string;
	"aria-invalid"?: boolean;
	"aria-describedby"?: string;
}

export function Select(props: SelectProps) {
	return (
		<select
			value={props.value ?? ""}
			onChange={(e) => props.onSelect?.(e.currentTarget.value)}
			required={props.required}
			disabled={props.disabled}
			class={`${styles.select} ${props.class ?? ""}`}
			aria-invalid={props["aria-invalid"]}
			aria-describedby={props["aria-describedby"]}
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
