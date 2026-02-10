import { createEffect, type JSX, onCleanup, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { useBodyScrollLock } from "@/hooks";
import styles from "./Modal.module.css";

interface ModalProps {
	isOpen: boolean;
	onClose?: () => void;
	children: JSX.Element;
	closeOnBackdropClick?: boolean;
	closeOnEscape?: boolean;
	disableBodyScroll?: boolean;
	backdropClass?: string;
	contentClass?: string;
	ariaLabel?: string;
}

export function Modal(props: ModalProps) {
	useBodyScrollLock(
		() => props.isOpen,
		() => props.disableBodyScroll !== false,
	);

	createEffect(() => {
		if (!props.isOpen || props.closeOnEscape === false || !props.onClose) {
			return;
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				props.onClose?.();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		onCleanup(() => window.removeEventListener("keydown", handleKeyDown));
	});

	const handleBackdropClick = () => {
		if (props.closeOnBackdropClick !== false && props.onClose) {
			props.onClose();
		}
	};

	return (
		<Show when={props.isOpen}>
			<Portal>
				<div
					class={props.backdropClass || styles.backdrop}
					onClick={handleBackdropClick}
					onKeyDown={handleBackdropClick}
					role="dialog"
					aria-modal="true"
					aria-label={props.ariaLabel}
				>
					<div
						class={props.contentClass || styles.content}
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => e.stopPropagation()}
						role="document"
					>
						{props.children}
					</div>
				</div>
			</Portal>
		</Show>
	);
}
