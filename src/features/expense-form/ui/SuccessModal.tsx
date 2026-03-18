import { Icon } from "@iconify-icon/solid";
import { Show } from "solid-js";
import { Button, Modal } from "@/components/ui";
import type { SubmittedData } from "../model";
import styles from "./SuccessModal.module.css";

interface SuccessModalProps {
	isOpen: boolean;
	onNewExpense?: () => void;
	submittedExpense?: SubmittedData;
	title?: string;
	buttonText?: string;
}

export function SuccessModal(props: SuccessModalProps) {
	return (
		<Modal isOpen={props.isOpen} ariaLabel={props.title || "完了しました"}>
			<div class={styles.wrapper}>
				<div class={styles.iconWrapper} role="presentation">
					<Icon
						icon="material-symbols:check-circle"
						width="32"
						height="32"
						class={styles.icon}
						role="presentation"
					/>
				</div>

				<h2 class={styles.title}>{props.title || "完了しました"}</h2>

				<Show when={props.submittedExpense}>
					<div class={styles.summaryCard}>
						<div class={styles.summaryContent}>
							<div class={styles.amount}>
								¥ {props.submittedExpense?.amount.toLocaleString()}
							</div>
							<div class={styles.details}>
								<div class={styles.destination}>
									{props.submittedExpense?.destinationLabel}
								</div>
								<div>{props.submittedExpense?.details}</div>
							</div>
						</div>
					</div>
				</Show>

				<Button onClick={props.onNewExpense} class="w-full" variant="primary">
					{props.buttonText || "OK"}
				</Button>
			</div>
		</Modal>
	);
}
