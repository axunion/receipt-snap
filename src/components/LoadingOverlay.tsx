import { Show } from "solid-js";
import { Portal } from "solid-js/web";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface LoadingOverlayProps {
	isVisible: boolean;
	message?: string;
	size?: "sm" | "md" | "lg";
	disableBodyScroll?: boolean;
}

export function LoadingOverlay(props: LoadingOverlayProps) {
	// ボディスクロール制御 - アクセサー関数を使用してリアクティビティを保持
	useBodyScrollLock(
		() => props.isVisible,
		() => props.disableBodyScroll !== false,
	);

	return (
		<Show when={props.isVisible}>
			<Portal>
				<div class="fixed inset-0 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center z-50">
					<LoadingSpinner size={props.size || "lg"} />
					<Show when={props.message}>
						<p class="mt-4 text-sm text-gray-600 font-medium">
							{props.message}
						</p>
					</Show>
				</div>
			</Portal>
		</Show>
	);
}
