export interface ExpenseFormData {
	name: string;
	amount: string;
	date: string;
	details: string;
	destination: string;
	notes: string;
	receiptFile: File | null; // store raw compressed file (lazy base64 conversion)
	noImageReason: string;
}

// Payload actually sent to API (base64 string instead of File)
export interface ExpenseSubmitPayload {
	name: string;
	amount: string;
	date: string;
	details: string;
	destination: string;
	notes: string;
	receiptImage: string; // base64
	noImageReason: string;
}
