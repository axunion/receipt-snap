// Validate environment variables at build time
const validateEnvVar = (name: string, value: string | undefined): string => {
	if (!value && import.meta.env.PROD) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value || "";
};

export const CONFIG = {
	RECAPTCHA: {
		SITE_KEY: validateEnvVar(
			"VITE_RECAPTCHA_SITE_KEY",
			import.meta.env.VITE_RECAPTCHA_SITE_KEY,
		),
	},
	API: {
		BASE_URL: validateEnvVar(
			"VITE_API_BASE_URL",
			import.meta.env.VITE_API_BASE_URL,
		),
	},
} as const;
