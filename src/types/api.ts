export type PurposeResponse = {
	result: "done" | "error";
	data?: PurposeItem[];
	error?: string;
};

export interface PurposeItem {
	value: string;
	label: string;
}

export interface SubmitRequest {
	name: string;
	amount: string;
	date: string;
	details: string;
	purpose: string;
	notes?: string;
	receiptImage?: File | null;
	noImageReason?: string;
}

export interface SubmitResponse {
	result: "done" | "error";
	error?: string;
}
