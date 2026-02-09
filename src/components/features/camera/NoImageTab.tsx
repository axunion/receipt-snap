import { Textarea } from "@/components/ui";
import { expenseFormStore } from "@/stores";
import styles from "./NoImageTab.module.css";

export function NoImageTab() {
	return (
		<div class={styles.container}>
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
