import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Icon } from "@iconify-icon/solid";
import { Show } from "solid-js";

interface SuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
	onNewExpense: () => void;
	submittedExpense?: {
		name: string;
		amount: number;
		category: string;
	};
}

export function SuccessModal(props: SuccessModalProps) {
	return (
		<Modal
			isOpen={props.isOpen}
			onClose={props.onClose}
			backdropClass="bg-black/50 backdrop-blur-sm p-4"
			contentClass="bg-white rounded-lg p-6 max-w-sm w-full mx-4 fade-in"
		>
			<div class="text-center">
				<div
					class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce"
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

				<h2 class="text-lg font-semibold text-gray-900 mb-2">
					登録完了しました！
				</h2>

				<Show when={props.submittedExpense}>
					<div class="bg-gray-50 rounded-lg p-3 mb-4 text-sm text-left">
						<div class="space-y-1">
							<div class="flex justify-between">
								<span class="text-gray-600">名前：</span>
								<span class="font-medium">{props.submittedExpense?.name}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600">金額：</span>
								<span class="font-medium">
									¥{props.submittedExpense?.amount.toLocaleString()}
								</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600">カテゴリ：</span>
								<span class="font-medium">
									{props.submittedExpense?.category}
								</span>
							</div>
						</div>
					</div>
				</Show>

				<p class="text-gray-600 mb-6">経費申請が正常に送信されました。</p>

				<div class="space-y-3">
					<Button onClick={props.onNewExpense} class="w-full" variant="primary">
						新しい申請を作成
					</Button>
					<Button onClick={props.onClose} class="w-full" variant="secondary">
						閉じる
					</Button>
				</div>
			</div>
		</Modal>
	);
}
