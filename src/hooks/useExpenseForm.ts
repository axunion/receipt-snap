import { apiService } from "@/services/apiService";
import { expenseFormStore } from "@/stores/expenseFormStore";
import type { ExpenseRequest, ExpenseResponse } from "@/types/expense";
import { parseAmount } from "@/utils/formatUtils";
import { useFormValidation } from "./useFormValidation";

// Re-export types for backward compatibility
export type { FieldErrors, TouchedFields } from "./useFormValidation";

export function useExpenseForm() {
	// Use validation hook
	const validation = useFormValidation();

	// Setup real-time validation using store signals
	validation.setupRealtimeValidation(
		expenseFormStore.name,
		expenseFormStore.amount,
		expenseFormStore.date,
		expenseFormStore.category,
		expenseFormStore.receiptImage,
		expenseFormStore.noImageReason,
	);

	const resetForm = () => {
		expenseFormStore.resetForm();
		validation.resetValidation();
	};

	const submitForm = async (): Promise<ExpenseResponse | undefined> => {
		// Format amount for validation
		const currentAmount = parseAmount(expenseFormStore.amount());

		const isValid = validation.validateFullForm({
			name: expenseFormStore.name(),
			amount: currentAmount,
			date: expenseFormStore.date(),
			category: expenseFormStore.category(),
			receiptImage: expenseFormStore.receiptImage() || undefined,
			noImageReason: expenseFormStore.noImageReason() || undefined,
		});

		if (!isValid) {
			console.log("バリデーション失敗:", validation.formErrors());
			return undefined;
		}

		console.log("送信開始 - データ:", {
			name: expenseFormStore.name(),
			amount: currentAmount,
			date: expenseFormStore.date(),
			category: expenseFormStore.category(),
		});

		expenseFormStore.setSubmitState({ isSubmitting: true, result: null });

		try {
			const finalImage =
				expenseFormStore.receiptImage() ||
				new File([""], "no-receipt.txt", { type: "text/plain" });

			const expenseData: ExpenseRequest = {
				name: expenseFormStore.name(),
				amount: currentAmount,
				date: expenseFormStore.date(),
				category: expenseFormStore.category(),
				notes: expenseFormStore.notes() || undefined,
				receiptImage: finalImage,
			};

			const result = await apiService.submitExpense(expenseData);
			console.log("APIから返却された結果:", result);
			expenseFormStore.setSubmitState({ isSubmitting: false, result });

			return result;
		} catch (error) {
			console.error("Submit error:", error);
			const errorResult: ExpenseResponse = {
				id: "",
				status: "error",
				message: "An error occurred during submission. Please try again.",
				submittedAt: new Date().toISOString(),
			};
			expenseFormStore.setSubmitState({
				isSubmitting: false,
				result: errorResult,
			});
			return errorResult;
		}
	};

	return {
		// Form state - direct signal access (SolidJS best practice)
		name: expenseFormStore.name,
		amount: expenseFormStore.amount,
		date: expenseFormStore.date,
		category: expenseFormStore.category,
		notes: expenseFormStore.notes,
		receiptImage: expenseFormStore.receiptImage,
		noImageReason: expenseFormStore.noImageReason,
		submitState: expenseFormStore.submitState,

		// Validation state
		formErrors: validation.formErrors,
		fieldErrors: validation.fieldErrors,
		touchedFields: validation.touchedFields,

		// Actions
		setName: expenseFormStore.setName,
		setAmount: expenseFormStore.setAmount,
		setDate: expenseFormStore.setDate,
		setCategory: expenseFormStore.setCategory,
		setNotes: expenseFormStore.setNotes,
		setReceiptImage: expenseFormStore.setReceiptImage,
		setNoImageReason: expenseFormStore.setNoImageReason,

		// Form actions
		submitForm,
		resetForm,
	};
}
