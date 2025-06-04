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
		"w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 disabled:bg-slate-50 disabled:cursor-not-allowed transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300";

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
