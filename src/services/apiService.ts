import type { ExpenseRequest, ExpenseResponse } from "@/types/expense";

export class ApiService {
	private baseUrl: string;

	constructor(baseUrl = "/api") {
		this.baseUrl = baseUrl;
	}

	async submitExpense(expenseData: ExpenseRequest): Promise<ExpenseResponse> {
		// Simulate API response in development
		if (import.meta.env.DEV) {
			console.log("開発環境: 経費送信シミュレート中...");
			await this.simulateDelay(1500);
			const result = {
				id: `exp_${Date.now()}`,
				status: "success" as const,
				message: "経費申請が正常に送信されました。",
				submittedAt: new Date().toISOString(),
			};
			console.log("送信完了:", result.id);
			return result;
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
			console.error("API call error:", error);
			throw new Error("Failed to submit expense report.");
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
