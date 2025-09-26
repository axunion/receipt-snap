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
