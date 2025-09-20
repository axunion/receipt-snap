import { CONFIG } from "@/constants/config";
import type {
	DestinationData,
	DestinationSuccessResponse,
	ExpenseSubmitPayload,
	SubmitResponse,
} from "@/types";
import { handleApiResponse, handleFetchError } from "@/utils";

export async function fetchDestinations(): Promise<DestinationData[]> {
	// if (import.meta.env.DEV) {
	// 	const data = [
	// 		{ value: "value1", label: "イベント" },
	// 		{ value: "value2", label: "交通費" },
	// 	];
	// 	const resultDone = { result: "done", data };
	// 	console.log("Mock destinations data fetched:");
	// 	console.log(resultDone);

	// 	if (Math.random() < 0.5) {
	// 		throw new Error("Dummy error message.");
	// 	}

	// 	return resultDone.data;
	// }

	try {
		const response = await fetch(`${CONFIG.API.BASE_URL}`);
		const successResponse =
			await handleApiResponse<DestinationSuccessResponse>(response);
		return successResponse.data;
	} catch (error) {
		throw handleFetchError(error);
	}
}

export async function submitExpense(
	expenseData: ExpenseSubmitPayload,
): Promise<SubmitResponse> {
	// if (import.meta.env.DEV) {
	// 	await new Promise((resolve) => setTimeout(resolve, 1500));
	// 	const resultDone = { result: "done" };
	// 	const resultError = { result: "error", error: "Dummy error message." };
	// 	const result = Math.random() < 0.5 ? resultDone : resultError;
	// 	console.log("Using mock expense submission:");
	// 	console.log(JSON.stringify(expenseData, null, 2));
	// 	console.log("Mock submission complete:", result);
	// 	return result as SubmitResponse;
	// }

	try {
		const response = await fetch(`${CONFIG.API.BASE_URL}`, {
			method: "POST",
			body: JSON.stringify(expenseData),
		});

		return await handleApiResponse<SubmitResponse>(response);
	} catch (error) {
		const handledError = handleFetchError(error);

		return {
			result: "error",
			error: handledError.message,
		};
	}
}
