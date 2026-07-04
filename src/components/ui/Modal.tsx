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
  let contentRef: HTMLDivElement | undefined;

  useBodyScrollLock(
    () => props.isOpen,
    () => props.disableBodyScroll !== false,
  );

  createEffect(() => {
    if (!props.isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    contentRef?.focus();
    onCleanup(() => previouslyFocused?.focus());
  });

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

  const handleBackdropClick = (e: MouseEvent) => {
    if (
      e.target === e.currentTarget &&
      props.closeOnBackdropClick !== false &&
      props.onClose
    ) {
      props.onClose();
    }
  };

  return (
    <Show when={props.isOpen}>
      <Portal>
        {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop click-to-close is a pointer-only affordance; keyboard users close via Escape (window listener above) */}
        <div
          class={props.backdropClass || styles.backdrop}
          onClick={handleBackdropClick}
          role="presentation"
        >
          <div
            ref={contentRef}
            class={props.contentClass || styles.content}
            role="dialog"
            aria-modal="true"
            aria-label={props.ariaLabel}
            tabindex="-1"
          >
            {props.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
}
