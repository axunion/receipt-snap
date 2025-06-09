import { createSignal } from "solid-js";

export interface AppSettings {
	compressionQuality: number;
	autoCompress: boolean;
	theme: "light" | "dark" | "auto";
	debugMode: boolean;
}

const defaultSettings: AppSettings = {
	compressionQuality: 0.7,
	autoCompress: true,
	theme: "light",
	debugMode: import.meta.env.DEV,
};

const [appSettings, setAppSettings] = createSignal(defaultSettings);

const [currentUser, setCurrentUser] = createSignal<{
	name: string;
	department?: string;
} | null>(null);

const [isOnline, setIsOnline] = createSignal(navigator.onLine);

// Network status monitoring
if (typeof window !== "undefined") {
	window.addEventListener("online", () => setIsOnline(true));
	window.addEventListener("offline", () => setIsOnline(false));
}

export const appStore = {
	// State
	settings: appSettings,
	currentUser,
	isOnline,

	// Actions
	updateSettings: (newSettings: Partial<AppSettings>) => {
		setAppSettings((prev) => ({ ...prev, ...newSettings }));
	},

	setUser: (user: { name: string; department?: string } | null) => {
		setCurrentUser(user);
	},

	// Getters
	isDebugMode: () => appSettings().debugMode,
	getCompressionQuality: () => appSettings().compressionQuality,
};
