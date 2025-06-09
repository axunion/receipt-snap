import { apiService } from "@/services/apiService";
import type {
	ExpenseCategory,
	ExpenseRequest,
	ExpenseResponse,
} from "@/types/expense";
import type { SubmitState } from "@/types/ui";
import { formatDateForInput } from "@/utils/dateUtils";
import {
	validateExpenseForm,
	validateNameField,
	validateAmountField,
	validateDateField,
	validateCategoryField,
	validateReceiptField,
} from "@/validators/validation";
import { createSignal, createEffect } from "solid-js";

export interface FieldErrors {
	name?: string;
	amount?: string;
	date?: string;
	category?: string;
	receipt?: string;
}

export type TouchedFields = Partial<Record<keyof FieldErrors, boolean>>;

export function useExpenseForm() {
	const [name, setName] = createSignal("");
	const [amount, setAmount] = createSignal("");
	const [date, setDate] = createSignal(formatDateForInput(new Date()));
	const [category, setCategory] = createSignal<ExpenseCategory>("other");
	const [notes, setNotes] = createSignal("");
	const [receiptImage, setReceiptImage] = createSignal<File | null>(null);
	const [noImageReason, setNoImageReason] = createSignal("");

	const [submitState, setSubmitState] = createSignal<SubmitState>({
		isSubmitting: false,
		result: null,
	});
	const [formErrors, setFormErrors] = createSignal<string[]>([]);
	const [fieldErrors, setFieldErrors] = createSignal<FieldErrors>({});
	const [touchedFields, setTouchedFields] = createSignal<TouchedFields>({});

	const markAsTouched = (fieldName: keyof FieldErrors) => {
		setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
	};

	const resetForm = () => {
		setName("");
		setAmount("");
		setDate(formatDateForInput(new Date()));
		setCategory("other");
		setNotes("");
		setReceiptImage(null);
		setNoImageReason("");
		setSubmitState({ isSubmitting: false, result: null });
		setFormErrors([]);
		setFieldErrors({});
		setTouchedFields({}); // Reset touched state
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
		validateField("name", name(), validateNameField);
		if (name() !== "") markAsTouched("name"); // Mark as touched on change after initial
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
		validateField("category", category(), validateCategoryField);
		if (category() !== "other") markAsTouched("category"); // Default is 'other'
	});

	const validateReceiptCallback = () => {
		validateField(
			"receipt",
			receiptImage(),
			(img, reason) =>
				validateReceiptField(img ?? undefined, reason as string | undefined),
			noImageReason(),
		);
		// Mark as touched if either image or reason changes
		if (receiptImage() !== null || noImageReason() !== "") {
			markAsTouched("receipt");
		}
	};

	createEffect(validateReceiptCallback); // For receiptImage and noImageReason changes

	const submitForm = async () => {
		const currentAmount = Number.parseFloat(amount());
		const validation = validateExpenseForm({
			name: name(),
			amount: Number.isNaN(currentAmount) ? 0 : currentAmount,
			date: date(),
			category: category(),
			receiptImage: receiptImage() || undefined,
			noImageReason: noImageReason() || undefined,
		});

		setFieldErrors(validation.fieldErrors || {});
		setFormErrors(validation.errors);

		// Mark all fields as touched on submit attempt
		const allFields: (keyof FieldErrors)[] = [
			"name",
			"amount",
			"date",
			"category",
			"receipt",
		];
		const touchedUpdates: TouchedFields = {};
		for (const field of allFields) {
			touchedUpdates[field] = true;
		}
		setTouchedFields((prev) => ({ ...prev, ...touchedUpdates }));

		if (!validation.isValid) {
			return;
		}

		setSubmitState({ isSubmitting: true, result: null });

		try {
			const finalImage =
				receiptImage() ||
				new File([""], "no-receipt.txt", { type: "text/plain" });

			const expenseData: ExpenseRequest = {
				name: name(),
				amount: currentAmount,
				date: date(),
				category: category(),
				notes: notes() || undefined,
				receiptImage: finalImage,
			};

			const result = await apiService.submitExpense(expenseData);
			setSubmitState({ isSubmitting: false, result });

			if (result.status === "success") {
				resetForm();
			}
		} catch (error) {
			console.error("Submit error:", error);
			const errorResult: ExpenseResponse = {
				id: "",
				status: "error",
				message: "An error occurred during submission. Please try again.",
				submittedAt: new Date().toISOString(),
			};
			setSubmitState({ isSubmitting: false, result: errorResult });
		}
	};

	return {
		name,
		amount,
		date,
		category,
		notes,
		receiptImage,
		noImageReason,
		submitState,
		formErrors,
		fieldErrors,
		touchedFields,
		setName,
		setAmount,
		setDate,
		setCategory,
		setNotes,
		setReceiptImage,
		setNoImageReason,
		submitForm,
	};
}
