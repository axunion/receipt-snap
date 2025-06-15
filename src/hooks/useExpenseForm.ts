import { submitExpense } from "@/services/apiService";
import { expenseFormStore } from "@/stores/expenseFormStore";
import type { SubmitResponse } from "@/types/api";
import type { ExpenseData } from "@/types/expense";
import { parseAmount } from "@/utils";
import { useFormValidation } from "./useFormValidation";

export function useExpenseForm() {
	// Use validation hook
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

	const resetForm = () => {
		expenseFormStore.resetForm();
		validation.resetValidation();
	};

	const submitForm = async (): Promise<SubmitResponse | undefined> => {
		// Format amount for validation
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
			console.log("Validation failed:", validation.formErrors());
			return undefined;
		}

		console.log("Submission started - Data:", {
			name: expenseFormStore.name(),
			amount: currentAmount,
			date: expenseFormStore.date(),
			details: expenseFormStore.details(),
		});

		expenseFormStore.setSubmitState({ isLoading: true, result: null });

		try {
			const expenseData: ExpenseData = {
				name: expenseFormStore.name(),
				amount: expenseFormStore.amount(),
				date: expenseFormStore.date(),
				details: expenseFormStore.details(),
				purpose: expenseFormStore.purpose(),
				notes: expenseFormStore.notes(),
				receiptImage: expenseFormStore.receiptImage(),
			};

			const result = await submitExpense(expenseData);
			console.log("Result from API:", result);
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

	return {
		// Form state - direct signal access (SolidJS best practice)
		name: expenseFormStore.name,
		amount: expenseFormStore.amount,
		date: expenseFormStore.date,
		details: expenseFormStore.details,
		purpose: expenseFormStore.purpose,
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
		setDetails: expenseFormStore.setDetails,
		setPurpose: expenseFormStore.setPurpose,
		setNotes: expenseFormStore.setNotes,
		setReceiptImage: expenseFormStore.setReceiptImage,
		setNoImageReason: expenseFormStore.setNoImageReason,

		// Form actions
		submitForm,
		resetForm,
	};
}
