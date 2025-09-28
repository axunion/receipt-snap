import { Icon } from "@iconify-icon/solid";
import { Button, Modal } from "@/components/ui";

interface ErrorModalProps {
	isOpen: boolean;
	onClose: () => void;
	error: string;
}

export function ErrorModal(props: ErrorModalProps) {
	return (
		<Modal
			isOpen={props.isOpen}
			onClose={props.onClose}
			backdropClass="bg-black/50 backdrop-blur-sm p-4"
			contentClass="bg-white rounded-lg px-6 py-8 max-w-sm w-full mx-4 fade-in"
		>
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

				<h2 class="font-semibold mb-3 text-red-800">送信エラー</h2>

				<div class="bg-red-50 rounded-lg p-4 mb-4">
					<p class="text-sm text-red-700">{props.error}</p>
				</div>

				<Button onClick={props.onClose} class="w-full" variant="secondary">
					閉じる
				</Button>
			</div>
		</Modal>
	);
}
