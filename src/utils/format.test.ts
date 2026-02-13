import { formatAmount, parseAmount } from "./format";

describe("formatAmount", () => {
	it("returns empty string for empty input", () => {
		expect(formatAmount("")).toBe("");
	});

	it("returns empty string for non-numeric input", () => {
		expect(formatAmount("abc")).toBe("");
	});

	it("strips non-digit characters", () => {
		expect(parseAmount(formatAmount("1,234"))).toBe(1234);
	});

	it("removes leading zeros", () => {
		expect(parseAmount(formatAmount("007"))).toBe(7);
	});

	it("returns '0' for all-zero input", () => {
		expect(formatAmount("000")).toBe("0");
	});

	it("formats large numbers with locale separators", () => {
		expect(formatAmount("1234567")).toBe(formatAmount("001234567"));
	});

	it("formats normalized number with locale formatter", () => {
		let formattedNumber: number | undefined;
		const localeSpy = vi
			.spyOn(Number.prototype, "toLocaleString")
			.mockImplementation(function thisFormatter(this: number) {
				formattedNumber = Number(this);
				return "formatted-number";
			});

		expect(formatAmount("$1,000.50")).toBe("formatted-number");
		expect(formattedNumber).toBe(100050);
		expect(localeSpy).toHaveBeenCalledTimes(1);
		localeSpy.mockRestore();
	});
});

describe("parseAmount", () => {
	it("returns 0 for empty string", () => {
		expect(parseAmount("")).toBe(0);
	});

	it("returns 0 for non-numeric string", () => {
		expect(parseAmount("abc")).toBe(0);
	});

	it("parses formatted number", () => {
		expect(parseAmount("1,234")).toBe(1234);
	});

	it("parses plain number string", () => {
		expect(parseAmount("500")).toBe(500);
	});
});

describe("formatAmount <-> parseAmount round-trip", () => {
	it.each([1, 100, 1000, 12345, 1000000])("round-trips %i", (n) => {
		const formatted = formatAmount(String(n));
		expect(parseAmount(formatted)).toBe(n);
	});
});
