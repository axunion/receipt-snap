import type { SubmitResponse } from "@/types/api";
import type { ExpenseFormData } from "@/types/expense";
import { createRoot, createSignal } from "solid-js";

const initialState: ExpenseFormData = {
	name: "",
	amount: "",
	date: new Date().toISOString().split("T")[0],
	details: "",
	purpose: "",
	notes: "",
	receiptImage: null,
	noImageReason: "",
};

function createExpenseFormStore() {
	const [name, setName] = createSignal(initialState.name);
	const [amount, setAmount] = createSignal(initialState.amount);
	const [date, setDate] = createSignal(initialState.date);
	const [details, setDetails] = createSignal(initialState.details);
	const [purpose, setPurpose] = createSignal(initialState.purpose);
	const [notes, setNotes] = createSignal(initialState.notes || "");
	const [noImageReason, setNoImageReason] = createSignal(
		initialState.noImageReason || "",
	);
	const [receiptImage, setReceiptImage] = createSignal<File | null>(
		initialState.receiptImage || null,
	);
	const [submitState, setSubmitState] = createSignal<{
		isLoading: boolean;
		result: SubmitResponse | null;
	}>({ isLoading: false, result: null });

	const resetForm = () => {
		setName(initialState.name);
		setAmount(initialState.amount);
		setDate(initialState.date);
		setDetails(initialState.details);
		setPurpose(initialState.purpose);
		setNotes(initialState.notes || "");
		setNoImageReason(initialState.noImageReason || "");
		setReceiptImage(initialState.receiptImage || null);
		setSubmitState({ isLoading: false, result: null });
	};

	const getFormData = (): ExpenseFormData => ({
		name: name(),
		amount: amount(),
		date: date(),
		details: details(),
		purpose: purpose(),
		notes: notes(),
		receiptImage: receiptImage(),
		noImageReason: noImageReason(),
	});

	return {
		name,
		setName,
		amount,
		setAmount,
		date,
		setDate,
		details,
		setDetails,
		purpose,
		setPurpose,
		notes,
		setNotes,
		noImageReason,
		setNoImageReason,
		receiptImage,
		setReceiptImage,
		submitState,
		setSubmitState,
		resetForm,
		getFormData,
	};
}

export const expenseFormStore = createRoot(createExpenseFormStore);
