import { formatAmount } from "@/utils";
import styles from "./Input.module.css";

type InputType =
	| "text"
	| "email"
	| "password"
	| "number"
	| "date"
	| "file"
	| "amount";

interface InputProps {
	id?: string;
	type?: InputType;
	placeholder?: string;
	value?: string | number;
	onInput?: (value: string) => void;
	onChange?: (event: Event) => void;
	onClick?: (event: Event) => void;
	required?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	class?: string;
	accept?: string;
	min?: string | number;
	max?: string | number;
	step?: string | number;
	maxLength?: number;
	minLength?: number;
	pattern?: string;
	inputmode?:
		| "text"
		| "email"
		| "numeric"
		| "search"
		| "tel"
		| "url"
		| "decimal"
		| "none"; // pass-through for mobile keyboards
	"aria-label"?: string;
	"aria-invalid"?: boolean;
	"aria-describedby"?: string;
}

export function Input(props: InputProps) {
	const handleInput = (e: Event) => {
		const target = e.currentTarget as HTMLInputElement;
		let value = target.value;

		if (props.type === "amount") {
			value = formatAmount(value);
			target.value = value;
		}

		props.onInput?.(value);
	};

	const inputType = props.type === "amount" ? "text" : (props.type ?? "text");

	return (
		<input
			id={props.id}
			type={inputType}
			placeholder={props.placeholder}
			value={props.value}
			onInput={handleInput}
			onChange={props.onChange}
			onClick={props.onClick}
			required={props.required}
			disabled={props.disabled}
			readOnly={props.readOnly}
			accept={props.accept}
			min={props.min}
			max={props.max}
			step={props.step}
			maxLength={props.maxLength}
			minLength={props.minLength}
			pattern={props.pattern}
			inputmode={props.inputmode}
			aria-label={props["aria-label"]}
			aria-invalid={props["aria-invalid"]}
			aria-describedby={props["aria-describedby"]}
			class={`${styles.input} ${props.class ?? ""}`}
		/>
	);
}
