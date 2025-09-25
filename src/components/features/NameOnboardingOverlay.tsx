import { Button, Input, Overlay } from "@/components/ui";
import { expenseFormStore } from "@/stores";

interface NameOnboardingOverlayProps {
	isVisible: () => boolean;
	onComplete: () => void;
}

export function NameOnboardingOverlay(props: NameOnboardingOverlayProps) {
	const handleSubmit = (event: Event) => {
		event.preventDefault();
		if (expenseFormStore.name().trim()) {
			props.onComplete();
		}
	};

	return (
		<Overlay isVisible={props.isVisible()}>
			<div class="w-full max-w-xs mx-4 px-4 py-8 bg-white rounded-lg shadow-xl">
				<div class="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
					<span class="text-2xl">👤</span>
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
