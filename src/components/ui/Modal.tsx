import { type JSX, Show } from "solid-js";
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

	const handleBackdropClick = () => {
		if (props.closeOnBackdropClick !== false && props.onClose) {
			props.onClose();
		}
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape" && props.closeOnEscape !== false && props.onClose) {
			props.onClose();
		}
	};

	return (
		<Show when={props.isOpen}>
			<Portal>
				<div
					class={props.backdropClass || styles.backdrop}
					onClick={handleBackdropClick}
					onKeyDown={handleKeyDown}
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
