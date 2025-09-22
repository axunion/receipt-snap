import { createSignal } from "solid-js";
import { destinationStore, expenseFormStore } from "@/stores";
import { parseAmount } from "@/utils";

interface SubmittedExpenseData {
	destinationLabel: string;
	details: string;
	amount: number;
}

export function useSuccessModal(resetForm: () => void) {
	const [showSuccessModal, setShowSuccessModal] = createSignal(false);
	const [submittedData, setSubmittedData] =
		createSignal<SubmittedExpenseData>();

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

	const handleNewExpense = () => {
		setShowSuccessModal(false);
		setSubmittedData(undefined);
		resetForm();
	};

	const handleCloseModal = () => {
		setShowSuccessModal(false);
		setSubmittedData(undefined);
	};

	return {
		showSuccessModal,
		submittedData,
		handleSuccess,
		handleNewExpense,
		handleCloseModal,
	};
}
