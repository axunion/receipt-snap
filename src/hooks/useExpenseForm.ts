import { submitExpense } from "@/services/apiService";
import { expenseFormStore } from "@/stores/expenseFormStore";
import type { SubmitResponse } from "@/types/api";
import { parseAmount } from "@/utils";
import { useFormValidation } from "./useFormValidation";

export function useExpenseForm() {
	const validation = useFormValidation();

	// Setup real-time validation using store signals
	validation.setupRealtimeValidation(
		expenseFormStore.name,
		expenseFormStore.amount,
		expenseFormStore.date,
		expenseFormStore.details,
		expenseFormStore.purpose,
		expenseFormStore.receiptImage,
		expenseFormStore.noImageReason,
	);

	const submitForm = async () => {
		// Validate before submission
		const currentAmount = parseAmount(expenseFormStore.amount());
		const isValid = validation.validateFullForm({
			name: expenseFormStore.name(),
			amount: currentAmount,
			date: expenseFormStore.date(),
			details: expenseFormStore.details(),
			purpose: expenseFormStore.purpose(),
			receiptImage: expenseFormStore.receiptImage() || undefined,
			noImageReason: expenseFormStore.noImageReason() || undefined,
		});

		if (!isValid) {
			if (import.meta.env.DEV) {
				console.log("Validation failed:", validation.formErrors());
			}
			return undefined;
		}

		expenseFormStore.setSubmitState({ isLoading: true, result: null });

		try {
			const formData = expenseFormStore.getFormData();
			const result = await submitExpense(formData);
			expenseFormStore.setSubmitState({ isLoading: false, result });
			return result;
		} catch (error) {
			console.error("Submit error:", error);
			const errorResult: SubmitResponse = {
				result: "error",
				error: "An error occurred during submission. Please try again",
			};
			expenseFormStore.setSubmitState({
				isLoading: false,
				result: errorResult,
			});
			return errorResult;
		}
	};

	const resetForm = () => {
		expenseFormStore.resetForm();
		validation.resetValidation();
	};

	return {
		formErrors: validation.formErrors,
		fieldErrors: validation.fieldErrors,
		touchedFields: validation.touchedFields,
		submitForm,
		resetForm,
	};
}
