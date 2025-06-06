import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { ReceiptCamera } from "@/components/ReceiptCamera";
import { Select } from "@/components/Select";
import { Textarea } from "@/components/Textarea";
import type {
	ExpenseCategory,
	ExpenseRequest,
	ExpenseResponse,
} from "@/types/expense";
import { EXPENSE_CATEGORIES } from "@/types/expense";
import { formatDateForInput, submitExpense } from "@/utils/api";
import { createSignal } from "solid-js";

export function ExpenseForm() {
	const [name, setName] = createSignal("");
	const [amount, setAmount] = createSignal<number>(0);
	const [date, setDate] = createSignal(formatDateForInput(new Date()));
	const [category, setCategory] = createSignal<ExpenseCategory>("other");
	const [notes, setNotes] = createSignal("");
	const [receiptImage, setReceiptImage] = createSignal<File | null>(null);
	const [isSubmitting, setIsSubmitting] = createSignal(false);
	const [submitResult, setSubmitResult] = createSignal<ExpenseResponse | null>(
		null,
	);

	const handleImageCapture = (file: File) => {
		setReceiptImage(file);
	};

	const resetForm = () => {
		setName("");
		setAmount(0);
		setDate(formatDateForInput(new Date()));
		setCategory("other");
		setNotes("");
		setReceiptImage(null);
	};

	const handleSubmit = async (event: Event) => {
		event.preventDefault();

		const image = receiptImage();
		if (!image) {
			alert("レシート画像を選択してください");
			return;
		}

		setIsSubmitting(true);
		setSubmitResult(null);

		try {
			const expenseData: ExpenseRequest = {
				name: name(),
				amount: amount(),
				date: date(),
				category: category(),
				notes: notes() || undefined,
				receiptImage: image,
			};

			const result = await submitExpense(expenseData);
			setSubmitResult(result);

			if (result.status === "success") {
				resetForm();
			}
		} catch (error) {
			console.error("送信エラー:", error);
			setSubmitResult({
				id: "",
				status: "error",
				message: "送信中にエラーが発生しました。再度お試しください。",
				submittedAt: new Date().toISOString(),
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div class="min-h-screen bg-slate-50">
			<div class="max-w-md md:mx-auto bg-white p-6 border-x border-slate-200 shadow-md">
				<h1 class="mb-6 font-['Bonheur_Royale',cursive] text-3xl text-center text-sky-500">
					Receipt Snap
				</h1>

				<form onSubmit={handleSubmit} class="space-y-6">
					<Label required icon="material-symbols:receipt-outline">
						レシート
					</Label>
					<ReceiptCamera
						onImageCapture={handleImageCapture}
						currentImage={receiptImage() || undefined}
					/>

					<div>
						<Label required icon="material-symbols:person-outline">
							名前
						</Label>
						<Input
							type="text"
							placeholder="名前を入力"
							value={name()}
							onInput={setName}
							required
						/>
					</div>

					<div>
						<Label required icon="material-symbols:format-list-bulleted">
							カテゴリ
						</Label>
						<Select
							options={EXPENSE_CATEGORIES}
							value={category()}
							onSelect={(value) => setCategory(value as ExpenseCategory)}
							placeholder="カテゴリを選択"
							required
						/>
					</div>

					<div>
						<Label required icon="material-symbols:calendar-today-outline">
							支払日
						</Label>
						<Input type="date" value={date()} onInput={setDate} required />
					</div>

					<div>
						<Label required icon="material-symbols:payments-outline">
							金額
						</Label>
						<Input
							type="number"
							placeholder="0"
							value={amount()}
							onInput={(value) => setAmount(Number.parseInt(value) || 0)}
							min="0"
							step="1"
							required
						/>
					</div>

					<div>
						<Label icon="material-symbols:note-outline">備考</Label>
						<Textarea
							placeholder="備考があれば入力してください"
							value={notes()}
							onInput={setNotes}
							rows={4}
						/>
					</div>

					{submitResult() && (
						<div
							class={`p-4 rounded-lg border ${
								submitResult()?.status === "success"
									? "bg-emerald-50 border-emerald-200"
									: "bg-red-50 border-red-200"
							}`}
						>
							<p
								class={`text-sm font-medium ${
									submitResult()?.status === "success"
										? "text-emerald-700"
										: "text-red-700"
								}`}
							>
								{submitResult()?.message}
							</p>
						</div>
					)}

					<Button
						type="submit"
						size="lg"
						disabled={isSubmitting()}
						class="w-full"
					>
						{isSubmitting() ? "送信中..." : "送信"}
					</Button>
				</form>
			</div>
		</div>
	);
}
