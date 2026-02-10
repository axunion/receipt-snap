import { Icon } from "@iconify-icon/solid";
import { Button, Input, Overlay } from "@/components/ui";
import { expenseFormStore } from "@/stores";
import { saveUserName } from "@/utils";
import styles from "./NameOnboardingOverlay.module.css";

interface NameOnboardingOverlayProps {
	isVisible: () => boolean;
	onComplete: () => void;
}

export function NameOnboardingOverlay(props: NameOnboardingOverlayProps) {
	const handleSubmit = (event: Event) => {
		event.preventDefault();
		const name = expenseFormStore.name().trim();

		if (name) {
			saveUserName(name);
			props.onComplete();
		}
	};

	return (
		<Overlay isVisible={props.isVisible()}>
			<div class={styles.card}>
				<div class={styles.iconWrapper}>
					<Icon
						icon="material-symbols:person-rounded"
						width="40"
						height="40"
						class={styles.icon}
						role="presentation"
					/>
				</div>

				<form onSubmit={handleSubmit} class={styles.form}>
					<p class={styles.prompt}>まずは名前を入力してください</p>

					<div>
						<Input
							type="text"
							value={expenseFormStore.name()}
							onInput={expenseFormStore.setName}
							required
							maxLength={24}
							class="text-center"
						/>
					</div>

					<Button
						type="submit"
						disabled={!expenseFormStore.name().trim()}
						class="w-full"
						size="lg"
					>
						始める
					</Button>
				</form>
			</div>
		</Overlay>
	);
}
