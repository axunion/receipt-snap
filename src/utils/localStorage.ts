const USER_NAME_KEY = "receipt-snap-user-name";

/**
 * Save user name to localStorage
 */
export const saveUserName = (name: string): void => {
	try {
		localStorage.setItem(USER_NAME_KEY, name.trim());
	} catch {
		// Skip saving on error
	}
};

/**
 * Load user name from localStorage
 */
export const loadUserName = (): string => {
	try {
		return localStorage.getItem(USER_NAME_KEY) || "";
	} catch {
		return "";
	}
};

const DEV_MOCK_API_KEY = "receipt-snap-dev-mock-api";
const DEV_FORCE_ERROR_KEY = "receipt-snap-dev-force-error";

export const getDevMockEnabled = (): boolean => {
	try {
		return localStorage.getItem(DEV_MOCK_API_KEY) !== "false";
	} catch {
		return true;
	}
};

export const setDevMockEnabled = (enabled: boolean): void => {
	try {
		localStorage.setItem(DEV_MOCK_API_KEY, String(enabled));
	} catch {
		// Skip saving on error
	}
};

export const getDevForceError = (): boolean => {
	try {
		return localStorage.getItem(DEV_FORCE_ERROR_KEY) === "true";
	} catch {
		return false;
	}
};

export const setDevForceError = (enabled: boolean): void => {
	try {
		localStorage.setItem(DEV_FORCE_ERROR_KEY, String(enabled));
	} catch {
		// Skip saving on error
	}
};
