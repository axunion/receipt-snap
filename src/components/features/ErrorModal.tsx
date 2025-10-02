import { Icon } from "@iconify-icon/solid";
import { Button, Modal } from "@/components/ui";

interface ErrorModalProps {
	isOpen: boolean;
	onClose: () => void;
	error: string;
	title?: string;
	buttonText?: string;
}

export function ErrorModal(props: ErrorModalProps) {
	return (
		<Modal isOpen={props.isOpen}>
			<div class="text-center">
				<div
					class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce"
					role="presentation"
				>
					<Icon
						icon="material-symbols:error"
						width="32"
						height="32"
						class="text-red-600"
						role="presentation"
					/>
				</div>

				<h2 class="font-semibold mb-3 text-red-800">
					{props.title || "送信エラー"}
				</h2>

				<div class="bg-red-50 rounded-lg p-4 mb-4">
					<p class="text-sm text-red-700">{props.error}</p>
				</div>

				<Button onClick={props.onClose} class="w-full" variant="secondary">
					{props.buttonText || "閉じる"}
				</Button>
			</div>
		</Modal>
	);
}
