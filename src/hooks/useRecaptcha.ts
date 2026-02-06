import { onCleanup, onMount } from "solid-js";
import { CONFIG } from "@/constants/config";

export function useRecaptcha() {
	let scriptElement: HTMLScriptElement | undefined;

	onMount(() => {
		if (
			CONFIG.RECAPTCHA.SITE_KEY &&
			!document.querySelector('script[src*="recaptcha"]')
		) {
			const script = document.createElement("script");
			script.src = `https://www.google.com/recaptcha/api.js?render=${CONFIG.RECAPTCHA.SITE_KEY}`;
			script.async = true;
			document.head.appendChild(script);
			scriptElement = script;
		}
	});

	onCleanup(() => {
		if (scriptElement) {
			scriptElement.remove();
		}
	});

	return {};
}
