import { type JSX, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { useBodyScrollLock } from "@/hooks";
import styles from "./Overlay.module.css";

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
				<div class={styles.overlay}>{props.children}</div>
			</Portal>
		</Show>
	);
}
