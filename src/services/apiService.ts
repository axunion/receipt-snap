import { CONFIG } from "@/constants/config";
import type {
	DestinationResponse,
	ExpenseFormData,
	SelectOption,
	SubmitResponse,
} from "@/types";
import { handleApiResponse, handleFetchError } from "@/utils";

export async function fetchDestinations(): Promise<SelectOption[]> {
	if (import.meta.env.DEV) {
		const result: DestinationResponse = {
			result: "done",
			data: [
				{ value: "value1", label: "イベント" },
				{ value: "value2", label: "修理代" },
				{ value: "value3", label: "交通費" },
			],
		};
		console.log("Mock destinations data fetched:");
		console.log(result);
		return result.data || [];
	}

	try {
		const response = await fetch(`${CONFIG.API.BASE_URL}/destinations`);
		return await handleApiResponse<SelectOption[]>(response);
	} catch (error) {
		console.error("Error fetching destinations from API:", error);
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
		console.log("Using mock expense submission:");
		console.log(JSON.stringify(expenseData, null, 2));
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
