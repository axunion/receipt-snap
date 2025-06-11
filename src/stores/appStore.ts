import { createEffect, createSignal } from "solid-js";

export interface AppSettings {
	compressionQuality: number;
	autoCompress: boolean;
	theme: "light" | "dark" | "auto";
	debugMode: boolean;
}

export interface UserInfo {
	name: string;
	department?: string;
	email?: string;
}

// Default settings
const defaultSettings: AppSettings = {
	compressionQuality: 0.7,
	autoCompress: true,
	theme: "light",
	debugMode: import.meta.env.DEV,
};

// State signals
const [appSettings, setAppSettings] =
	createSignal<AppSettings>(defaultSettings);
const [currentUser, setCurrentUser] = createSignal<UserInfo | null>(null);
const [isOnline, setIsOnline] = createSignal(navigator.onLine);
const [isLoading, setIsLoading] = createSignal(false);

// Utility functions
const loadFromStorage = (key: string) => {
	if (typeof window === "undefined") return null;
	try {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : null;
	} catch (error) {
		console.warn(`Failed to parse ${key} from storage:`, error);
		return null;
	}
};

const saveToStorage = (key: string, value: unknown) => {
	if (typeof window === "undefined") return;
	try {
		if (value !== null) {
			localStorage.setItem(key, JSON.stringify(value));
		} else {
			localStorage.removeItem(key);
		}
	} catch (error) {
		console.warn(`Failed to save ${key} to storage:`, error);
	}
};

// Initialize from localStorage
const initializeStore = () => {
	const savedSettings = loadFromStorage("app-settings");
	if (savedSettings) {
		setAppSettings((prev) => ({ ...prev, ...savedSettings }));
	}

	const savedUser = loadFromStorage("current-user");
	if (savedUser) {
		setCurrentUser(savedUser);
	}
};

// Initialize only on client
if (typeof window !== "undefined") {
	initializeStore();

	// Network status monitoring
	window.addEventListener("online", () => setIsOnline(true));
	window.addEventListener("offline", () => setIsOnline(false));

	// Auto-save to localStorage
	createEffect(() => saveToStorage("app-settings", appSettings()));
	createEffect(() => saveToStorage("current-user", currentUser()));
}

// Store export - SolidJS style
export const appStore = {
	// Direct signal access
	settings: appSettings,
	currentUser,
	isOnline,
	isLoading,

	// Actions
	updateSettings: (newSettings: Partial<AppSettings>) => {
		setAppSettings((prev) => ({ ...prev, ...newSettings }));
	},

	setUser: (user: UserInfo | null) => {
		setCurrentUser(user);
	},

	setLoading: (loading: boolean) => {
		setIsLoading(loading);
	},

	resetSettings: () => {
		setAppSettings(defaultSettings);
	},

	clearUser: () => {
		setCurrentUser(null);
	},

	// Computed values
	isDebugMode: () => appSettings().debugMode,
	compressionQuality: () => appSettings().compressionQuality,
	shouldAutoCompress: () => appSettings().autoCompress,
	currentTheme: () => appSettings().theme,
	isUserLoggedIn: () => !!currentUser(),
	userDisplayName: () => {
		const user = currentUser();
		return user
			? `${user.name}${user.department ? ` (${user.department})` : ""}`
			: null;
	},
};
