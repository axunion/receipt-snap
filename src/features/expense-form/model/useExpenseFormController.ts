import { createEffect, createMemo, createSignal } from "solid-js";
import { loadUserName, saveUserName } from "@/utils";
import { destinationStore } from "./destinationStore";
import { expenseFormStore } from "./expenseFormStore";
import { useExpenseForm } from "./useExpenseForm";
import { useRecaptcha } from "./useRecaptcha";
import { useSubmitFeedback } from "./useSubmitFeedback";

export function useExpenseFormController() {
	const [showOnboarding, setShowOnboarding] = createSignal(!loadUserName());
	const [showDestinationError, setShowDestinationError] = createSignal(false);

	const expenseForm = useExpenseForm();
	const submitFeedback = useSubmitFeedback(expenseForm.resetForm);

	useRecaptcha();

	createEffect(() => {
		if (expenseFormStore.isExternalName()) {
			setShowOnboarding(false);
		}
	});

	createEffect(() => {
		if (destinationStore.error()) {
			setShowDestinationError(true);
		}
	});

	const isSubmitting = () => expenseFormStore.submitState().isLoading;

	const hasGeneralErrors = createMemo(() => {
		const hasErrors = expenseForm.formErrors().length > 0;
		const hasTouched = Object.values(expenseForm.touchedFields()).some(Boolean);
		return hasErrors && hasTouched;
	});

	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		await expenseForm.submitForm();
	};

	const openOnboarding = () => {
		if (!expenseFormStore.isExternalName()) {
			setShowOnboarding(true);
		}
	};

	const completeOnboarding = () => {
		const name = expenseFormStore.name().trim();

		if (!name) {
			return;
		}

		expenseFormStore.setName(name);
		saveUserName(name);
		setShowOnboarding(false);
	};

	const retryDestinationLoad = () => {
		setShowDestinationError(false);
		void destinationStore.refetch();
	};

	return {
		name: expenseFormStore.name,
		setName: expenseFormStore.setName,
		amount: expenseFormStore.amount,
		setAmount: expenseFormStore.setAmount,
		date: expenseFormStore.date,
		setDate: expenseFormStore.setDate,
		details: expenseFormStore.details,
		setDetails: expenseFormStore.setDetails,
		destination: expenseFormStore.destination,
		setDestination: expenseFormStore.setDestination,
		notes: expenseFormStore.notes,
		setNotes: expenseFormStore.setNotes,
		noImageReason: expenseFormStore.noImageReason,
		setNoImageReason: expenseFormStore.setNoImageReason,
		receiptFile: expenseFormStore.receiptFile,
		setReceiptFile: expenseFormStore.setReceiptFile,
		removeReceipt: expenseFormStore.removeReceipt,
		clearReceipt: expenseFormStore.clearReceipt,
		isExternalName: expenseFormStore.isExternalName,
		isSubmitting,
		destinationOptions: destinationStore.destinations,
		isDestinationLoading: destinationStore.loading,
		destinationError: destinationStore.error,
		formErrors: expenseForm.formErrors,
		fieldErrors: expenseForm.fieldErrors,
		touchedFields: expenseForm.touchedFields,
		hasGeneralErrors,
		showOnboarding,
		showDestinationError,
		showSuccessModal: submitFeedback.showSuccessModal,
		submittedData: submitFeedback.submittedData,
		showErrorModal: submitFeedback.showErrorModal,
		errorMessage: submitFeedback.errorMessage,
		handleSubmit,
		openOnboarding,
		completeOnboarding,
		retryDestinationLoad,
		handleNewExpense: submitFeedback.handleNewExpense,
		handleCloseError: submitFeedback.handleCloseError,
	};
}
