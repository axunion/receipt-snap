import { createEffect, createSignal } from "solid-js";
import { getReCaptchaToken, submitExpense } from "@/services";
import { expenseFormStore } from "@/stores";
import type {
	ExpenseSubmitPayload,
	FieldErrors,
	SubmitResponse,
	TouchedFields,
} from "@/types";
import {
	fileToBase64,
	formatDateForInput,
	parseAmount,
	validateField,
	validateForm,
} from "@/utils";

export function useExpenseForm() {
	const [fieldErrors, setFieldErrors] = createSignal<FieldErrors>({});
	const [touchedFields, setTouchedFields] = createSignal<TouchedFields>({});
	const [formErrors, setFormErrors] = createSignal<string[]>([]);

	const markAsTouched = (fieldName: keyof FieldErrors) => {
		setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
	};

	const validateSingleField = (
		fieldName: keyof FieldErrors,
		value: string | number | File | null,
		extraValue?: string,
	) => {
		const error = validateField(fieldName, value, extraValue);
		setFieldErrors((prev) => ({ ...prev, [fieldName]: error }));
		return !error;
	};

	const currentDateDefault = formatDateForInput(new Date());

	createEffect(() => {
		const name = expenseFormStore.name();
		validateSingleField("name", name);
		if (name !== "") markAsTouched("name");
	});

	createEffect(() => {
		const amount = expenseFormStore.amount();
		const numericAmount = Number.parseFloat(amount);
		validateSingleField("amount", numericAmount);
		if (amount !== "") markAsTouched("amount");
	});

	createEffect(() => {
		const date = expenseFormStore.date();
		validateSingleField("date", date);
		if (date !== currentDateDefault) markAsTouched("date");
	});

	createEffect(() => {
		const details = expenseFormStore.details();
		validateSingleField("details", details);
		if (details !== "") markAsTouched("details");
	});

	createEffect(() => {
		const destination = expenseFormStore.destination();
		validateSingleField("destination", destination);
		if (destination !== "") markAsTouched("destination");
	});

	createEffect(() => {
		const receiptFile = expenseFormStore.receiptFile();
		const noImageReason = expenseFormStore.noImageReason();
		validateSingleField("receipt", receiptFile, noImageReason);
		if (receiptFile !== null || noImageReason !== "") markAsTouched("receipt");
	});

	const submitForm = async () => {
		if (expenseFormStore.submitState().isLoading) {
			return undefined;
		}

		const currentAmount = parseAmount(expenseFormStore.amount());
		const validation = validateForm({
			name: expenseFormStore.name(),
			amount: currentAmount,
			date: expenseFormStore.date(),
			details: expenseFormStore.details(),
			destination: expenseFormStore.destination(),
			receiptFile: expenseFormStore.receiptFile(),
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
				console.log("Form validation failed:", validation.errors);
			}
			return undefined;
		}

		expenseFormStore.setSubmitState({ isLoading: true, result: null });

		try {
			const formData = expenseFormStore.getFormData();
			// Convert file to base64 lazily only when submitting
			let base64 = "";
			if (formData.receiptFile) {
				base64 = await fileToBase64(formData.receiptFile);
			}
			const payload: ExpenseSubmitPayload = {
				recaptchaToken: await getReCaptchaToken(),
				name: formData.name,
				amount: String(currentAmount),
				date: formData.date,
				details: formData.details,
				destination: formData.destination,
				notes: formData.notes,
				receiptImage: base64,
				noImageReason: formData.noImageReason,
			};
			const result = await submitExpense(payload);
			expenseFormStore.setSubmitState({ isLoading: false, result });
			return result;
		} catch (error) {
			if (import.meta.env.DEV) {
				console.error("Form submit error:", error);
			}
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
