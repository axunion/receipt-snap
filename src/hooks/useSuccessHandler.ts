import { expenseFormStore } from "@/stores/expenseFormStore";
import { parseAmount } from "@/utils";
import { createSignal } from "solid-js";

export interface SuccessHandlerProps {
	onReset: () => void;
}

export function useSuccessHandler(props: SuccessHandlerProps) {
	const [showSuccessModal, setShowSuccessModal] = createSignal(false);
	const [submittedData, setSubmittedData] = createSignal<{
		purpose: string;
		details: string;
		amount: number;
	}>();

	const handleSuccess = () => {
		setSubmittedData({
			purpose: expenseFormStore.purpose(),
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
