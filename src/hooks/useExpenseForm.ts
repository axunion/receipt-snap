import { createEffect, createSignal } from "solid-js";
import { submitExpense } from "@/services/apiService";
import { expenseFormStore } from "@/stores";
import type { FieldErrors, SubmitResponse, TouchedFields } from "@/types";
import {
	formatDateForInput,
	parseAmount,
	validateAmountField,
	validateDateField,
	validateDestinationField,
	validateDetailsField,
	validateExpenseForm,
	validateNameField,
	validateReceiptField,
} from "@/utils";

export function useExpenseForm() {
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

	// Real-time validation effects
	createEffect(() => {
		validateField("name", expenseFormStore.name(), validateNameField);
		if (expenseFormStore.name() !== "") markAsTouched("name");
	});

	createEffect(() => {
		const numericAmount = Number.parseFloat(expenseFormStore.amount());
		validateField("amount", numericAmount, validateAmountField);
		if (expenseFormStore.amount() !== "") markAsTouched("amount");
	});

	createEffect(() => {
		validateField("date", expenseFormStore.date(), validateDateField);
		if (expenseFormStore.date() !== formatDateForInput(new Date())) {
			markAsTouched("date");
		}
	});

	createEffect(() => {
		validateField("details", expenseFormStore.details(), validateDetailsField);
		if (expenseFormStore.details() !== "") markAsTouched("details");
	});

	createEffect(() => {
		validateField(
			"destination",
			expenseFormStore.destination(),
			validateDestinationField,
		);
		if (expenseFormStore.destination() !== "") markAsTouched("destination");
	});

	createEffect(() => {
		validateField(
			"receipt",
			expenseFormStore.receiptImage(),
			(img, reason) => validateReceiptField(img, reason),
			expenseFormStore.noImageReason(),
		);
		if (
			expenseFormStore.receiptImage() !== "" ||
			expenseFormStore.noImageReason() !== ""
		) {
			markAsTouched("receipt");
		}
	});

	const submitForm = async () => {
		const currentAmount = parseAmount(expenseFormStore.amount());
		const validation = validateExpenseForm({
			name: expenseFormStore.name(),
			amount: currentAmount,
			date: expenseFormStore.date(),
			details: expenseFormStore.details(),
			destination: expenseFormStore.destination(),
			receiptImage: expenseFormStore.receiptImage(),
			noImageReason: expenseFormStore.noImageReason(),
		});

		setFieldErrors(validation.fieldErrors || {});
		setFormErrors(validation.errors);

		const allFields: (keyof FieldErrors)[] = [
			"name",
			"amount",
			"date",
			"details",
			"destination",
			"receipt",
		];
		const touched: TouchedFields = {};
		for (const field of allFields) {
			touched[field] = true;
		}
		setTouchedFields(touched);

		if (!validation.isValid) {
			if (import.meta.env.DEV) {
				console.log("Validation failed:", validation.errors);
			}
			return undefined;
		}

		expenseFormStore.setSubmitState({ isLoading: true, result: null });

		try {
			const formData = expenseFormStore.getFormData();
			const result = await submitExpense(formData);
			expenseFormStore.setSubmitState({ isLoading: false, result });
			return result;
		} catch (error) {
			console.error("Submit error:", error);
			const errorResult: SubmitResponse = {
				result: "error",
				error: "An error occurred during submission. Please try again",
			};
			expenseFormStore.setSubmitState({
				isLoading: false,
				result: errorResult,
			});
			return errorResult;
		}
	};

	const resetForm = () => {
		expenseFormStore.resetForm();
		setFieldErrors({});
		setTouchedFields({});
		setFormErrors([]);
	};

	return {
		formErrors,
		fieldErrors,
		touchedFields,
		submitForm,
		resetForm,
	};
}
