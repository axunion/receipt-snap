export const CONFIG = {
	RECAPTCHA: {
		site_Key: import.meta.env.VITE_RECAPTCHA_SITE_KEY || "",
	},
	API: {
		BASE_URL: import.meta.env.VITE_API_BASE_URL || "",
	},
} as const;
