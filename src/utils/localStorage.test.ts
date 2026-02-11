import {
	getDevForceError,
	getDevMockEnabled,
	loadUserName,
	saveUserName,
	setDevForceError,
	setDevMockEnabled,
} from "./localStorage";

beforeEach(() => {
	localStorage.clear();
});

// -- saveUserName / loadUserName --

describe("saveUserName / loadUserName", () => {
	it("round-trips a name", () => {
		saveUserName("Taro");
		expect(loadUserName()).toBe("Taro");
	});

	it("trims whitespace on save", () => {
		saveUserName("  Taro  ");
		expect(loadUserName()).toBe("Taro");
	});

	it("returns empty string when nothing saved", () => {
		expect(loadUserName()).toBe("");
	});
});

// -- getDevMockEnabled / setDevMockEnabled --

describe("getDevMockEnabled / setDevMockEnabled", () => {
	it("defaults to true when not set", () => {
		expect(getDevMockEnabled()).toBe(true);
	});

	it("returns false when set to false", () => {
		setDevMockEnabled(false);
		expect(getDevMockEnabled()).toBe(false);
	});

	it("returns true when set to true", () => {
		setDevMockEnabled(true);
		expect(getDevMockEnabled()).toBe(true);
	});
});

// -- getDevForceError / setDevForceError --

describe("getDevForceError / setDevForceError", () => {
	it("defaults to false when not set", () => {
		expect(getDevForceError()).toBe(false);
	});

	it("returns true when set to true", () => {
		setDevForceError(true);
		expect(getDevForceError()).toBe(true);
	});

	it("returns false when set to false", () => {
		setDevForceError(false);
		expect(getDevForceError()).toBe(false);
	});
});
