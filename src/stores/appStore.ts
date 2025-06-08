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

// グローバル設定状態
const [appSettings, setAppSettings] =
	createSignal<AppSettings>(defaultSettings);

// ユーザー情報状態
const [currentUser, setCurrentUser] = createSignal<{
	name: string;
	department?: string;
} | null>(null);

// アプリケーション状態
const [isOnline, setIsOnline] = createSignal<boolean>(navigator.onLine);

// ネットワーク状態の監視
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
