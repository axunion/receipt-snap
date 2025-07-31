import { ReceiptCamera } from "@/components/features/receipt-camera/ReceiptCamera";
import { Input, Label, Select, Textarea } from "@/components/ui";
import { destinationStore, expenseFormStore } from "@/stores";
import type { FieldErrors, TouchedFields } from "@/types/validation";
import { Show } from "solid-js";

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
				maxLength={24}
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
				maxLength={8}
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
				maxLength={1024}
			/>
		</div>
	);
}

export function DetailsField(props: FormFieldProps) {
	return (
		<div>
			<Label required icon="material-symbols:format-list-bulleted">
				内訳
			</Label>
			<Input
				type="text"
				placeholder="内訳を入力"
				value={expenseFormStore.details()}
				onInput={expenseFormStore.setDetails}
				required
				maxLength={64}
				aria-invalid={
					!!(props.fieldErrors().details && props.touchedFields().details)
				}
				aria-describedby={
					props.fieldErrors().details && props.touchedFields().details
						? "details-error"
						: undefined
				}
			/>
			<Show when={props.fieldErrors().details && props.touchedFields().details}>
				<p id="details-error" class="text-sm text-red-600 mt-1">
					{props.fieldErrors().details}
				</p>
			</Show>
		</div>
	);
}

export function DestinationField(props: FormFieldProps) {
	return (
		<div>
			<Label required icon="material-symbols:event-note-outline">
				対象
			</Label>
			<Select
				options={destinationStore.destinations() || []}
				value={expenseFormStore.destination()}
				onSelect={expenseFormStore.setDestination}
				placeholder="対象を選択"
				required
				aria-invalid={
					!!(
						props.fieldErrors().destination && props.touchedFields().destination
					)
				}
				aria-describedby={
					props.fieldErrors().destination && props.touchedFields().destination
						? "destination-error"
						: undefined
				}
				disabled={destinationStore.destinations.loading}
			/>
			<Show
				when={
					props.fieldErrors().destination && props.touchedFields().destination
				}
			>
				<p id="destination-error" class="text-sm text-red-600 mt-1">
					{props.fieldErrors().destination}
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
