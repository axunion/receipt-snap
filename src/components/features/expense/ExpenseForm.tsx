import {
	AmountField,
	DateField,
	DetailsField,
	NameField,
	NotesField,
	PurposeField,
	ReceiptField,
} from "@/components/features/expense/FormFields";
import { SuccessModal } from "@/components/features/expense/SuccessModal";
import { Button, LoadingOverlay } from "@/components/ui";
import { useExpenseForm } from "@/hooks";
import { MainLayout } from "@/layouts/MainLayout";
import { expenseFormStore, purposeStore } from "@/stores";
import { parseAmount } from "@/utils";
import { For, createSignal } from "solid-js";

export function ExpenseForm() {
	const isSubmitting = () => expenseFormStore.submitState().isLoading;
	const { formErrors, fieldErrors, touchedFields, submitForm, resetForm } =
		useExpenseForm();

	// Success modal state management
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
		resetForm();
	};

	const handleCloseModal = () => {
		setShowSuccessModal(false);
		setSubmittedData(undefined);
	};

	const renderErrors = () => {
		const submitError =
			expenseFormStore.submitState().result?.result === "error"
				? expenseFormStore.submitState().result?.error
				: null;

		const validationErrors =
			formErrors().length > 0 && Object.values(touchedFields()).some(Boolean)
				? formErrors().filter(
						(fe: string) => !Object.values(fieldErrors()).includes(fe),
					)
				: [];

		if (!submitError && validationErrors.length === 0) {
			return null;
		}

		return (
			<div class="p-4 bg-red-50 border border-red-200 rounded-lg">
				{submitError && (
					<p class="text-sm font-medium text-red-800 mb-2">{submitError}</p>
				)}

				{validationErrors.length > 0 && (
					<>
						<p class="text-sm font-medium text-red-800 mb-2">入力エラー:</p>
						<ul class="text-sm text-red-700 list-disc list-inside space-y-1">
							<For each={validationErrors}>{(error) => <li>{error}</li>}</For>
						</ul>
					</>
				)}
			</div>
		);
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
				<PurposeField fieldErrors={fieldErrors} touchedFields={touchedFields} />
				<ReceiptField fieldErrors={fieldErrors} touchedFields={touchedFields} />
				<DetailsField fieldErrors={fieldErrors} touchedFields={touchedFields} />
				<AmountField fieldErrors={fieldErrors} touchedFields={touchedFields} />
				<DateField fieldErrors={fieldErrors} touchedFields={touchedFields} />
				<NameField fieldErrors={fieldErrors} touchedFields={touchedFields} />
				<NotesField />

				{renderErrors()}

				<Button
					type="submit"
					disabled={isSubmitting()}
					class="w-full"
					variant={isSubmitting() ? "secondary" : "primary"}
					size="lg"
				>
					{isSubmitting() ? "送信中..." : "送信する"}
				</Button>

				<LoadingOverlay isVisible={isSubmitting()} message="送信中..." />
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
