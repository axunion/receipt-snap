import { Textarea } from "@/components/ui";
import styles from "./NoImageTab.module.css";

interface NoImageTabProps {
	value: string;
	onInput: (value: string) => void;
}

export function NoImageTab(props: NoImageTabProps) {
	return (
		<div class={styles.container}>
			<Textarea
				placeholder="レシートがない理由を入力"
				value={props.value}
				onInput={props.onInput}
				rows={6}
				class="h-full"
			/>
		</div>
	);
}
