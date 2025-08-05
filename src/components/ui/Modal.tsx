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
	// ボディスクロール制御 - アクセサー関数を使用してリアクティビティを保持
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
				>
					<div
						class={props.contentClass || ""}
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => e.stopPropagation()}
						role="dialog"
					>
						{props.children}
					</div>
				</div>
			</Portal>
		</Show>
	);
}
