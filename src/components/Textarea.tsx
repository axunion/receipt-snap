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
		"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-vertical";

	return (
		<textarea
			id={props.id}
			placeholder={props.placeholder}
			value={props.value}
			onInput={(e) => props.onInput?.(e.currentTarget.value)}
			rows={props.rows || 3}
			required={props.required}
			disabled={props.disabled}
			class={`${baseClasses} ${props.class || ""}`}
		/>
	);
}
