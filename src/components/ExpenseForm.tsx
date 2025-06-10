import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { Select } from "@/components/Select";
import { SuccessModal } from "@/components/SuccessModal";
import { Textarea } from "@/components/Textarea";
import { ReceiptCamera } from "@/components/receipt-camera/ReceiptCamera";
import { useExpenseForm } from "@/hooks/useExpenseForm";
import { MainLayout } from "@/layouts/MainLayout";
import { EXPENSE_CATEGORIES } from "@/types/expense";
import type { ExpenseCategory } from "@/types/expense";
import { parseAmount } from "@/utils/formatUtils";
import { For, Show, createSignal } from "solid-js";

export function ExpenseForm() {
	const {
		name,
		amount,
		date,
		category,
		notes,
		receiptImage,
		submitState,
		formErrors,
		fieldErrors,
		touchedFields,
		setName,
		setAmount,
		setDate,
		setCategory,
		setNotes,
		setReceiptImage,
		setNoImageReason,
		submitForm,
		resetForm,
	} = useExpenseForm();

	const [showSuccessModal, setShowSuccessModal] = createSignal(false);
	const [submittedData, setSubmittedData] = createSignal<
		| {
				name: string;
				amount: number;
				category: string;
		  }
		| undefined
	>();

	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		const result = await submitForm();

		if (result?.status === "success") {
			const submissionData = {
				name: name(),
				amount: parseAmount(amount()),
				category:
					EXPENSE_CATEGORIES.find((cat) => cat.value === category())?.label ||
					category(),
			};
			setSubmittedData(submissionData);
			setShowSuccessModal(true);
		}
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

	return (
		<MainLayout title="Receipt Snap">
			<form onSubmit={handleSubmit} class="space-y-6 relative form-container">
				<div>
					<Label required icon="material-symbols:receipt-outline">
						レシート
					</Label>
					<ReceiptCamera
						onImageCapture={setReceiptImage}
						onNoImageReason={setNoImageReason}
						currentImage={receiptImage() || undefined}
					/>
					<Show when={fieldErrors().receipt && touchedFields().receipt}>
						<p id="receipt-error" class="text-sm text-red-600 mt-1">
							{fieldErrors().receipt}
						</p>
					</Show>
				</div>
				<div>
					<Label required icon="material-symbols:person-outline">
						名前
					</Label>
					<Input
						type="text"
						placeholder="名前を入力"
						value={name()}
						onInput={setName}
						required
						aria-invalid={!!(fieldErrors().name && touchedFields().name)}
						aria-describedby={
							fieldErrors().name && touchedFields().name
								? "name-error"
								: undefined
						}
					/>
					<Show when={fieldErrors().name && touchedFields().name}>
						<p id="name-error" class="text-sm text-red-600 mt-1">
							{fieldErrors().name}
						</p>
					</Show>
				</div>
				<div>
					<Label required icon="material-symbols:format-list-bulleted">
						カテゴリ
					</Label>
					<Select
						options={EXPENSE_CATEGORIES}
						value={category()}
						onSelect={(value) => setCategory(value as ExpenseCategory)}
						placeholder="カテゴリを選択"
						required
						aria-invalid={
							!!(fieldErrors().category && touchedFields().category)
						}
						aria-describedby={
							fieldErrors().category && touchedFields().category
								? "category-error"
								: undefined
						}
					/>
					<Show when={fieldErrors().category && touchedFields().category}>
						<p id="category-error" class="text-sm text-red-600 mt-1">
							{fieldErrors().category}
						</p>
					</Show>
				</div>
				<div>
					<Label required icon="material-symbols:calendar-today-outline">
						支払日
					</Label>
					<Input
						type="date"
						value={date()}
						onInput={setDate}
						required
						aria-invalid={!!(fieldErrors().date && touchedFields().date)}
						aria-describedby={
							fieldErrors().date && touchedFields().date
								? "date-error"
								: undefined
						}
					/>
					<Show when={fieldErrors().date && touchedFields().date}>
						<p id="date-error" class="text-sm text-red-600 mt-1">
							{fieldErrors().date}
						</p>
					</Show>
				</div>
				<div>
					<Label required icon="material-symbols:payments-outline">
						金額
					</Label>
					<Input
						type="amount"
						placeholder="0"
						value={amount()}
						onInput={setAmount}
						required
						aria-invalid={!!(fieldErrors().amount && touchedFields().amount)}
						aria-describedby={
							fieldErrors().amount && touchedFields().amount
								? "amount-error"
								: undefined
						}
					/>
					<Show when={fieldErrors().amount && touchedFields().amount}>
						<p id="amount-error" class="text-sm text-red-600 mt-1">
							{fieldErrors().amount}
						</p>
					</Show>
				</div>
				<div>
					<Label icon="material-symbols:note-outline">備考</Label>
					<Textarea
						placeholder="備考があれば入力してください"
						value={notes()}
						onInput={setNotes}
						rows={4}
					/>
				</div>

				<Show
					when={
						formErrors().length > 0 &&
						Object.values(touchedFields()).some(Boolean) &&
						formErrors().some(
							(fe) => !Object.values(fieldErrors()).includes(fe as string),
						)
					}
				>
					<div class="p-4 bg-red-50 border border-red-200 rounded-lg">
						<p class="text-sm font-medium text-red-800 mb-2">入力エラー:</p>
						<ul class="text-sm text-red-700 list-disc list-inside space-y-1">
							<For
								each={formErrors().filter(
									(fe) => !Object.values(fieldErrors()).includes(fe as string),
								)}
							>
								{(error) => <li>{error}</li>}
							</For>
						</ul>
					</div>
				</Show>

				<Show
					when={
						submitState().result && submitState().result?.status === "error"
					}
				>
					<div class="p-4 rounded-lg border bg-red-50 border-red-200">
						<p class="text-sm font-medium text-red-800">
							{submitState().result?.message}
						</p>
					</div>
				</Show>

				<Button
					type="submit"
					disabled={submitState().isSubmitting}
					class="w-full"
					variant={submitState().isSubmitting ? "secondary" : "primary"}
					size="lg"
				>
					{submitState().isSubmitting ? "送信中..." : "登録する"}
				</Button>

				<LoadingOverlay
					isVisible={submitState().isSubmitting}
					message="送信中..."
				/>
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
