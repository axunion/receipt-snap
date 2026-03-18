import { onCleanup } from "solid-js";
import { saveUserName } from "@/utils";
import { expenseFormStore } from "./expenseFormStore";

export function useParentMessage() {
	// Skip if not running inside an iframe
	if (window === window.parent) return;

	const handler = (event: MessageEvent) => {
		// Only accept messages from the same origin
		if (event.origin !== window.location.origin) return;

		if (
			event.data?.type === "receipt-snap:set-name" &&
			typeof event.data.name === "string"
		) {
			const name = event.data.name;
			expenseFormStore.setName(name);
			saveUserName(name);
			expenseFormStore.setIsExternalName(true);
		}
	};

	window.addEventListener("message", handler);
	window.parent.postMessage(
		{ type: "receipt-snap:ready" },
		window.location.origin,
	);

	onCleanup(() => {
		window.removeEventListener("message", handler);
	});
}
