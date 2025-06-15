import type {
	PurposeResponse,
	SubmitRequest,
	SubmitResponse,
} from "@/types/api";
import type { ExpenseFormData, PurposeOption } from "@/types/expense";
import { handleApiResponse, handleFetchError } from "@/utils/apiUtils";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function simulateDelay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchPurposes(): Promise<PurposeOption[]> {
	// Use mock data only if no API URL is configured
	if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
		await simulateDelay(500);
		const result: PurposeResponse = {
			result: "done",
			data: [
				{ value: "value1", label: "イベント" },
				{ value: "value2", label: "修理代" },
				{ value: "value3", label: "交通費" },
			],
		};
		console.log("Mock purposes data fetched", result);
		return result.data || [];
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

export async function submitExpense(
	expenseData: ExpenseFormData,
): Promise<SubmitResponse> {
	// Use mock response only if no API URL is configured
	if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
		console.log("Using mock expense submission:", expenseData);
		await simulateDelay(1500);
		const result: SubmitResponse = {
			result: "done",
		};
		console.log("Mock submission complete:", result);
		return result;
	}

	// Convert form data to API request format (currently identical)
	const requestBody: SubmitRequest = expenseData;

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
