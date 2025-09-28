import { Icon } from "@iconify-icon/solid";
import { Show } from "solid-js";
import { Button, Modal } from "@/components/ui";
import type { SubmittedExpenseData } from "@/hooks";

interface SuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
	onNewExpense: () => void;
	submittedExpense?: SubmittedExpenseData;
}

export function SuccessModal(props: SuccessModalProps) {
	return (
		<Modal
			isOpen={props.isOpen}
			onClose={props.onClose}
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
					<div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
						<div class="space-y-2 text-center">
							<div class="text-lg font-bold text-green-800">
								¥ {props.submittedExpense?.amount.toLocaleString()}
							</div>
							<div class="font-medium">
								{props.submittedExpense?.destinationLabel}
							</div>
							<div class="text-sm bg-white/80 rounded-lg px-3 py-4">
								{props.submittedExpense?.details}
							</div>
						</div>
					</div>
				</Show>

				<Button onClick={props.onNewExpense} class="w-full" variant="primary">
					新しいレシートを作成
				</Button>
			</div>
		</Modal>
	);
}
