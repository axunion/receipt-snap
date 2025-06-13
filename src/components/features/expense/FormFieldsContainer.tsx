import {
	AmountField,
	DateField,
	DetailsField,
	NameField,
	NotesField,
	PurposeField,
	ReceiptField,
} from "@/components/features/expense/FormFields";
import type { FieldErrors, TouchedFields } from "@/types/validation";
import type { Accessor } from "solid-js";

interface FormFieldsContainerProps {
	fieldErrors: Accessor<FieldErrors>;
	touchedFields: Accessor<TouchedFields>;
}

export function FormFieldsContainer(props: FormFieldsContainerProps) {
	return (
		<>
			<PurposeField
				fieldErrors={props.fieldErrors}
				touchedFields={props.touchedFields}
			/>
			<ReceiptField
				fieldErrors={props.fieldErrors}
				touchedFields={props.touchedFields}
			/>
			<DetailsField
				fieldErrors={props.fieldErrors}
				touchedFields={props.touchedFields}
			/>
			<AmountField
				fieldErrors={props.fieldErrors}
				touchedFields={props.touchedFields}
			/>
			<DateField
				fieldErrors={props.fieldErrors}
				touchedFields={props.touchedFields}
			/>
			<NameField
				fieldErrors={props.fieldErrors}
				touchedFields={props.touchedFields}
			/>
			<NotesField />
		</>
	);
}
