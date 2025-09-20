import { CONFIG } from "@/constants/config";

declare global {
	interface Window {
		grecaptcha: {
			ready: (callback: () => void) => void;
			execute: (
				siteKey: string,
				options: { action: string },
			) => Promise<string>;
		};
	}
}

export async function getReCaptchaToken(action = "submit"): Promise<string> {
	return new Promise((resolve, reject) => {
		if (typeof window === "undefined" || !window.grecaptcha) {
			console.warn("reCAPTCHA not loaded");
			resolve("");
			return;
		}

		window.grecaptcha.ready(() => {
			window.grecaptcha
				.execute(CONFIG.RECAPTCHA.SITE_KEY, { action })
				.then(resolve)
				.catch(reject);
		});
	});
}
