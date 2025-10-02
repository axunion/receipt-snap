import { CONFIG } from "@/constants/config";
import { ERROR_MESSAGES } from "@/constants/errorMessages";
import type {
	DestinationResponse,
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

export async function fetchDestinations(): Promise<DestinationResponse> {
	// Development mock configuration (only in dev builds)
	if (import.meta.env.DEV) {
		const shouldError = false;
		console.log("Using mock destination data");
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 1500));

		if (shouldError) {
			console.log("Mock destination fetch error");
			return {
				result: "error",
				error: "送信先の取得に失敗しました。",
			};
		}

		return {
			result: "done",
			data: [
				{ value: "project_a", label: "ProjectA" },
				{ value: "project_b", label: "ProjectB" },
			],
		};
	}

	try {
		const response = await apiRequest<DestinationSuccessResponse>(
			`${CONFIG.API.BASE_URL}`,
		);
		return response;
	} catch (error) {
		return {
			result: "error",
			error:
				error instanceof Error ? error.message : "送信先の取得に失敗しました。",
		};
	}
}

export async function submitExpense(
	expenseData: ExpenseSubmitPayload,
): Promise<SubmitResponse> {
	// Development mock configuration (only in dev builds)
	if (import.meta.env.DEV) {
		const shouldError = false;
		console.log("Using mock expense submission:");
		console.log(JSON.stringify(expenseData, null, 2));
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 1500));

		if (shouldError) {
			console.log("Mock submission error");
			return {
				result: "error",
				error: "Mock error: Submission failed",
			};
		}

		console.log("Mock submission success");
		return { result: "done" };
	}

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
