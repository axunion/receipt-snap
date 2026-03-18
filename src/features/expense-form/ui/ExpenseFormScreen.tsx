import { For, Show } from "solid-js";
import { Button, Overlay, Spinner } from "@/components/ui";
import { MainLayout } from "@/layouts/MainLayout";
import { useExpenseFormController } from "../model";
import { ErrorModal } from "./ErrorModal";
import {
	AmountField,
	DateField,
	DestinationField,
	DetailsField,
	NameField,
	NotesField,
	ReceiptField,
} from "./ExpenseFormFields";
import styles from "./ExpenseFormScreen.module.css";
import { NameOnboardingOverlay } from "./NameOnboardingOverlay";
import { SuccessModal } from "./SuccessModal";

export function ExpenseFormScreen() {
	const controller = useExpenseFormController();

	return (
		<MainLayout title="Receipt Snap">
			<form
				onSubmit={controller.handleSubmit}
				class={`${styles.form} form-container`}
			>
				<NameField
					value={controller.name()}
					onInput={controller.setName}
					fieldErrors={controller.fieldErrors}
					touchedFields={controller.touchedFields}
					onNameClick={
						controller.isExternalName() ? undefined : controller.openOnboarding
					}
				/>
				<ReceiptField
					fieldErrors={controller.fieldErrors}
					touchedFields={controller.touchedFields}
					receiptFile={controller.receiptFile()}
					noImageReason={controller.noImageReason()}
					onReceiptFileChange={controller.setReceiptFile}
					onNoImageReasonChange={controller.setNoImageReason}
					onRemoveReceipt={controller.removeReceipt}
					onClearReceipt={controller.clearReceipt}
				/>
				<DestinationField
					value={controller.destination()}
					onSelect={controller.setDestination}
					options={controller.destinationOptions()}
					isLoading={controller.isDestinationLoading()}
					fieldErrors={controller.fieldErrors}
					touchedFields={controller.touchedFields}
				/>
				<DateField
					value={controller.date()}
					onInput={controller.setDate}
					fieldErrors={controller.fieldErrors}
					touchedFields={controller.touchedFields}
				/>
				<AmountField
					value={controller.amount()}
					onInput={controller.setAmount}
					fieldErrors={controller.fieldErrors}
					touchedFields={controller.touchedFields}
				/>
				<DetailsField
					value={controller.details()}
					onInput={controller.setDetails}
					fieldErrors={controller.fieldErrors}
					touchedFields={controller.touchedFields}
				/>
				<NotesField value={controller.notes()} onInput={controller.setNotes} />

				<Show when={controller.hasGeneralErrors()}>
					<div class={styles.errorBox}>
						<p class={styles.errorTitle}>入力エラー:</p>
						<ul class={styles.errorList}>
							<For each={controller.formErrors()}>
								{(error) => <li>{error}</li>}
							</For>
						</ul>
					</div>
				</Show>

				<Button
					type="submit"
					disabled={controller.isSubmitting()}
					class="w-full"
					variant={controller.isSubmitting() ? "secondary" : "primary"}
					size="lg"
				>
					{controller.isSubmitting() ? "送信中..." : "送信する"}
				</Button>

				<Overlay isVisible={controller.isSubmitting()}>
					<Spinner size="lg" />
				</Overlay>
			</form>

			<NameOnboardingOverlay
				isVisible={controller.showOnboarding()}
				name={controller.name()}
				onInput={controller.setName}
				onComplete={controller.completeOnboarding}
			/>

			<SuccessModal
				isOpen={controller.showSuccessModal()}
				onNewExpense={controller.handleNewExpense}
				submittedExpense={controller.submittedData()}
				title="送信完了しました"
				buttonText="続けて追加する"
			/>

			<ErrorModal
				isOpen={controller.showErrorModal()}
				onClose={controller.handleCloseError}
				error={controller.errorMessage()}
				title="送信エラー"
				buttonText="やり直す"
			/>

			<ErrorModal
				isOpen={controller.showDestinationError()}
				onClose={controller.retryDestinationLoad}
				error={controller.destinationError() || ""}
				title="送信先取得エラー"
				buttonText="再試行"
			/>
		</MainLayout>
	);
}
