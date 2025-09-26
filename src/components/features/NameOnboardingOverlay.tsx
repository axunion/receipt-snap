import { Icon } from "@iconify-icon/solid";
import { createEffect } from "solid-js";
import { Button, Input, Overlay } from "@/components/ui";
import { expenseFormStore } from "@/stores";
import { loadUserName, saveUserName } from "@/utils";

interface NameOnboardingOverlayProps {
	isVisible: () => boolean;
	onComplete: () => void;
}

export function NameOnboardingOverlay(props: NameOnboardingOverlayProps) {
	// Load saved name on component mount
	createEffect(() => {
		if (props.isVisible()) {
			const savedName = loadUserName();

			if (savedName && !expenseFormStore.name().trim()) {
				expenseFormStore.setName(savedName);
			}
		}
	});

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
			<div class="w-full max-w-xs mx-4 px-4 py-8 bg-white rounded-lg shadow-xl">
				<div class="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
					<Icon
						icon="material-symbols:person-rounded"
						width="40"
						height="40"
						class="text-blue-600"
						role="presentation"
					/>
				</div>

				<form onSubmit={handleSubmit} class="space-y-4 text-center">
					<p class="text-gray-600">まずは名前を入力してください</p>

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
