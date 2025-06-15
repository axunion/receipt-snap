import type { SubmitResponse } from "@/types/api";

export async function handleApiResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`);
	}

	const data = await response.json();

	// Check for submit response format
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
		return new Error(
			"ネットワークに接続できません。インターネット接続を確認してください。",
		);
	}

	if (error instanceof Error) {
		return error;
	}

	return new Error("予期しないエラーが発生しました。");
}
