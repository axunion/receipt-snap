import { createEffect, createSignal } from "solid-js";
import { destinationStore, expenseFormStore } from "@/stores";
import type { SubmitErrorResponse } from "@/types";
import { parseAmount } from "@/utils";

export interface SubmittedExpenseData {
	destinationLabel: string;
	details: string;
	amount: number;
}

export function useSubmitModal(resetForm: () => void) {
	const [showSuccessModal, setShowSuccessModal] = createSignal(false);
	const [showErrorModal, setShowErrorModal] = createSignal(false);
	const [submittedData, setSubmittedData] =
		createSignal<SubmittedExpenseData>();
	const [errorMessage, setErrorMessage] = createSignal<string>("");

	// Monitor submit state changes
	createEffect(() => {
		const submitResult = expenseFormStore.submitState().result;
		const isLoading = expenseFormStore.submitState().isLoading;

		if (!isLoading && submitResult) {
			if (submitResult.result === "done") {
				handleSuccess();
			} else if (submitResult.result === "error") {
				handleError((submitResult as SubmitErrorResponse).error);
			}
		}
	});

	const handleSuccess = () => {
		const destinationValue = expenseFormStore.destination();
		const destinationLabel =
			destinationStore.getDestinationLabel(destinationValue);

		setSubmittedData({
			destinationLabel: destinationLabel,
			details: expenseFormStore.details(),
			amount: parseAmount(expenseFormStore.amount()),
		});
		setShowSuccessModal(true);
	};

	const handleError = (error: string) => {
		setErrorMessage(error);
		setShowErrorModal(true);
	};

	const handleNewExpense = () => {
		setShowSuccessModal(false);
		setSubmittedData(undefined);
		resetForm();
	};

	const handleCloseSuccess = () => {
		setShowSuccessModal(false);
		setSubmittedData(undefined);
	};

	const handleCloseError = () => {
		setShowErrorModal(false);
		setErrorMessage("");
		// Clear submit state to prevent re-triggering
		expenseFormStore.setSubmitState({ isLoading: false, result: null });
	};

	return {
		// Success modal
		showSuccessModal,
		submittedData,
		handleNewExpense,
		handleCloseSuccess,
		// Error modal
		showErrorModal,
		errorMessage,
		handleCloseError,
	};
}
