import { formatDateForInput } from "./date";

describe("formatDateForInput", () => {
  it("formats date with zero-padded month and day", () => {
    expect(formatDateForInput(new Date(2025, 0, 1))).toBe("2025-01-01");
  });

  it("formats double-digit month and day", () => {
    expect(formatDateForInput(new Date(2025, 11, 25))).toBe("2025-12-25");
  });
});
