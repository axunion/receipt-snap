import type { SubmitRequest, SubmitResponse } from "@/types/api";
import type { ExpenseData, PurposeOption } from "@/types/expense";
import { handleApiResponse, handleFetchError } from "@/utils/apiUtils";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function simulateDelay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchPurposes(): Promise<PurposeOption[]> {
	// Use mock data only if no API URL is configured
	if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
		console.log("Using mock purposes data - no API URL configured");
		await simulateDelay(500);
		return [
			{ value: "value1", label: "イベント" },
			{ value: "value2", label: "修理代" },
			{ value: "value3", label: "交通費" },
		];
	}

	try {
		const response = await fetch(`${BASE_URL}/purposes`);
		return await handleApiResponse<PurposeOption[]>(response);
	} catch (error) {
		console.error("Error fetching purposes from API:", error);
		const handledError = handleFetchError(error);
		throw handledError;
	}
}

function buildSubmitRequest(expenseData: ExpenseData): SubmitRequest {
	return {
		name: expenseData.name,
		amount: expenseData.amount,
		date: expenseData.date,
		details: expenseData.details,
		purpose: expenseData.purpose,
		...(expenseData.notes && { notes: expenseData.notes }),
		...(expenseData.receiptImage && { receiptImage: expenseData.receiptImage }),
		...(expenseData.noImageReason && {
			noImageReason: expenseData.noImageReason,
		}),
	};
}

export async function submitExpense(
	expenseData: ExpenseData,
): Promise<SubmitResponse> {
	// Use mock response only if no API URL is configured
	if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
		console.log("Using mock expense submission - no API URL configured");
		await simulateDelay(1500);
		const result: SubmitResponse = {
			result: "done",
		};
		console.log("Mock submission complete");
		return result;
	}

	const requestBody = buildSubmitRequest(expenseData);

	try {
		const response = await fetch(`${BASE_URL}/expenses`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		});

		return await handleApiResponse<SubmitResponse>(response);
	} catch (error) {
		console.error("API call error:", error);
		const handledError = handleFetchError(error);

		return {
			result: "error",
			error: handledError.message,
		};
	}
}
