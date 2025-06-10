export type ExpenseCategory =
	| "transportation"
	| "meals"
	| "accommodation"
	| "office_supplies"
	| "communication"
	| "entertainment"
	| "other";

export interface ExpenseRequest {
	name: string;
	amount: number;
	date: string;
	category: ExpenseCategory;
	notes?: string;
	receiptImage: File;
}

export interface ExpenseResponse {
	id: string;
	status: "success" | "error";
	message: string;
	submittedAt: string;
}

export interface ExpenseCategoryOption {
	value: ExpenseCategory;
	label: string;
}

export const EXPENSE_CATEGORIES: ExpenseCategoryOption[] = [
	{ value: "transportation", label: "交通費" },
	{ value: "meals", label: "食事代" },
	{ value: "accommodation", label: "宿泊費" },
	{ value: "office_supplies", label: "事務用品" },
	{ value: "communication", label: "通信費" },
	{ value: "entertainment", label: "接待費" },
	{ value: "other", label: "その他" },
];
