export interface PurposeResponse {
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
}

export interface SubmitResponse {
	success: boolean;
	error?: {
		code: string;
		message: string;
	};
}
