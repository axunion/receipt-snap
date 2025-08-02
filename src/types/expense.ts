export interface ExpenseFormData {
	name: string;
	amount: string;
	date: string;
	details: string;
	destination: string;
	notes?: string;
	receiptImage?: File | null;
	noImageReason?: string;
}
