import {
	formatDateForDisplay,
	formatDateForInput,
	getTodayDateString,
} from "./date";

describe("getTodayDateString", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("returns today's date in YYYY-MM-DD format", () => {
		vi.setSystemTime(new Date(2025, 1, 11)); // Feb 11, 2025
		expect(getTodayDateString()).toBe("2025-02-11");
	});

	it("zero-pads single-digit month and day", () => {
		vi.setSystemTime(new Date(2025, 0, 5)); // Jan 5, 2025
		expect(getTodayDateString()).toBe("2025-01-05");
	});

	it("handles year-end date", () => {
		vi.setSystemTime(new Date(2025, 11, 31)); // Dec 31, 2025
		expect(getTodayDateString()).toBe("2025-12-31");
	});
});

describe("formatDateForInput", () => {
	it("formats date with zero-padded month and day", () => {
		expect(formatDateForInput(new Date(2025, 0, 1))).toBe("2025-01-01");
	});

	it("formats double-digit month and day", () => {
		expect(formatDateForInput(new Date(2025, 11, 25))).toBe("2025-12-25");
	});
});

describe("formatDateForDisplay", () => {
	it("formats as Japanese date string", () => {
		expect(formatDateForDisplay("2025-02-11")).toBe("2025年2月11日");
	});

	it("strips leading zeros from month and day", () => {
		expect(formatDateForDisplay("2025-01-05")).toBe("2025年1月5日");
	});

	it("handles December 31", () => {
		expect(formatDateForDisplay("2025-12-31")).toBe("2025年12月31日");
	});
});
