import { createEffect, createSignal } from "solid-js";
import { parseAmount } from "@/utils";
import { destinationStore } from "./destinationStore";
import { expenseFormStore } from "./expenseFormStore";

export interface SubmittedData {
	destinationLabel: string;
	details: string;
	amount: number;
}

export function useSubmitFeedback(resetForm: () => void) {
	const [showSuccessModal, setShowSuccessModal] = createSignal(false);
	const [showErrorModal, setShowErrorModal] = createSignal(false);
	const [submittedData, setSubmittedData] = createSignal<SubmittedData>();
	const [errorMessage, setErrorMessage] = createSignal<string>("");

	// Monitor submit state changes
	createEffect(() => {
		const submitResult = expenseFormStore.submitState().result;
		const isLoading = expenseFormStore.submitState().isLoading;

		if (!isLoading && submitResult) {
			if (submitResult.result === "done") {
				handleSuccess();
			} else if (submitResult.result === "error") {
				handleError(submitResult.error);
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
		// Clear submit state first to prevent re-triggering
		expenseFormStore.setSubmitState({ isLoading: false, result: null });
		resetForm();
	};

	const handleCloseError = () => {
		setShowErrorModal(false);
		setErrorMessage("");
		// Clear submit state to prevent re-triggering
		expenseFormStore.setSubmitState({ isLoading: false, result: null });
	};

	return {
		showSuccessModal,
		submittedData,
		handleNewExpense,
		showErrorModal,
		errorMessage,
		handleCloseError,
	};
}
