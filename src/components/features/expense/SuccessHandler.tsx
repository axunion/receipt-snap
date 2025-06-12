import { SuccessModal } from "@/components/features/expense/SuccessModal";
import type { Accessor } from "solid-js";

interface SuccessModalWrapperProps {
	showSuccessModal: Accessor<boolean>;
	submittedData: Accessor<
		| {
				name: string;
				amount: number;
				details: string;
		  }
		| undefined
	>;
	onClose: () => void;
	onNewExpense: () => void;
}

export function SuccessModalWrapper(props: SuccessModalWrapperProps) {
	return (
		<SuccessModal
			isOpen={props.showSuccessModal()}
			onClose={props.onClose}
			onNewExpense={props.onNewExpense}
			submittedExpense={props.submittedData()}
		/>
	);
}
