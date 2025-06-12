import { type Accessor, createEffect, onCleanup } from "solid-js";

/**
 * Custom hook to control body scroll.
 * Disables background scroll when a modal or overlay is visible.
 */
export function useBodyScrollLock(
	isActive: Accessor<boolean> | boolean,
	shouldLock: Accessor<boolean> | boolean = true,
) {
	let savedScrollY = 0;

	createEffect(() => {
		const active = typeof isActive === "function" ? isActive() : isActive;
		const lock = typeof shouldLock === "function" ? shouldLock() : shouldLock;

		if (active && lock) {
			// Save current scroll position
			savedScrollY = window.scrollY;

			// Disable body scroll
			document.body.style.position = "fixed";
			document.body.style.top = `-${savedScrollY}px`;
			document.body.style.width = "100%";
			document.body.style.overflow = "hidden";
		} else if (!active && lock) {
			// Cleanup when scroll lock is released
			if (document.body.style.position === "fixed") {
				// Reset body style
				document.body.style.position = "";
				document.body.style.top = "";
				document.body.style.width = "";
				document.body.style.overflow = "";

				// Restore original scroll position
				window.scrollTo(0, savedScrollY);
			}
		}
	});

	onCleanup(() => {
		// Cleanup when component unmounts
		if (document.body.style.position === "fixed") {
			document.body.style.position = "";
			document.body.style.top = "";
			document.body.style.width = "";
			document.body.style.overflow = "";
			window.scrollTo(0, savedScrollY);
		}
	});
}
