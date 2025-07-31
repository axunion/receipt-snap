export interface Expense {
	id: string;
	name: string;
	amount: number;
	date: string;
	details: string;
	destination: string;
	notes?: string;
	receiptImageUrl?: string;
	userId: string;
	createdAt: string;
}

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
