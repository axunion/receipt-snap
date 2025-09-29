import { createMemo, createSignal, For, Show } from "solid-js";
import { ErrorModal } from "@/components/features/ErrorModal";
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
import { useExpenseForm, useRecaptcha, useSubmitModal } from "@/hooks";
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
		handleNewExpense,
		showErrorModal,
		errorMessage,
		handleCloseError,
	} = useSubmitModal(resetForm);

	// Validation errors (not field-specific)
	const validationErrors = createMemo(() => {
		const hasFormErrors = formErrors().length > 0;
		const hasTouchedFields = Object.values(touchedFields()).some(Boolean);

		if (!hasFormErrors || !hasTouchedFields) return [];

		// Filter out field-specific errors to show only global ones
		const fieldErrorMessages = Object.values(fieldErrors());
		return formErrors().filter((error) => !fieldErrorMessages.includes(error));
	});

	useRecaptcha();

	const handleOnboardingComplete = () => {
		setShowOnboarding(false);
	};

	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		await submitForm();
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

				<Show when={validationErrors().length > 0}>
					<div class="p-4 bg-red-50 border border-red-200 rounded-lg">
						<p class="text-sm font-medium text-red-800 mb-2">入力エラー:</p>
						<ul class="text-sm text-red-700 list-disc list-inside space-y-1">
							<For each={validationErrors()}>{(error) => <li>{error}</li>}</For>
						</ul>
					</div>
				</Show>

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
				onNewExpense={handleNewExpense}
				submittedExpense={submittedData()}
			/>

			<ErrorModal
				isOpen={showErrorModal()}
				onClose={handleCloseError}
				error={errorMessage()}
			/>
		</MainLayout>
	);
}
