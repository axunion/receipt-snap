interface TextareaProps {
	id?: string;
	placeholder?: string;
	value?: string;
	onInput?: (value: string) => void;
	rows?: number;
	required?: boolean;
	disabled?: boolean;
	class?: string;
}

export function Textarea(props: TextareaProps) {
	const baseClasses =
		"w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 disabled:bg-slate-50 disabled:cursor-not-allowed resize-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300";

	return (
		<textarea
			id={props.id}
			placeholder={props.placeholder}
			value={props.value}
			onInput={(e) => props.onInput?.(e.currentTarget.value)}
			rows={props.rows ?? 3}
			required={props.required}
			disabled={props.disabled}
			class={`${baseClasses} ${props.class ?? ""}`}
		/>
	);
}
