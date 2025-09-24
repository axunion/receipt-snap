import { type JSX, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { useBodyScrollLock } from "@/hooks";

interface OverlayProps {
	children: JSX.Element;
	isVisible: boolean;
	disableBodyScroll?: boolean;
}

export function Overlay(props: OverlayProps) {
	useBodyScrollLock(
		() => props.isVisible,
		() => props.disableBodyScroll !== false,
	);

	return (
		<Show when={props.isVisible}>
			<Portal>
				<div class="fixed inset-0 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center z-50">
					{props.children}
				</div>
			</Portal>
		</Show>
	);
}
