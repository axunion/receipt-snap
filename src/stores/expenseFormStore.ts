import type { ExpenseCategory } from "@/types/expense";
import type { SubmitState } from "@/types/ui";
import { getTodayDateString } from "@/utils/dateUtils";
import { createSignal } from "solid-js";

// State signals
const [name, setName] = createSignal("");
const [amount, setAmount] = createSignal("");
const [date, setDate] = createSignal(getTodayDateString());
const [category, setCategory] = createSignal<ExpenseCategory>("other");
const [notes, setNotes] = createSignal("");
const [receiptImage, setReceiptImage] = createSignal<File | null>(null);
const [noImageReason, setNoImageReason] = createSignal("");
const [submitState, setSubmitState] = createSignal<SubmitState>({
	isSubmitting: false,
	result: null,
});

// Actions
const resetForm = () => {
	setName("");
	setAmount("");
	setDate(getTodayDateString());
	setCategory("other");
	setNotes("");
	setReceiptImage(null);
	setNoImageReason("");
	setSubmitState({ isSubmitting: false, result: null });
};

// Store export - SolidJS style with direct signal exposure
export const expenseFormStore = {
	// Direct signal access (SolidJS best practice)
	name,
	amount,
	date,
	category,
	notes,
	receiptImage,
	noImageReason,
	submitState,

	// Setters
	setName,
	setAmount,
	setDate,
	setCategory,
	setNotes,
	setReceiptImage,
	setNoImageReason,
	setSubmitState,

	// Actions
	resetForm,

	// Computed values (using functions for clarity)
	isFormEmpty: () =>
		!name() && !amount() && !notes() && !receiptImage() && !noImageReason(),
	hasRequiredFields: () => !!(name() && amount() && date() && category()),
};
