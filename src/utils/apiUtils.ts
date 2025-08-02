import { ERROR_MESSAGES } from "@/constants/errorMessages";
import type { SubmitResponse } from "@/types";

export async function handleApiResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`);
	}

	const data = await response.json();

	if (data && typeof data === "object" && "result" in data) {
		const submitResponse = data as SubmitResponse;
		if (submitResponse.result === "error") {
			const errorMessage = submitResponse.error || "Submit failed";
			throw new Error(errorMessage);
		}
	}

	return data as T;
}

export function handleFetchError(error: unknown): Error {
	if (error instanceof TypeError && error.message.includes("fetch")) {
		return new Error(ERROR_MESSAGES.NETWORK);
	}

	if (error instanceof Error) {
		return error;
	}

	return new Error(ERROR_MESSAGES.UNEXPECTED);
}
