import styles from "./Textarea.module.css";

interface TextareaProps {
	id?: string;
	placeholder?: string;
	value?: string;
	onInput?: (value: string) => void;
	rows?: number;
	required?: boolean;
	disabled?: boolean;
	class?: string;
	maxLength?: number;
	minLength?: number;
}

export function Textarea(props: TextareaProps) {
	return (
		<textarea
			id={props.id}
			placeholder={props.placeholder}
			value={props.value}
			onInput={(e) => props.onInput?.(e.currentTarget.value)}
			rows={props.rows ?? 3}
			required={props.required}
			disabled={props.disabled}
			class={`${styles.textarea} ${props.class ?? ""}`}
			maxLength={props.maxLength}
			minLength={props.minLength}
		/>
	);
}
