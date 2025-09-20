export const CONFIG = {
	RECAPTCHA: {
		SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY || "",
	},
	API: {
		BASE_URL: import.meta.env.VITE_API_BASE_URL || "",
	},
} as const;
