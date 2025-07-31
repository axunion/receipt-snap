import { CONFIG } from "@/constants/config";
import type { PurposeResponse, SubmitResponse } from "@/types/api";
import type { ExpenseFormData, PurposeOption } from "@/types/expense";
import { handleApiResponse, handleFetchError } from "@/utils/apiUtils";

export async function fetchPurposes(): Promise<PurposeOption[]> {
	if (import.meta.env.DEV) {
		await new Promise((resolve) => setTimeout(resolve, 500));
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
		const response = await fetch(`${CONFIG.API.BASE_URL}/purposes`);
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
	if (import.meta.env.DEV) {
		await new Promise((resolve) => setTimeout(resolve, 1500));
		const result: SubmitResponse = { result: "done" };
		console.log("Using mock expense submission:", expenseData);
		console.log("Mock submission complete:", result);
		return result;
	}

	try {
		const response = await fetch(`${CONFIG.API.BASE_URL}/expenses`, {
			method: "POST",
			body: JSON.stringify(expenseData),
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
