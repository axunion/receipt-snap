/**
 * @deprecated このファイルは非推奨です。新しい構造を使用してください:
 * - API通信: @/services/apiService
 * - バリデーション: @/validators/validation
 * - 日付ユーティリティ: @/utils/dateUtils
 */

import { apiService } from "@/services/apiService";
import type { ExpenseRequest, ExpenseResponse } from "@/types/expense";
import { formatDateForInput as formatDate } from "@/utils/dateUtils";
import { validateImageFile as validateImageFileUtil } from "@/validators/validation";

// 後方互換性のためのレガシー関数
export async function submitExpense(
	expenseData: ExpenseRequest,
): Promise<ExpenseResponse> {
	return apiService.submitExpense(expenseData);
}

export function validateImageFile(file: File) {
	return validateImageFileUtil(file);
}

export function formatDateForInput(date: Date): string {
	return formatDate(date);
}
