import { expenseFormStore } from "@/stores/expenseFormStore";
import { EXPENSE_CATEGORIES } from "@/types/expense";
import { parseAmount } from "@/utils/formatUtils";
import { createSignal } from "solid-js";

export interface SubmissionData {
	name: string;
	amount: number;
	category: string;
}

export interface SuccessHandlerProps {
	onReset: () => void;
}

export function useSuccessHandler(props: SuccessHandlerProps) {
	const [showSuccessModal, setShowSuccessModal] = createSignal(false);
	const [submittedData, setSubmittedData] = createSignal<
		SubmissionData | undefined
	>();

	const handleSuccess = () => {
		const submissionData: SubmissionData = {
			name: expenseFormStore.name(),
			amount: parseAmount(expenseFormStore.amount()),
			category:
				EXPENSE_CATEGORIES.find(
					(cat) => cat.value === expenseFormStore.category(),
				)?.label || expenseFormStore.category(),
		};
		setSubmittedData(submissionData);
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
