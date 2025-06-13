import type { SubmitResponse } from "@/types/api";
import type { ExpenseData, Purpose } from "@/types/expense";
import { createRoot, createSignal } from "solid-js";

const initialState: ExpenseData = {
	name: "",
	amount: "",
	date: new Date().toISOString().split("T")[0],
	details: "",
	purpose: "",
	notes: "",
	receiptImage: null,
};

function createExpenseFormStore() {
	const [name, setName] = createSignal(initialState.name);
	const [amount, setAmount] = createSignal(initialState.amount);
	const [date, setDate] = createSignal(initialState.date);
	const [details, setDetails] = createSignal(initialState.details);
	const [purpose, setPurpose] = createSignal<Purpose>(initialState.purpose);
	const [notes, setNotes] = createSignal(initialState.notes);
	const [noImageReason, setNoImageReason] = createSignal("");
	const [receiptImage, setReceiptImage] = createSignal<File | null>(
		initialState.receiptImage,
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
		setNotes(initialState.notes);
		setNoImageReason("");
		setReceiptImage(initialState.receiptImage);
		setSubmitState({ isLoading: false, result: null });
	};

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
		getFormData: () => ({
			name: name(),
			amount: amount(),
			date: date(),
			details: details(),
			purpose: purpose(),
			notes: notes(),
			receiptImage: receiptImage(),
		}),
	};
}

export const expenseFormStore = createRoot(createExpenseFormStore);
