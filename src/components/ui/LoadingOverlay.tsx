import { Show } from "solid-js";
import { Portal } from "solid-js/web";
import { LoadingSpinner } from "@/components/ui";
import { useBodyScrollLock } from "@/hooks";

interface LoadingOverlayProps {
	isVisible: boolean;
	size?: "sm" | "md" | "lg";
	disableBodyScroll?: boolean;
}

export function LoadingOverlay(props: LoadingOverlayProps) {
	useBodyScrollLock(
		() => props.isVisible,
		() => props.disableBodyScroll !== false,
	);

	return (
		<Show when={props.isVisible}>
			<Portal>
				<div class="fixed inset-0 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center z-50">
					<LoadingSpinner size={props.size || "lg"} />
				</div>
			</Portal>
		</Show>
	);
}
