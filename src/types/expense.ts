export type Purpose = string;

export interface PurposeOption {
	value: Purpose;
	label: string;
}

export interface Expense {
	id: string;
	name: string;
	amount: number;
	date: string;
	details: string;
	purpose: Purpose;
	notes?: string;
	receiptImageUrl?: string;
	userId: string;
	createdAt: string;
}

export interface ExpenseData {
	name: string;
	amount: string;
	date: string;
	details: string;
	purpose: Purpose;
	notes: string;
	receiptImage: File | null;
}

export interface SubmitExpenseResult {
	id: string;
	status: "success" | "error";
	message: string;
	submittedAt: string;
}
