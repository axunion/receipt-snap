import {
	ErrorDisplay,
	SubmissionErrorDisplay,
} from "@/components/features/expense/FormFields";
import { FormFieldsContainer } from "@/components/features/expense/FormFieldsContainer";
import { FormSubmission } from "@/components/features/expense/FormSubmission";
import { SuccessModal } from "@/components/features/expense/SuccessModal";
import { useExpenseForm, useSuccessHandler } from "@/hooks";
import { MainLayout } from "@/layouts/MainLayout";

export function ExpenseForm() {
	// Use business logic hook for complex operations
	const { formErrors, fieldErrors, touchedFields, submitForm, resetForm } =
		useExpenseForm();

	// Use success handler for modal logic
	const {
		showSuccessModal,
		submittedData,
		handleSuccess,
		handleNewExpense,
		handleCloseModal,
	} = useSuccessHandler({ onReset: resetForm });

	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		const result = await submitForm();

		if (result?.result === "done") {
			handleSuccess();
		}
	};

	return (
		<MainLayout title="Receipt Snap">
			<form onSubmit={handleSubmit} class="space-y-6 relative form-container">
				<FormFieldsContainer
					fieldErrors={fieldErrors}
					touchedFields={touchedFields}
				/>

				<ErrorDisplay
					formErrors={formErrors}
					fieldErrors={fieldErrors}
					touchedFields={touchedFields}
				/>

				<SubmissionErrorDisplay />

				<FormSubmission />
			</form>

			<SuccessModal
				isOpen={showSuccessModal()}
				onClose={handleCloseModal}
				onNewExpense={handleNewExpense}
				submittedExpense={submittedData()}
			/>
		</MainLayout>
	);
}
