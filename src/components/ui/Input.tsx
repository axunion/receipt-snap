import { formatAmount } from "@/utils/formatUtils";

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
	required?: boolean;
	disabled?: boolean;
	class?: string;
	accept?: string;
	min?: string | number;
	max?: string | number;
	step?: string | number;
	"aria-invalid"?: boolean;
	"aria-describedby"?: string;
}

export function Input(props: InputProps) {
	const baseClasses =
		"w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 disabled:bg-slate-50 disabled:cursor-not-allowed transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300";

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
			required={props.required}
			disabled={props.disabled}
			accept={props.accept}
			min={props.min}
			max={props.max}
			step={props.step}
			aria-invalid={props["aria-invalid"]}
			aria-describedby={props["aria-describedby"]}
			class={`${baseClasses} ${props.class ?? ""}`}
		/>
	);
}
