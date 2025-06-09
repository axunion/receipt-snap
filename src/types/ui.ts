export interface CompressionProgress {
	progress: number;
	stage: string;
}

export interface CompressionResult {
	originalSize: number;
	compressedSize: number;
	ratio: number;
}

export interface ValidationResult {
	isValid: boolean;
	error?: string;
	warning?: string;
}

export interface SubmitState {
	isSubmitting: boolean;
	result: import("./expense").ExpenseResponse | null;
}

export type TabType = "camera" | "file" | "no-image";

export interface FormFieldProps {
	id?: string;
	required?: boolean;
	disabled?: boolean;
	class?: string;
}

export interface SelectOption {
	value: string;
	label: string;
}
