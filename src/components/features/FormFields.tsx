import type { JSX } from "solid-js";
import { Show } from "solid-js";
import { ReceiptCamera } from "@/components/features/camera/ReceiptCamera";
import { Input, Label, Select, Textarea } from "@/components/ui";
import { destinationStore, expenseFormStore } from "@/stores";
import type { FieldErrors, TouchedFields } from "@/types";

interface FormFieldProps {
	fieldErrors: () => FieldErrors;
	touchedFields: () => TouchedFields;
	onNameClick?: () => void;
}

interface FormFieldWrapperProps {
	field: keyof FieldErrors;
	label: string;
	icon?: string;
	required?: boolean;
	fieldErrors: () => FieldErrors;
	touchedFields: () => TouchedFields;
	children: JSX.Element;
}

function FormFieldWrapper(props: FormFieldWrapperProps) {
	const error = () => props.fieldErrors()[props.field];
	const touched = () => props.touchedFields()[props.field];
	const errorId = `${props.field}-error`;

	return (
		<div>
			<Label required={props.required} icon={props.icon}>
				{props.label}
			</Label>
			{props.children}
			<Show when={error() && touched()}>
				<p id={errorId} class="text-sm text-red-600 mt-1">
					{error()}
				</p>
			</Show>
		</div>
	);
}

export function NameField(props: FormFieldProps) {
	return (
		<FormFieldWrapper
			field="name"
			label="名前"
			icon="material-symbols:person-outline"
			required
			fieldErrors={props.fieldErrors}
			touchedFields={props.touchedFields}
		>
			<Input
				type="text"
				placeholder="名前を変更するにはクリック"
				value={expenseFormStore.name()}
				onInput={expenseFormStore.setName}
				onClick={props.onNameClick}
				required
				maxLength={24}
				readOnly
				class="cursor-pointer"
				aria-invalid={
					!!(props.fieldErrors().name && props.touchedFields().name)
				}
				aria-describedby={
					props.fieldErrors().name && props.touchedFields().name
						? "name-error"
						: undefined
				}
			/>
		</FormFieldWrapper>
	);
}

export function AmountField(props: FormFieldProps) {
	return (
		<FormFieldWrapper
			field="amount"
			label="金額"
			icon="material-symbols:payments-outline"
			required
			fieldErrors={props.fieldErrors}
			touchedFields={props.touchedFields}
		>
			<Input
				type="text"
				placeholder="0"
				value={expenseFormStore.amount()}
				onInput={expenseFormStore.setAmount}
				required
				maxLength={8}
				inputmode="numeric"
				pattern="^[0-9]{1,8}$"
				aria-label="金額 (数字のみ)"
				aria-invalid={
					!!(props.fieldErrors().amount && props.touchedFields().amount)
				}
				aria-describedby={
					props.fieldErrors().amount && props.touchedFields().amount
						? "amount-error"
						: undefined
				}
			/>
		</FormFieldWrapper>
	);
}

export function DateField(props: FormFieldProps) {
	return (
		<FormFieldWrapper
			field="date"
			label="支払日"
			icon="material-symbols:calendar-today-outline"
			required
			fieldErrors={props.fieldErrors}
			touchedFields={props.touchedFields}
		>
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
		</FormFieldWrapper>
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
		<FormFieldWrapper
			field="details"
			label="内訳"
			icon="material-symbols:format-list-bulleted"
			required
			fieldErrors={props.fieldErrors}
			touchedFields={props.touchedFields}
		>
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
		</FormFieldWrapper>
	);
}

export function DestinationField(props: FormFieldProps) {
	return (
		<FormFieldWrapper
			field="destination"
			label="対象"
			icon="material-symbols:event-note-outline"
			required
			fieldErrors={props.fieldErrors}
			touchedFields={props.touchedFields}
		>
			<Select
				options={destinationStore.destinations() || []}
				value={expenseFormStore.destination()}
				onSelect={expenseFormStore.setDestination}
				placeholder={
					destinationStore.destinations.loading ? "読み込み中..." : "選択"
				}
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
		</FormFieldWrapper>
	);
}

export function ReceiptField(props: FormFieldProps) {
	return (
		<FormFieldWrapper
			field="receipt"
			label="レシート"
			icon="material-symbols:receipt-outline"
			required
			fieldErrors={props.fieldErrors}
			touchedFields={props.touchedFields}
		>
			<ReceiptCamera onImageCapture={expenseFormStore.setReceiptFile} />
		</FormFieldWrapper>
	);
}
