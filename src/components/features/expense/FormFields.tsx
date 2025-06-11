import { ReceiptCamera } from "@/components/features/receipt-camera/ReceiptCamera";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { FieldErrors, TouchedFields } from "@/hooks/useFormValidation";
import { expenseFormStore } from "@/stores/expenseFormStore";
import { EXPENSE_CATEGORIES } from "@/types/expense";
import type { ExpenseCategory } from "@/types/expense";
import { For, Show } from "solid-js";

interface FormFieldProps {
	fieldErrors: () => FieldErrors;
	touchedFields: () => TouchedFields;
}

export function NameField(props: FormFieldProps) {
	return (
		<div>
			<Label required icon="material-symbols:person-outline">
				名前
			</Label>
			<Input
				type="text"
				placeholder="名前を入力"
				value={expenseFormStore.name()}
				onInput={expenseFormStore.setName}
				required
				aria-invalid={
					!!(props.fieldErrors().name && props.touchedFields().name)
				}
				aria-describedby={
					props.fieldErrors().name && props.touchedFields().name
						? "name-error"
						: undefined
				}
			/>
			<Show when={props.fieldErrors().name && props.touchedFields().name}>
				<p id="name-error" class="text-sm text-red-600 mt-1">
					{props.fieldErrors().name}
				</p>
			</Show>
		</div>
	);
}

export function AmountField(props: FormFieldProps) {
	return (
		<div>
			<Label required icon="material-symbols:payments-outline">
				金額
			</Label>
			<Input
				type="amount"
				placeholder="0"
				value={expenseFormStore.amount()}
				onInput={expenseFormStore.setAmount}
				required
				aria-invalid={
					!!(props.fieldErrors().amount && props.touchedFields().amount)
				}
				aria-describedby={
					props.fieldErrors().amount && props.touchedFields().amount
						? "amount-error"
						: undefined
				}
			/>
			<Show when={props.fieldErrors().amount && props.touchedFields().amount}>
				<p id="amount-error" class="text-sm text-red-600 mt-1">
					{props.fieldErrors().amount}
				</p>
			</Show>
		</div>
	);
}

export function DateField(props: FormFieldProps) {
	return (
		<div>
			<Label required icon="material-symbols:calendar-today-outline">
				支払日
			</Label>
			<Input
				type="date"
				value={expenseFormStore.date()}
				onInput={expenseFormStore.setDate}
				required
				aria-invalid={
					!!(props.fieldErrors().date && props.touchedFields().date)
				}
				aria-describedby={
					props.fieldErrors().date && props.touchedFields().date
						? "date-error"
						: undefined
				}
			/>
			<Show when={props.fieldErrors().date && props.touchedFields().date}>
				<p id="date-error" class="text-sm text-red-600 mt-1">
					{props.fieldErrors().date}
				</p>
			</Show>
		</div>
	);
}

export function NotesField() {
	return (
		<div>
			<Label icon="material-symbols:note-outline">備考</Label>
			<Textarea
				placeholder="備考があれば入力してください"
				value={expenseFormStore.notes()}
				onInput={expenseFormStore.setNotes}
				rows={4}
			/>
		</div>
	);
}

export function CategoryField(props: FormFieldProps) {
	return (
		<div>
			<Label required icon="material-symbols:format-list-bulleted">
				カテゴリ
			</Label>
			<Select
				options={EXPENSE_CATEGORIES}
				value={expenseFormStore.category()}
				onSelect={(value) =>
					expenseFormStore.setCategory(value as ExpenseCategory)
				}
				placeholder="カテゴリを選択"
				required
				aria-invalid={
					!!(props.fieldErrors().category && props.touchedFields().category)
				}
				aria-describedby={
					props.fieldErrors().category && props.touchedFields().category
						? "category-error"
						: undefined
				}
			/>
			<Show
				when={props.fieldErrors().category && props.touchedFields().category}
			>
				<p id="category-error" class="text-sm text-red-600 mt-1">
					{props.fieldErrors().category}
				</p>
			</Show>
		</div>
	);
}

export function ReceiptField(props: FormFieldProps) {
	return (
		<div>
			<Label required icon="material-symbols:receipt-outline">
				レシート
			</Label>
			<ReceiptCamera
				onImageCapture={expenseFormStore.setReceiptImage}
				currentImage={expenseFormStore.receiptImage() || undefined}
			/>
			<Show when={props.fieldErrors().receipt && props.touchedFields().receipt}>
				<p id="receipt-error" class="text-sm text-red-600 mt-1">
					{props.fieldErrors().receipt}
				</p>
			</Show>
		</div>
	);
}

export function ErrorDisplay(props: {
	formErrors: () => string[];
	fieldErrors: () => FieldErrors;
	touchedFields: () => TouchedFields;
}) {
	return (
		<Show
			when={
				props.formErrors().length > 0 &&
				Object.values(props.touchedFields()).some(Boolean) &&
				props
					.formErrors()
					.some(
						(fe: string) => !Object.values(props.fieldErrors()).includes(fe),
					)
			}
		>
			<div class="p-4 bg-red-50 border border-red-200 rounded-lg">
				<p class="text-sm font-medium text-red-800 mb-2">入力エラー:</p>
				<ul class="text-sm text-red-700 list-disc list-inside space-y-1">
					<For
						each={props
							.formErrors()
							.filter(
								(fe: string) =>
									!Object.values(props.fieldErrors()).includes(fe),
							)}
					>
						{(error) => <li>{error}</li>}
					</For>
				</ul>
			</div>
		</Show>
	);
}

export function SubmissionErrorDisplay() {
	return (
		<Show
			when={
				expenseFormStore.submitState().result &&
				expenseFormStore.submitState().result?.status === "error"
			}
		>
			<div class="p-4 rounded-lg border bg-red-50 border-red-200">
				<p class="text-sm font-medium text-red-800">
					{expenseFormStore.submitState().result?.message}
				</p>
			</div>
		</Show>
	);
}
