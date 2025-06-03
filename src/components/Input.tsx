interface InputProps {
	id?: string;
	type?: "text" | "email" | "password" | "number" | "date" | "file";
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
}

export function Input(props: InputProps) {
	const baseClasses =
		"w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed";

	return (
		<input
			id={props.id}
			type={props.type || "text"}
			placeholder={props.placeholder}
			value={props.value}
			onInput={(e) => props.onInput?.(e.currentTarget.value)}
			onChange={props.onChange}
			required={props.required}
			disabled={props.disabled}
			accept={props.accept}
			min={props.min}
			max={props.max}
			step={props.step}
			class={`${baseClasses} ${props.class || ""}`}
		/>
	);
}
