import { createSignal } from "solid-js";
import { FormErrorDisplay } from "@/components/features/FormErrorDisplay";
import {
	AmountField,
	DateField,
	DestinationField,
	DetailsField,
	NameField,
	NotesField,
	ReceiptField,
} from "@/components/features/FormFields";
import { NameOnboardingOverlay } from "@/components/features/NameOnboardingOverlay";
import { SuccessModal } from "@/components/features/SuccessModal";
import { Button, Overlay, Spinner } from "@/components/ui";
import { useExpenseForm, useRecaptcha, useSuccessModal } from "@/hooks";
import { MainLayout } from "@/layouts/MainLayout";
import { expenseFormStore } from "@/stores";

export function FormContainer() {
	const isSubmitting = () => expenseFormStore.submitState().isLoading;
	const [showOnboarding, setShowOnboarding] = createSignal(true);

	const { formErrors, fieldErrors, touchedFields, submitForm, resetForm } =
		useExpenseForm();
	const {
		showSuccessModal,
		submittedData,
		handleSuccess,
		handleNewExpense,
		handleCloseModal,
	} = useSuccessModal(resetForm);

	useRecaptcha();

	const handleOnboardingComplete = () => {
		setShowOnboarding(false);
	};

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
				<NameField
					fieldErrors={fieldErrors}
					touchedFields={touchedFields}
					onNameClick={() => setShowOnboarding(true)}
				/>
				<ReceiptField fieldErrors={fieldErrors} touchedFields={touchedFields} />
				<DestinationField
					fieldErrors={fieldErrors}
					touchedFields={touchedFields}
				/>
				<DateField fieldErrors={fieldErrors} touchedFields={touchedFields} />
				<AmountField fieldErrors={fieldErrors} touchedFields={touchedFields} />
				<DetailsField fieldErrors={fieldErrors} touchedFields={touchedFields} />
				<NotesField />

				<FormErrorDisplay
					formErrors={formErrors}
					fieldErrors={fieldErrors}
					touchedFields={touchedFields}
				/>

				<Button
					type="submit"
					disabled={isSubmitting()}
					class="w-full"
					variant={isSubmitting() ? "secondary" : "primary"}
					size="lg"
				>
					{isSubmitting() ? "送信中..." : "送信する"}
				</Button>

				<Overlay isVisible={isSubmitting()}>
					<Spinner size="lg" />
				</Overlay>
			</form>

			<NameOnboardingOverlay
				isVisible={showOnboarding}
				onComplete={handleOnboardingComplete}
			/>

			<SuccessModal
				isOpen={showSuccessModal()}
				onClose={handleCloseModal}
				onNewExpense={handleNewExpense}
				submittedExpense={submittedData()}
			/>
		</MainLayout>
	);
}
