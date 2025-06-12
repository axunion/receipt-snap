import type {
	ExpenseData,
	Purpose,
	SubmitExpenseResult,
} from "@/types/expense";
import { createRoot, createSignal } from "solid-js";

// Initial state for the form
const initialState: ExpenseData = {
	name: "",
	amount: "",
	date: new Date().toISOString().split("T")[0], // Default to today
	details: "", // Changed from category
	purpose: "", // Added purpose
	notes: "",
	receiptImage: null,
};

function createExpenseFormStore() {
	const [name, setName] = createSignal(initialState.name);
	const [amount, setAmount] = createSignal(initialState.amount);
	const [date, setDate] = createSignal(initialState.date);
	const [details, setDetails] = createSignal(initialState.details); // Changed from category
	const [purpose, setPurpose] = createSignal<Purpose>(initialState.purpose); // Added purpose
	const [notes, setNotes] = createSignal(initialState.notes);
	const [noImageReason, setNoImageReason] = createSignal("");
	const [receiptImage, setReceiptImage] = createSignal<File | null>(
		initialState.receiptImage,
	);
	const [submitState, setSubmitState] = createSignal<{
		isLoading: boolean;
		result: SubmitExpenseResult | null;
	}>({ isLoading: false, result: null });

	// Reset form to initial state
	const resetForm = () => {
		setName(initialState.name);
		setAmount(initialState.amount);
		setDate(initialState.date);
		setDetails(initialState.details); // Changed from category
		setPurpose(initialState.purpose); // Added purpose
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
		details, // Changed from category
		setDetails, // Changed from category
		purpose, // Added purpose
		setPurpose, // Added purpose
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
			details: details(), // Changed from category
			purpose: purpose(), // Added purpose
			notes: notes(),
			receiptImage: receiptImage(),
		}),
	};
}

export const expenseFormStore = createRoot(createExpenseFormStore);
