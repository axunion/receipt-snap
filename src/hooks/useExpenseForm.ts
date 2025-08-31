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

	// Consolidated real-time validation
	createEffect(() => {
		const currentDateDefault = formatDateForInput(new Date());
		const validators: Array<{
			field: keyof FieldErrors;
			validate: () => void;
			shouldTouch: () => boolean;
		}> = [
			{
				field: "name",
				validate: () =>
					validateField("name", expenseFormStore.name(), validateNameField),
				shouldTouch: () => expenseFormStore.name() !== "",
			},
			{
				field: "amount",
				validate: () => {
					const numericAmount = Number.parseFloat(expenseFormStore.amount());
					validateField("amount", numericAmount, validateAmountField);
				},
				shouldTouch: () => expenseFormStore.amount() !== "",
			},
			{
				field: "date",
				validate: () =>
					validateField("date", expenseFormStore.date(), validateDateField),
				shouldTouch: () => expenseFormStore.date() !== currentDateDefault,
			},
			{
				field: "details",
				validate: () =>
					validateField(
						"details",
						expenseFormStore.details(),
						validateDetailsField,
					),
				shouldTouch: () => expenseFormStore.details() !== "",
			},
			{
				field: "destination",
				validate: () =>
					validateField(
						"destination",
						expenseFormStore.destination(),
						validateDestinationField,
					),
				shouldTouch: () => expenseFormStore.destination() !== "",
			},
			{
				field: "receipt",
				validate: () =>
					validateField(
						"receipt",
						expenseFormStore.receiptImage(),
						(img, reason) => validateReceiptField(img, reason),
						expenseFormStore.noImageReason(),
					),
				shouldTouch: () =>
					expenseFormStore.receiptImage() !== "" ||
					expenseFormStore.noImageReason() !== "",
			},
		];

		for (const v of validators) {
			v.validate();
			if (v.shouldTouch()) markAsTouched(v.field);
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
