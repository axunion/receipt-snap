import {
	ErrorDisplay,
	SubmissionErrorDisplay,
} from "@/components/features/expense/FormFields";
import { FormFieldsContainer } from "@/components/features/expense/FormFieldsContainer";
import { FormSubmission } from "@/components/features/expense/FormSubmission";
import { SuccessModalWrapper } from "@/components/features/expense/SuccessHandler";
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

		if (result?.status === "success") {
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

			<SuccessModalWrapper
				showSuccessModal={showSuccessModal}
				submittedData={submittedData}
				onClose={handleCloseModal}
				onNewExpense={handleNewExpense}
			/>
		</MainLayout>
	);
}
