import type { SubmitExpenseResult } from "./expense";

export interface CompressionProgress {
	progress: number;
	stage: string;
}

export interface SubmitState {
	isLoading: boolean;
	result: SubmitExpenseResult | null;
}

export type TabType = "camera" | "file" | "no-image";

export interface SelectOption {
	value: string;
	label: string;
}
