import type { ExpenseFormData, PurposeOption } from "./expense";

export type PurposeResponse = {
	result: "done" | "error";
	data?: PurposeOption[];
	error?: string;
};

export type SubmitRequest = ExpenseFormData;

export interface SubmitResponse {
	result: "done" | "error";
	error?: string;
}
