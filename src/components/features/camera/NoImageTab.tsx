import { Textarea } from "@/components/ui";
import { expenseFormStore } from "@/stores";

export function NoImageTab() {
	return (
		<div class="h-48">
			<Textarea
				placeholder="レシートがない理由を入力"
				value={expenseFormStore.noImageReason()}
				onInput={expenseFormStore.setNoImageReason}
				rows={6}
				class="h-full"
			/>
		</div>
	);
}
