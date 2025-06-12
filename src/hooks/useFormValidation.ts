import type { Purpose } from "@/types/expense";
import { formatDateForInput } from "@/utils/dateUtils";
import {
	validateAmountField,
	validateDateField,
	validateDetailsField,
	validateExpenseForm,
	validateNameField,
	validatePurposeField,
	validateReceiptField,
} from "@/validators/validation";
import { createEffect, createSignal } from "solid-js";

export interface FieldErrors {
	name?: string;
	amount?: string;
	date?: string;
	details?: string;
	purpose?: string;
	receipt?: string;
}

export type TouchedFields = Partial<Record<keyof FieldErrors, boolean>>;

export function useFormValidation() {
	const [fieldErrors, setFieldErrors] = createSignal<FieldErrors>({});
	const [touchedFields, setTouchedFields] = createSignal<TouchedFields>({});
	const [formErrors, setFormErrors] = createSignal<string[]>([]);

	const markAsTouched = (fieldName: keyof FieldErrors) => {
		setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
	};

	const validateField = <T, R = undefined>(
		fieldName: keyof FieldErrors,
		value: T,
		validator: (val: T, relatedVal?: R) => string | undefined,
		relatedValue?: R,
	) => {
		const error = validator(value, relatedValue);
		setFieldErrors((prev) => ({ ...prev, [fieldName]: error }));
		return !error;
	};

	const setupRealtimeValidation = (
		name: () => string,
		amount: () => string,
		date: () => string,
		details: () => string,
		purpose: () => Purpose,
		receiptImage: () => File | null,
		noImageReason: () => string,
	) => {
		// Real-time validation effects
		createEffect(() => {
			validateField("name", name(), validateNameField);
			if (name() !== "") markAsTouched("name");
		});

		createEffect(() => {
			const numericAmount = Number.parseFloat(amount());
			validateField("amount", numericAmount, validateAmountField);
			if (amount() !== "") markAsTouched("amount");
		});

		createEffect(() => {
			validateField("date", date(), validateDateField);
			if (date() !== formatDateForInput(new Date())) markAsTouched("date");
		});

		createEffect(() => {
			validateField("details", details(), validateDetailsField);
			if (details() !== "") markAsTouched("details");
		});

		createEffect(() => {
			validateField("purpose", purpose(), validatePurposeField);
			if (purpose() !== "") markAsTouched("purpose");
		});

		const validateReceiptCallback = () => {
			validateField(
				"receipt",
				receiptImage(),
				(img, reason) =>
					validateReceiptField(img ?? undefined, reason as string | undefined),
				noImageReason(),
			);
			if (receiptImage() !== null || noImageReason() !== "") {
				markAsTouched("receipt");
			}
		};

		createEffect(validateReceiptCallback);
	};

	const validateFullForm = (formData: {
		name: string;
		amount: number;
		date: string;
		details: string;
		purpose: Purpose;
		receiptImage?: File;
		noImageReason?: string;
	}) => {
		const validation = validateExpenseForm(formData);
		setFieldErrors(validation.fieldErrors || {});
		setFormErrors(validation.errors);

		// Mark all fields as touched on submit attempt
		const allFields: (keyof FieldErrors)[] = [
			"name",
			"amount",
			"date",
			"details",
			"purpose",
			"receipt",
		];
		const touched: TouchedFields = {};
		for (const field of allFields) {
			touched[field] = true;
		}
		setTouchedFields(touched);

		return validation.isValid;
	};

	const resetValidation = () => {
		setFieldErrors({});
		setTouchedFields({});
		setFormErrors([]);
	};

	return {
		fieldErrors,
		touchedFields,
		formErrors,
		markAsTouched,
		validateField,
		setupRealtimeValidation,
		validateFullForm,
		resetValidation,
	};
}
