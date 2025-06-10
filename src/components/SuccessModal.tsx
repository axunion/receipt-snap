import { Show, createEffect, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
import { Button } from "@/components/Button";
import { Icon } from "@iconify-icon/solid";

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
	let savedScrollY = 0;

	createEffect(() => {
		if (props.isOpen) {
			// 現在のスクロール位置を保存
			savedScrollY = window.scrollY;

			// bodyのスクロールを無効化
			document.body.style.position = "fixed";
			document.body.style.top = `-${savedScrollY}px`;
			document.body.style.width = "100%";
			document.body.style.overflow = "hidden";
		} else {
			// モーダルが閉じられた時のクリーンアップ
			if (document.body.style.position === "fixed") {
				// bodyのスタイルをリセット
				document.body.style.position = "";
				document.body.style.top = "";
				document.body.style.width = "";
				document.body.style.overflow = "";

				// 元のスクロール位置に戻す
				window.scrollTo(0, savedScrollY);
			}
		}
	});

	onCleanup(() => {
		if (document.body.style.position === "fixed") {
			document.body.style.position = "";
			document.body.style.top = "";
			document.body.style.width = "";
			document.body.style.overflow = "";
			window.scrollTo(0, savedScrollY);
		}
	});

	return (
		<Show when={props.isOpen}>
			<Portal>
				<div
					class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 border-0 w-full h-full"
					onClick={props.onClose}
					onKeyDown={(e) => {
						if (e.key === "Escape") {
							props.onClose();
						}
					}}
					aria-modal="true"
				>
					<div
						class="bg-white rounded-lg p-6 max-w-sm w-full mx-4 fade-in"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => e.stopPropagation()}
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
											<span class="text-gray-600">名前:</span>
											<span class="font-medium">
												{props.submittedExpense?.name}
											</span>
										</div>
										<div class="flex justify-between">
											<span class="text-gray-600">金額:</span>
											<span class="font-medium">
												¥{props.submittedExpense?.amount.toLocaleString()}
											</span>
										</div>
										<div class="flex justify-between">
											<span class="text-gray-600">カテゴリ:</span>
											<span class="font-medium">
												{props.submittedExpense?.category}
											</span>
										</div>
									</div>
								</div>
							</Show>

							<p class="text-gray-600 mb-6">経費申請が正常に送信されました。</p>

							<div class="space-y-3">
								<Button
									onClick={props.onNewExpense}
									class="w-full"
									variant="primary"
								>
									新しい申請を作成
								</Button>
								<Button
									onClick={props.onClose}
									class="w-full"
									variant="secondary"
								>
									閉じる
								</Button>
							</div>
						</div>
					</div>
				</div>
			</Portal>
		</Show>
	);
}
