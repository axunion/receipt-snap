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
import { For, Show } from "solid-js";

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
		fieldErrors,
		touchedFields, // Added from hook
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
			<form onSubmit={handleSubmit} class="space-y-6 relative">
				{" "}
				{/* Added relative class */}
				<div>
					<Label required icon="material-symbols:receipt-outline">
						レシート
					</Label>
					<ReceiptCamera
						onImageCapture={setReceiptImage}
						onNoImageReason={setNoImageReason}
						currentImage={receiptImage() || undefined}
						// Add onBlur if ReceiptCamera should also trigger touched state for "receipt"
						// onBlur={() => markAsTouched("receipt")}
					/>
					<Show when={fieldErrors().receipt && touchedFields().receipt}>
						<p id="receipt-error" class="text-sm text-red-600 mt-1">
							{fieldErrors().receipt}
						</p>
					</Show>
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
						aria-invalid={!!(fieldErrors().name && touchedFields().name)}
						aria-describedby={
							fieldErrors().name && touchedFields().name
								? "name-error"
								: undefined
						}
					/>
					<Show when={fieldErrors().name && touchedFields().name}>
						<p id="name-error" class="text-sm text-red-600 mt-1">
							{fieldErrors().name}
						</p>
					</Show>
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
						// onBlur for Select might need custom handling if it doesn't support it directly
						// For now, category is marked touched on change in hook or submit
						aria-invalid={
							!!(fieldErrors().category && touchedFields().category)
						}
						aria-describedby={
							fieldErrors().category && touchedFields().category
								? "category-error"
								: undefined
						}
					/>
					<Show when={fieldErrors().category && touchedFields().category}>
						<p id="category-error" class="text-sm text-red-600 mt-1">
							{fieldErrors().category}
						</p>
					</Show>
				</div>
				<div>
					<Label required icon="material-symbols:calendar-today-outline">
						支払日
					</Label>
					<Input
						type="date"
						value={date()}
						onInput={setDate}
						required
						aria-invalid={!!(fieldErrors().date && touchedFields().date)}
						aria-describedby={
							fieldErrors().date && touchedFields().date
								? "date-error"
								: undefined
						}
					/>
					<Show when={fieldErrors().date && touchedFields().date}>
						<p id="date-error" class="text-sm text-red-600 mt-1">
							{fieldErrors().date}
						</p>
					</Show>
				</div>
				<div>
					<Label required icon="material-symbols:payments-outline">
						金額
					</Label>
					<Input
						type="number"
						placeholder="0"
						value={amount()} // Kept as string from hook for input binding
						onInput={setAmount}
						min="0"
						step="1"
						required
						aria-invalid={!!(fieldErrors().amount && touchedFields().amount)}
						aria-describedby={
							fieldErrors().amount && touchedFields().amount
								? "amount-error"
								: undefined
						}
					/>
					<Show when={fieldErrors().amount && touchedFields().amount}>
						<p id="amount-error" class="text-sm text-red-600 mt-1">
							{fieldErrors().amount}
						</p>
					</Show>
				</div>
				<div>
					<Label icon="material-symbols:note-outline">備考</Label>
					<Textarea
						placeholder="備考があれば入力してください"
						value={notes()}
						onInput={setNotes} // Assuming Textarea's onInput provides string value directly
						// No validation for notes, so no onBlur needed for touched status for errors
						rows={4}
					/>
				</div>
				{/* Show overall form errors only if there are errors AND they are not field-specific 
					 AND at least one field has been touched or submit was attempted */}
				<Show
					when={
						formErrors().length > 0 &&
						Object.values(touchedFields()).some(Boolean) && // Check if any field is touched
						formErrors().some(
							(fe) => !Object.values(fieldErrors()).includes(fe as string),
						)
					}
				>
					<div class="p-4 bg-red-50 border border-red-200 rounded-lg">
						<p class="text-sm font-medium text-red-800 mb-2">入力エラー:</p>
						<ul class="text-sm text-red-700 list-disc list-inside space-y-1">
							{/* Filter formErrors to show only those not in fieldErrors */}
							<For
								each={formErrors().filter(
									(fe) => !Object.values(fieldErrors()).includes(fe as string),
								)}
							>
								{(error) => <li>{error}</li>}
							</For>
						</ul>
					</div>
				</Show>
				{submitState().result && (
					<div
						class={`p-4 rounded-lg border ${
							submitState().result?.status === "success"
								? "bg-green-50 border-green-200"
								: "bg-red-50 border-red-200"
						}`}
					>
						<p
							class={`text-sm font-medium ${
								submitState().result?.status === "success"
									? "text-green-800"
									: "text-red-800"
							}`}
						>
							{submitState().result?.message}
						</p>
					</div>
				)}
				<Button
					type="submit"
					disabled={submitState().isSubmitting}
					class="w-full"
					variant={submitState().isSubmitting ? "secondary" : "primary"} // Changed "default" to "primary"
				>
					{submitState().isSubmitting ? "送信中..." : "登録する"}
				</Button>
				{/* Submission Loading Overlay */}
				<Show when={submitState().isSubmitting}>
					<div class="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-50 rounded-lg">
						<svg
							class="animate-spin h-8 w-8 text-blue-600"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<title>Loading</title> {/* Added title for accessibility */}
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							/>{" "}
							{/* Self-closing */}
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>{" "}
							{/* Self-closing */}
						</svg>
						<p class="text-lg font-semibold mt-3">送信中...</p>
					</div>
				</Show>
			</form>
		</MainLayout>
	);
}
