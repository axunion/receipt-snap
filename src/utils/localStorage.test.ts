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

	it("does not throw when save fails", () => {
		const setItemSpy = vi
			.spyOn(Storage.prototype, "setItem")
			.mockImplementation(() => {
				throw new Error("storage write failed");
			});

		expect(() => saveUserName("Taro")).not.toThrow();
		setItemSpy.mockRestore();
	});

	it("returns empty string when load throws", () => {
		const getItemSpy = vi
			.spyOn(Storage.prototype, "getItem")
			.mockImplementation(() => {
				throw new Error("storage read failed");
			});

		expect(loadUserName()).toBe("");
		getItemSpy.mockRestore();
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

	it("defaults to true when get operation fails", () => {
		const getItemSpy = vi
			.spyOn(Storage.prototype, "getItem")
			.mockImplementation(() => {
				throw new Error("storage read failed");
			});

		expect(getDevMockEnabled()).toBe(true);
		getItemSpy.mockRestore();
	});

	it("does not throw when save operation fails", () => {
		const setItemSpy = vi
			.spyOn(Storage.prototype, "setItem")
			.mockImplementation(() => {
				throw new Error("storage write failed");
			});

		expect(() => setDevMockEnabled(true)).not.toThrow();
		setItemSpy.mockRestore();
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

	it("defaults to false when get operation fails", () => {
		const getItemSpy = vi
			.spyOn(Storage.prototype, "getItem")
			.mockImplementation(() => {
				throw new Error("storage read failed");
			});

		expect(getDevForceError()).toBe(false);
		getItemSpy.mockRestore();
	});

	it("does not throw when save operation fails", () => {
		const setItemSpy = vi
			.spyOn(Storage.prototype, "setItem")
			.mockImplementation(() => {
				throw new Error("storage write failed");
			});

		expect(() => setDevForceError(true)).not.toThrow();
		setItemSpy.mockRestore();
	});
});
