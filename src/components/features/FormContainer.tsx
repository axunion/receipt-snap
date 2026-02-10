import { createEffect, createMemo, createSignal, For, Show } from "solid-js";
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
import { destinationStore, expenseFormStore } from "@/stores";
import { loadUserName } from "@/utils";
import styles from "./FormContainer.module.css";

export function FormContainer() {
	const isSubmitting = () => expenseFormStore.submitState().isLoading;
	const [showOnboarding, setShowOnboarding] = createSignal(!loadUserName());
	const [showDestinationError, setShowDestinationError] = createSignal(false);

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

	createEffect(() => {
		if (expenseFormStore.isExternalName()) {
			setShowOnboarding(false);
		}
	});

	createEffect(() => {
		const error = destinationStore.error();
		if (error) {
			setShowDestinationError(true);
		}
	});

	const hasGeneralErrors = createMemo(() => {
		const hasErrors = formErrors().length > 0;
		const hasTouched = Object.values(touchedFields()).some(Boolean);
		return hasErrors && hasTouched;
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
			<form onSubmit={handleSubmit} class={`${styles.form} form-container`}>
				<NameField
					fieldErrors={fieldErrors}
					touchedFields={touchedFields}
					onNameClick={
						expenseFormStore.isExternalName()
							? undefined
							: () => setShowOnboarding(true)
					}
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

				<Show when={hasGeneralErrors()}>
					<div class={styles.errorBox}>
						<p class={styles.errorTitle}>入力エラー:</p>
						<ul class={styles.errorList}>
							<For each={formErrors()}>{(error) => <li>{error}</li>}</For>
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
				title="送信完了しました"
				buttonText="続けて追加する"
			/>

			<ErrorModal
				isOpen={showErrorModal()}
				onClose={handleCloseError}
				error={errorMessage()}
				title="送信エラー"
				buttonText="やり直す"
			/>

			<ErrorModal
				isOpen={showDestinationError()}
				onClose={() => {
					setShowDestinationError(false);
					window.location.reload();
				}}
				error={destinationStore.error() || ""}
				title="送信先取得エラー"
				buttonText="再読み込み"
			/>
		</MainLayout>
	);
}
