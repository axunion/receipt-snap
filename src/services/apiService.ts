import type { ExpenseRequest, ExpenseResponse } from "@/types/expense";

export class ApiService {
	private baseUrl: string;

	constructor(baseUrl = "/api") {
		this.baseUrl = baseUrl;
	}

	async submitExpense(expenseData: ExpenseRequest): Promise<ExpenseResponse> {
		// 開発環境ではモックレスポンスを返す
		if (import.meta.env.DEV) {
			await this.simulateDelay(1500);
			return {
				id: `exp_${Date.now()}`,
				status: "success",
				message: "経費申請が正常に送信されました",
				submittedAt: new Date().toISOString(),
			};
		}

		const formData = this.buildFormData(expenseData);

		try {
			const response = await fetch(`${this.baseUrl}/expenses`, {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error("API呼び出しエラー:", error);
			throw new Error("経費申請の送信に失敗しました");
		}
	}

	private buildFormData(expenseData: ExpenseRequest): FormData {
		const formData = new FormData();
		formData.append("name", expenseData.name);
		formData.append("amount", expenseData.amount.toString());
		formData.append("date", expenseData.date);
		formData.append("category", expenseData.category);

		if (expenseData.notes) {
			formData.append("notes", expenseData.notes);
		}

		formData.append("receiptImage", expenseData.receiptImage);
		return formData;
	}

	private simulateDelay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

export const apiService = new ApiService();
