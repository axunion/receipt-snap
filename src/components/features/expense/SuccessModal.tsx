import { Button } from "@/components/ui";
import { Modal } from "@/components/ui";
import { Icon } from "@iconify-icon/solid";
import { Show } from "solid-js";

interface SuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
	onNewExpense: () => void;
	submittedExpense?: {
		purposeLabel: string;
		details: string;
		amount: number;
	};
}

export function SuccessModal(props: SuccessModalProps) {
	return (
		<Modal
			isOpen={props.isOpen}
			onClose={props.onClose}
			backdropClass="bg-black/50 backdrop-blur-sm p-4"
			contentClass="bg-white rounded-lg px-6 py-8 max-w-sm w-full mx-4 fade-in"
		>
			<div class="text-center">
				<div
					class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce"
					role="presentation"
				>
					<Icon
						icon="material-symbols:check-circle"
						width="32"
						height="32"
						class="text-green-600"
						role="presentation"
					/>
				</div>

				<h2 class="font-semibold mb-3">送信完了しました！</h2>

				<Show when={props.submittedExpense}>
					<div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
						<div class="space-y-3 text-center">
							<div class="text-2xl font-bold text-green-800">
								¥{props.submittedExpense?.amount.toLocaleString()}
							</div>
							<div class="text-lg font-medium text-gray-800">
								{props.submittedExpense?.purposeLabel}
							</div>
							<div class="text-sm text-gray-600 bg-white/70 rounded-lg px-3 py-2">
								{props.submittedExpense?.details}
							</div>
						</div>
					</div>
				</Show>

				<div class="space-y-3">
					<Button onClick={props.onNewExpense} class="w-full" variant="primary">
						新しいレシートを作成
					</Button>
				</div>
			</div>
		</Modal>
	);
}
