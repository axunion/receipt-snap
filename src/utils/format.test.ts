import { parseAmount } from "./format";

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
