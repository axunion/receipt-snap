import type { SubmitResponse } from "./api";

export interface CompressionProgress {
	progress: number;
	stage: string;
}

export interface SubmitState {
	isLoading: boolean;
	result: SubmitResponse | null;
}

export type TabType = "camera" | "file" | "no-image";

export interface SelectOption {
	value: string;
	label: string;
}
