import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { Select } from "@/components/Select";
import { Textarea } from "@/components/Textarea";
import { ReceiptCamera } from "@/components/receipt-camera/ReceiptCamera";
import { useExpenseForm } from "@/hooks/useExpenseForm";
import { MainLayout } from "@/layouts/MainLayout";
import { EXPENSE_CATEGORIES } from "@/types/expense";
import type { ExpenseCategory } from "@/types/expense";
import { For } from "solid-js";

export function ExpenseForm() {
	const {
		name,
		amount,
		date,
		category,
		notes,
		receiptImage,
		submitState,
		formErrors,
		setName,
		setAmount,
		setDate,
		setCategory,
		setNotes,
		setReceiptImage,
		setNoImageReason,
		submitForm,
	} = useExpenseForm();

	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		await submitForm();
	};

	return (
		<MainLayout title="Receipt Snap">
			<form onSubmit={handleSubmit} class="space-y-6">
				<div>
					<Label required icon="material-symbols:receipt-outline">
						レシート
					</Label>
					<ReceiptCamera
						onImageCapture={setReceiptImage}
						onNoImageReason={setNoImageReason}
						currentImage={receiptImage() || undefined}
					/>
				</div>

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

				{formErrors().length > 0 && (
					<div class="p-4 bg-red-50 border border-red-200 rounded-lg">
						<p class="text-sm font-medium text-red-800 mb-2">入力エラー:</p>
						<ul class="text-sm text-red-700 list-disc list-inside space-y-1">
							<For each={formErrors()}>{(error) => <li>{error}</li>}</For>
						</ul>
					</div>
				)}

				{submitState().result && (
					<div
						class={`p-4 rounded-lg border ${
							submitState().result?.status === "success"
								? "bg-emerald-50 border-emerald-200"
								: "bg-red-50 border-red-200"
						}`}
					>
						<p
							class={`text-sm font-medium ${
								submitState().result?.status === "success"
									? "text-emerald-700"
									: "text-red-700"
							}`}
						>
							{submitState().result?.message}
						</p>
					</div>
				)}

				<Button
					type="submit"
					size="lg"
					disabled={submitState().isSubmitting}
					class="w-full"
				>
					{submitState().isSubmitting ? "送信中..." : "送信"}
				</Button>
			</form>
		</MainLayout>
	);
}
