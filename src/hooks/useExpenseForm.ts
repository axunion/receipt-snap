import { apiService } from "@/services/apiService";
import type {
	ExpenseCategory,
	ExpenseRequest,
	ExpenseResponse,
} from "@/types/expense";
import type { SubmitState } from "@/types/ui";
import { formatDateForInput } from "@/utils/dateUtils";
import { validateExpenseForm } from "@/validators/validation";
import { createEffect, createSignal } from "solid-js";

export function useExpenseForm() {
	const [name, setName] = createSignal("");
	const [amount, setAmount] = createSignal<number>(0);
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

	const resetForm = () => {
		setName("");
		setAmount(0);
		setDate(formatDateForInput(new Date()));
		setCategory("other");
		setNotes("");
		setReceiptImage(null);
		setNoImageReason("");
		setSubmitState({ isSubmitting: false, result: null });
		setFormErrors([]);
	};

	const submitForm = async () => {
		const image = receiptImage();
		const reason = noImageReason();

		const validation = validateExpenseForm({
			name: name(),
			amount: amount(),
			date: date(),
			category: category(),
			receiptImage: image || undefined,
			noImageReason: reason || undefined,
		});

		if (!validation.isValid) {
			setFormErrors(validation.errors);
			return;
		}

		if (!image && !reason.trim()) {
			setFormErrors(["レシート画像またはない理由のどちらかを入力してください"]);
			return;
		}

		setFormErrors([]);
		setSubmitState({ isSubmitting: true, result: null });

		try {
			const finalImage =
				image || new File([""], "no-receipt.txt", { type: "text/plain" });

			const expenseData: ExpenseRequest = {
				name: name(),
				amount: amount(),
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
			console.error("送信エラー:", error);
			const errorResult: ExpenseResponse = {
				id: "",
				status: "error",
				message: "送信中にエラーが発生しました。再度お試しください。",
				submittedAt: new Date().toISOString(),
			};
			setSubmitState({ isSubmitting: false, result: errorResult });
		}
	};

	createEffect(() => {
		const validation = validateExpenseForm({
			name: name(),
			amount: amount(),
			date: date(),
			category: category(),
			receiptImage: receiptImage() || undefined,
			noImageReason: noImageReason() || undefined,
		});

		if (
			!validation.isValid &&
			(name() || amount() || receiptImage() || noImageReason())
		) {
			setFormErrors(validation.errors);
		} else {
			setFormErrors([]);
		}
	});

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
		setName,
		setAmount,
		setDate,
		setCategory,
		setNotes,
		setReceiptImage,
		setNoImageReason,
		resetForm,
		submitForm,
	};
}
