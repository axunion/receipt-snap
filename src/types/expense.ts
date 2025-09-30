// Base expense data structure
interface BaseExpenseData {
	name: string;
	amount: string;
	date: string;
	details: string;
	destination: string;
	notes: string;
	noImageReason: string;
}

export interface ExpenseFormData extends BaseExpenseData {
	receiptFile: File | null; // store raw compressed file (lazy base64 conversion)
}

// Payload actually sent to API (base64 string instead of File)
export interface ExpenseSubmitPayload extends BaseExpenseData {
	recaptchaToken: string;
	receiptImage: string; // base64
}
