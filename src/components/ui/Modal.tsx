import { type JSX, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { useBodyScrollLock } from "@/hooks";

interface ModalProps {
	isOpen: boolean;
	onClose?: () => void;
	children: JSX.Element;
	closeOnBackdropClick?: boolean;
	closeOnEscape?: boolean;
	disableBodyScroll?: boolean;
	backdropClass?: string;
	contentClass?: string;
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
					class={`fixed inset-0 flex items-center justify-center z-50 ${
						props.backdropClass || "bg-black/50 backdrop-blur-sm p-4"
					}`}
					onClick={handleBackdropClick}
					onKeyDown={handleKeyDown}
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-title"
					aria-describedby="modal-description"
				>
					<div
						class={
							props.contentClass ||
							"bg-white rounded-lg px-6 py-8 max-w-sm w-full mx-4 fade-in"
						}
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
