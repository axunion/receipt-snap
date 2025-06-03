import { createSignal } from "solid-js";
import type {
	ExpenseCategory,
	ExpenseRequest,
	ExpenseResponse,
} from "../types/expense";
import { EXPENSE_CATEGORIES } from "../types/expense";
import { Button } from "./Button";
import { Card, CardContent, CardHeader } from "./Card";
import { Input } from "./Input";
import { Label } from "./Label";
import { ReceiptCamera } from "./ReceiptCamera";
import { Select } from "./Select";
import { Textarea } from "./Textarea";

export function ExpenseForm() {
	const [name, setName] = createSignal("");
	const [amount, setAmount] = createSignal<number>(0);
	const [date, setDate] = createSignal(new Date().toISOString().split("T")[0]);
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

	const handleSubmit = async (event: Event) => {
		event.preventDefault();

		if (!receiptImage()) {
			alert("レシート画像を選択してください");
			return;
		}

		const image = receiptImage();
		if (!image) return;

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

			// FormDataを作成してAPIに送信
			const formData = new FormData();
			formData.append("name", expenseData.name);
			formData.append("amount", expenseData.amount.toString());
			formData.append("date", expenseData.date);
			formData.append("category", expenseData.category);
			if (expenseData.notes) {
				formData.append("notes", expenseData.notes);
			}
			formData.append("receiptImage", expenseData.receiptImage);

			// TODO: 実際のAPI呼び出し
			// const response = await fetch('/api/expenses', {
			//   method: 'POST',
			//   body: formData,
			// });
			// const result: ExpenseResponse = await response.json();

			// モックレスポンス
			await new Promise((resolve) => setTimeout(resolve, 1500));
			const result: ExpenseResponse = {
				id: `exp_${Date.now()}`,
				status: "success",
				message: "経費申請が正常に送信されました",
				submittedAt: new Date().toISOString(),
			};

			setSubmitResult(result);

			if (result.status === "success") {
				// フォームをリセット
				setName("");
				setAmount(0);
				setDate(new Date().toISOString().split("T")[0]);
				setCategory("other");
				setNotes("");
				setReceiptImage(null);
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
		<div class="min-h-screen bg-slate-50 md:py-6 md:px-4">
			<div class="max-w-md md:mx-auto">
				<Card>
					<CardHeader>
						<h1 class="text-xl font-bold text-slate-800">経費申請</h1>
						<p class="text-sm text-slate-600 mt-1">
							レシートを撮影して経費を申請してください
						</p>
					</CardHeader>

					<CardContent>
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
									placeholder="申請者名を入力"
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
									日付
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
									rows={3}
								/>
							</div>

							{/* 送信結果 */}
							{submitResult() && (
								<div
									class={`p-4 rounded-lg ${
										submitResult()?.status === "success"
											? "bg-emerald-50 border border-emerald-200"
											: "bg-red-50 border border-red-200"
									}`}
								>
									<p
										class={`text-sm ${
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
							<Button type="submit" disabled={isSubmitting()} class="w-full">
								{isSubmitting() ? "送信中..." : "申請を送信"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
