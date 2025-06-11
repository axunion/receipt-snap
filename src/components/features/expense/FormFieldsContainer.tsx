import {
	AmountField,
	CategoryField,
	DateField,
	NameField,
	NotesField,
	ReceiptField,
} from "@/components/features/expense/FormFields";
import type { FieldErrors, TouchedFields } from "@/hooks/useFormValidation";
import type { Accessor } from "solid-js";

interface FormFieldsContainerProps {
	fieldErrors: Accessor<FieldErrors>;
	touchedFields: Accessor<TouchedFields>;
}

export function FormFieldsContainer(props: FormFieldsContainerProps) {
	return (
		<>
			<ReceiptField
				fieldErrors={props.fieldErrors}
				touchedFields={props.touchedFields}
			/>
			<NameField
				fieldErrors={props.fieldErrors}
				touchedFields={props.touchedFields}
			/>
			<CategoryField
				fieldErrors={props.fieldErrors}
				touchedFields={props.touchedFields}
			/>
			<DateField
				fieldErrors={props.fieldErrors}
				touchedFields={props.touchedFields}
			/>
			<AmountField
				fieldErrors={props.fieldErrors}
				touchedFields={props.touchedFields}
			/>
			<NotesField />
		</>
	);
}
