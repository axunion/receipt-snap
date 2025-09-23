import { CONFIG } from "@/constants/config";
import { ERROR_MESSAGES } from "@/constants/errorMessages";
import type {
	DestinationData,
	DestinationSuccessResponse,
	ExpenseSubmitPayload,
	SubmitResponse,
} from "@/types";

async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
	try {
		const response = await fetch(url, options);

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();

		if (data?.result === "error") {
			throw new Error(data.error);
		}

		return data;
	} catch (error) {
		if (error instanceof TypeError && error.message.includes("fetch")) {
			throw new Error(ERROR_MESSAGES.NETWORK);
		}
		throw error instanceof Error ? error : new Error(ERROR_MESSAGES.UNEXPECTED);
	}
}

export async function fetchDestinations(): Promise<DestinationData[]> {
	// if (import.meta.env.DEV) {
	// 	// Development mock configuration (only in dev builds)
	// 	console.log("Using mock destination data");
	// 	const shouldError = false;
	// 	// Simulate API delay
	// 	await new Promise((resolve) => setTimeout(resolve, 1500));

	// 	if (shouldError) {
	// 		throw new Error("Mock error: Failed to fetch destinations");
	// 	}

	// 	return [
	// 		{ value: "project_a", label: "プロジェクトA" },
	// 		{ value: "project_b", label: "プロジェクトB" },
	// 	];
	// }

	const response = await apiRequest<DestinationSuccessResponse>(
		`${CONFIG.API.BASE_URL}`,
	);
	return response.data;
}

export async function submitExpense(
	expenseData: ExpenseSubmitPayload,
): Promise<SubmitResponse> {
	// if (import.meta.env.DEV) {
	// 	// Development mock configuration (only in dev builds)
	// 	console.log("Using mock expense submission:");
	// 	console.log(JSON.stringify(expenseData, null, 2));
	// 	const shouldError = true;
	// 	// Simulate API delay
	// 	await new Promise((resolve) => setTimeout(resolve, 1500));

	// 	if (shouldError) {
	// 		console.log("Mock submission error");
	// 		return {
	// 			result: "error",
	// 			error: "Mock error: Submission failed",
	// 		};
	// 	}

	// 	console.log("Mock submission success");
	// 	return { result: "done" };
	// }

	try {
		return await apiRequest<SubmitResponse>(`${CONFIG.API.BASE_URL}`, {
			method: "POST",
			body: JSON.stringify(expenseData),
		});
	} catch (error) {
		return {
			result: "error",
			error:
				error instanceof Error
					? error.message
					: "予期しないエラーが発生しました。",
		};
	}
}
