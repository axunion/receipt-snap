import type { ExpenseRequest, ExpenseResponse } from "@/types/expense";

/**
 * 経費申請をAPIに送信する関数（モック機能付き）
 * @param expenseData 経費申請データ
 * @returns Promise<ExpenseResponse>
 */
export async function submitExpense(
	expenseData: ExpenseRequest,
): Promise<ExpenseResponse> {
	// 開発環境ではモックレスポンスを返す
	if (import.meta.env.DEV) {
		await new Promise((resolve) => setTimeout(resolve, 1500));
		return {
			id: `exp_${Date.now()}`,
			status: "success",
			message: "経費申請が正常に送信されました",
			submittedAt: new Date().toISOString(),
		};
	}

	const formData = new FormData();
	formData.append("name", expenseData.name);
	formData.append("amount", expenseData.amount.toString());
	formData.append("date", expenseData.date);
	formData.append("category", expenseData.category);

	if (expenseData.notes) {
		formData.append("notes", expenseData.notes);
	}

	formData.append("receiptImage", expenseData.receiptImage);

	try {
		const response = await fetch("/api/expenses", {
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

/**
 * 画像ファイルのバリデーション
 * @param file アップロードされたファイル
 * @returns バリデーション結果
 */
export function validateImageFile(file: File): {
	isValid: boolean;
	error?: string;
} {
	const maxSize = 10 * 1024 * 1024; // 10MB
	const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

	if (!allowedTypes.includes(file.type)) {
		return {
			isValid: false,
			error: "JPEG、PNG、WebP形式の画像ファイルのみ対応しています",
		};
	}

	if (file.size > maxSize) {
		return {
			isValid: false,
			error: "ファイルサイズは10MB以下にしてください",
		};
	}

	return { isValid: true };
}

/**
 * 日付フォーマット関数
 * @param date Date オブジェクト
 * @returns YYYY-MM-DD形式の文字列
 */
export function formatDateForInput(date: Date): string {
	return date.toISOString().split("T")[0];
}
