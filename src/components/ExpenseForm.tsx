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
				<h1 class="mb-6 font-serif font-bold text-2xl text-center text-slate-700">
					Receipt Snap
				</h1>

				<form onSubmit={handleSubmit} class="space-y-6">
					{/* レシート画像 */}
					<ReceiptCamera
						onImageCapture={handleImageCapture}
						currentImage={receiptImage() || undefined}
					/>

					{/* 名前 */}
					<div>
						<Label for="name" required>
							名前
						</Label>
						<Input
							type="text"
							id="name"
							placeholder="名前を入力"
							value={name()}
							onInput={setName}
							required
						/>
					</div>

					{/* カテゴリ */}
					<div>
						<Label for="category" required>
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

					{/* 日付 */}
					<div>
						<Label for="date" required>
							支払日
						</Label>
						<Input
							type="date"
							id="date"
							value={date()}
							onInput={setDate}
							required
						/>
					</div>

					{/* 金額 */}
					<div>
						<Label for="amount" required>
							金額
						</Label>
						<Input
							type="number"
							id="amount"
							placeholder="0"
							value={amount()}
							onInput={(value) => setAmount(Number.parseInt(value) || 0)}
							min="0"
							step="1"
							required
						/>
					</div>

					{/* 備考 */}
					<div>
						<Label for="notes">備考</Label>
						<Textarea
							id="notes"
							placeholder="備考があれば入力してください"
							value={notes()}
							onInput={setNotes}
							rows={4}
						/>
					</div>

					{/* 送信結果 */}
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

					{/* 送信ボタン */}
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
