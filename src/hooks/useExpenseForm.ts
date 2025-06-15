import { expenseFormStore } from "@/stores/expenseFormStore";
import { parseAmount } from "@/utils";
import { useFormValidation } from "./useFormValidation";

export function useExpenseForm() {
	// Use validation hook for form validation logic
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
			console.log("Validation failed:", validation.formErrors());
			return undefined;
		}

		// Delegate to store for actual submission
		return await expenseFormStore.submitForm();
	};

	const resetForm = () => {
		expenseFormStore.resetForm();
		validation.resetValidation();
	};

	return {
		// Validation state
		formErrors: validation.formErrors,
		fieldErrors: validation.fieldErrors,
		touchedFields: validation.touchedFields,

		// Form actions
		submitForm,
		resetForm,
	};
}
