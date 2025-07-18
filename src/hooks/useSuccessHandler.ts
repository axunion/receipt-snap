import { expenseFormStore, purposeStore } from "@/stores";
import { parseAmount } from "@/utils";
import { createSignal } from "solid-js";

export interface SuccessHandlerProps {
	onReset: () => void;
}

export function useSuccessHandler(props: SuccessHandlerProps) {
	const [showSuccessModal, setShowSuccessModal] = createSignal(false);
	const [submittedData, setSubmittedData] = createSignal<{
		purposeLabel: string;
		details: string;
		amount: number;
	}>();

	const handleSuccess = () => {
		const purposeValue = expenseFormStore.purpose();
		const purposeLabel = purposeStore.getPurposeLabel(purposeValue);

		setSubmittedData({
			purposeLabel: purposeLabel,
			details: expenseFormStore.details(),
			amount: parseAmount(expenseFormStore.amount()),
		});
		setShowSuccessModal(true);
	};

	const handleNewExpense = () => {
		setShowSuccessModal(false);
		setSubmittedData(undefined);
		props.onReset();
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
