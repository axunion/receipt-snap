import { Icon } from "@iconify-icon/solid";
import { Button, Modal } from "@/components/ui";
import styles from "./ErrorModal.module.css";

interface ErrorModalProps {
	isOpen: boolean;
	onClose: () => void;
	error: string;
	title?: string;
	buttonText?: string;
}

export function ErrorModal(props: ErrorModalProps) {
	return (
		<Modal
			isOpen={props.isOpen}
			ariaLabel={props.title || "エラーが発生しました"}
		>
			<div class={styles.wrapper}>
				<div class={styles.iconWrapper} role="presentation">
					<Icon
						icon="material-symbols:error"
						width="32"
						height="32"
						class={styles.icon}
						role="presentation"
					/>
				</div>

				<h2 class={styles.title}>{props.title || "エラーが発生しました"}</h2>

				<div class={styles.errorBox}>
					<p class={styles.errorText}>{props.error}</p>
				</div>

				<Button onClick={props.onClose} class="w-full" variant="secondary">
					{props.buttonText || "Close"}
				</Button>
			</div>
		</Modal>
	);
}
