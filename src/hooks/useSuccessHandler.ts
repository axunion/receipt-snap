import { expenseFormStore } from "@/stores/expenseFormStore";
import { parseAmount } from "@/utils/formatUtils";
import { createSignal } from "solid-js";

export interface SuccessHandlerProps {
	onReset: () => void;
}

export function useSuccessHandler(props: SuccessHandlerProps) {
	const [showSuccessModal, setShowSuccessModal] = createSignal(false);
	const [submittedData, setSubmittedData] = createSignal<{
		name: string;
		amount: number;
		details: string;
	}>();

	const handleSuccess = () => {
		setSubmittedData({
			name: expenseFormStore.name(),
			amount: parseAmount(expenseFormStore.amount()),
			details: expenseFormStore.details(),
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
