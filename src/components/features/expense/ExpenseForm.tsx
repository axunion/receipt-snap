import { createSignal, For, onMount } from "solid-js";
import {
	AmountField,
	DateField,
	DestinationField,
	DetailsField,
	NameField,
	NotesField,
	ReceiptField,
} from "@/components/features/expense/FormFields";
import { SuccessModal } from "@/components/features/expense/SuccessModal";
import { Button, LoadingOverlay } from "@/components/ui";
import { CONFIG } from "@/constants/config";
import { useExpenseForm } from "@/hooks";
import { MainLayout } from "@/layouts/MainLayout";
import { destinationStore, expenseFormStore } from "@/stores";
import type { SubmitErrorResponse } from "@/types";
import { parseAmount } from "@/utils";

export function ExpenseForm() {
	const isSubmitting = () => expenseFormStore.submitState().isLoading;
	const { formErrors, fieldErrors, touchedFields, submitForm, resetForm } =
		useExpenseForm();

	const [showSuccessModal, setShowSuccessModal] = createSignal(false);
	const [submittedData, setSubmittedData] = createSignal<{
		destinationLabel: string;
		details: string;
		amount: number;
	}>();

	const handleSuccess = () => {
		const destinationValue = expenseFormStore.destination();
		const destinationLabel =
			destinationStore.getDestinationLabel(destinationValue);

		setSubmittedData({
			destinationLabel: destinationLabel,
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
				? (expenseFormStore.submitState().result as SubmitErrorResponse).error
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

	onMount(() => {
		if (
			CONFIG.RECAPTCHA.SITE_KEY &&
			!document.querySelector('script[src*="recaptcha"]')
		) {
			const script = document.createElement("script");
			script.src = `https://www.google.com/recaptcha/api.js?render=${CONFIG.RECAPTCHA.SITE_KEY}`;
			script.async = true;
			document.head.appendChild(script);
		}
	});

	return (
		<MainLayout title="Receipt Snap">
			<form onSubmit={handleSubmit} class="space-y-6 relative form-container">
				<DestinationField
					fieldErrors={fieldErrors}
					touchedFields={touchedFields}
				/>
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

				<LoadingOverlay isVisible={isSubmitting()} />
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
