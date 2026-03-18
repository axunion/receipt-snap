import type { JSX } from "solid-js";
import { Show } from "solid-js";
import { Input, Label, Select, Spinner, Textarea } from "@/components/ui";
import type { FieldErrors, SelectOption, TouchedFields } from "@/types";
import { ReceiptCamera } from "./camera/ReceiptCamera";
import styles from "./ExpenseFormFields.module.css";

interface FormFieldProps {
	fieldErrors: () => FieldErrors;
	touchedFields: () => TouchedFields;
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
				<p id={errorId} class={styles.error}>
					{error()}
				</p>
			</Show>
		</div>
	);
}

interface NameFieldProps extends FormFieldProps {
	value: string;
	onInput: (value: string) => void;
	onNameClick?: () => void;
}

export function NameField(props: NameFieldProps) {
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
				placeholder={props.onNameClick ? "名前を変更するにはクリック" : "名前"}
				value={props.value}
				onInput={props.onInput}
				onClick={props.onNameClick}
				required
				maxLength={24}
				readOnly
				class={props.onNameClick ? "cursor-pointer" : undefined}
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

interface AmountFieldProps extends FormFieldProps {
	value: string;
	onInput: (value: string) => void;
}

export function AmountField(props: AmountFieldProps) {
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
				value={props.value}
				onInput={props.onInput}
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

interface DateFieldProps extends FormFieldProps {
	value: string;
	onInput: (value: string) => void;
}

export function DateField(props: DateFieldProps) {
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
				value={props.value}
				onInput={props.onInput}
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

interface NotesFieldProps {
	value: string;
	onInput: (value: string) => void;
}

export function NotesField(props: NotesFieldProps) {
	return (
		<div>
			<Label icon="material-symbols:note-outline">備考</Label>
			<Textarea
				placeholder="備考があれば入力してください"
				value={props.value}
				onInput={props.onInput}
				rows={4}
				maxLength={1024}
			/>
		</div>
	);
}

interface DetailsFieldProps extends FormFieldProps {
	value: string;
	onInput: (value: string) => void;
}

export function DetailsField(props: DetailsFieldProps) {
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
				value={props.value}
				onInput={props.onInput}
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

interface DestinationFieldProps extends FormFieldProps {
	value: string;
	options: SelectOption[];
	isLoading: boolean;
	onSelect: (value: string) => void;
}

export function DestinationField(props: DestinationFieldProps) {
	return (
		<FormFieldWrapper
			field="destination"
			label="対象"
			icon="material-symbols:event-note-outline"
			required
			fieldErrors={props.fieldErrors}
			touchedFields={props.touchedFields}
		>
			<div class={styles.destinationField}>
				<Select
					options={props.options}
					value={props.value}
					onSelect={props.onSelect}
					placeholder={props.isLoading ? "読み込み中..." : "選択"}
					required
					aria-invalid={
						!!(
							props.fieldErrors().destination &&
							props.touchedFields().destination
						)
					}
					aria-describedby={
						props.fieldErrors().destination && props.touchedFields().destination
							? "destination-error"
							: undefined
					}
					disabled={props.isLoading}
				/>
				<Show when={props.isLoading}>
					<div class={styles.loadingHint} aria-live="polite">
						<Spinner size="sm" />
						<span>送信先を読み込み中...</span>
					</div>
				</Show>
			</div>
		</FormFieldWrapper>
	);
}

interface ReceiptFieldProps extends FormFieldProps {
	receiptFile: File | null;
	noImageReason: string;
	onReceiptFileChange: (file: File) => void;
	onNoImageReasonChange: (value: string) => void;
	onRemoveReceipt: () => void;
	onClearReceipt: () => void;
}

export function ReceiptField(props: ReceiptFieldProps) {
	return (
		<FormFieldWrapper
			field="receipt"
			label="レシート"
			icon="material-symbols:receipt-outline"
			required
			fieldErrors={props.fieldErrors}
			touchedFields={props.touchedFields}
		>
			<ReceiptCamera
				selectedFile={props.receiptFile}
				noImageReason={props.noImageReason}
				onImageCapture={props.onReceiptFileChange}
				onNoImageReasonChange={props.onNoImageReasonChange}
				onRemoveReceipt={props.onRemoveReceipt}
				onClearReceipt={props.onClearReceipt}
			/>
		</FormFieldWrapper>
	);
}
