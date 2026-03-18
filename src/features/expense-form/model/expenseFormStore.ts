import { createRoot, createSignal } from "solid-js";
import type { ExpenseFormData, SubmitResponse } from "@/types";
import { formatDateForInput, loadUserName } from "@/utils";

const initialState: ExpenseFormData = {
	name: loadUserName(),
	amount: "",
	date: formatDateForInput(new Date()),
	details: "",
	destination: "",
	notes: "",
	receiptFile: null,
	noImageReason: "",
};

function createExpenseFormStore() {
	const [name, setName] = createSignal(initialState.name);
	const [amount, setAmount] = createSignal(initialState.amount);
	const [date, setDate] = createSignal(initialState.date);
	const [details, setDetails] = createSignal(initialState.details);
	const [destination, setDestination] = createSignal(initialState.destination);
	const [notes, setNotes] = createSignal(initialState.notes);
	const [noImageReason, setNoImageReason] = createSignal(
		initialState.noImageReason,
	);
	const [receiptFile, setReceiptFile] = createSignal<File | null>(
		initialState.receiptFile,
	);
	const [submitState, setSubmitState] = createSignal<{
		isLoading: boolean;
		result: SubmitResponse | null;
	}>({ isLoading: false, result: null });
	const [isExternalName, setIsExternalName] = createSignal(false);

	const removeReceipt = () => {
		setReceiptFile(null);
	};

	const clearReceipt = () => {
		setReceiptFile(null);
		setNoImageReason("");
	};

	const resetForm = () => {
		setAmount(initialState.amount);
		setDate(initialState.date);
		setDetails(initialState.details);
		setDestination(initialState.destination);
		setNotes(initialState.notes);
		setNoImageReason(initialState.noImageReason);
		setReceiptFile(initialState.receiptFile);
		setSubmitState({ isLoading: false, result: null });
	};

	const getFormData = (): ExpenseFormData => ({
		name: name(),
		amount: amount(),
		date: date(),
		details: details(),
		destination: destination(),
		notes: notes(),
		receiptFile: receiptFile(),
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
		destination,
		setDestination,
		notes,
		setNotes,
		noImageReason,
		setNoImageReason,
		receiptFile,
		setReceiptFile,
		submitState,
		setSubmitState,
		isExternalName,
		setIsExternalName,
		removeReceipt,
		clearReceipt,
		resetForm,
		getFormData,
	};
}

export const expenseFormStore = createRoot(createExpenseFormStore);
