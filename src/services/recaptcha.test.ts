import { CONFIG } from "@/constants/config";
import { getReCaptchaToken } from "./recaptcha";

describe("getReCaptchaToken", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    Reflect.deleteProperty(
      window as unknown as Record<string, unknown>,
      "grecaptcha",
    );
  });

  it("resolves empty string when grecaptcha is not available", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await expect(getReCaptchaToken()).resolves.toBe("");
    expect(warnSpy).toHaveBeenCalledWith("reCAPTCHA not loaded");
  });

  it("resolves token when execute succeeds", async () => {
    const executeMock = vi.fn().mockResolvedValue("recaptcha-token");
    (window as Window & { grecaptcha?: Window["grecaptcha"] }).grecaptcha = {
      ready: (callback: () => void) => callback(),
      execute: executeMock,
    };

    const result = await getReCaptchaToken("submit-expense");

    expect(result).toBe("recaptcha-token");
    expect(executeMock).toHaveBeenCalledWith(CONFIG.RECAPTCHA.SITE_KEY, {
      action: "submit-expense",
    });
  });

  it("rejects when the token request times out", async () => {
    vi.useFakeTimers();
    const executeMock = vi.fn();
    (window as Window & { grecaptcha?: Window["grecaptcha"] }).grecaptcha = {
      ready: () => {}, // callback never invoked — simulates a hung grecaptcha
      execute: executeMock,
    };

    const tokenPromise = getReCaptchaToken();
    const assertion = expect(tokenPromise).rejects.toThrow(
      "reCAPTCHA token request timed out",
    );
    await vi.advanceTimersByTimeAsync(10_000);
    await assertion;
    expect(executeMock).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("rejects when execute fails", async () => {
    const executeError = new Error("execute failed");
    const executeMock = vi.fn().mockRejectedValue(executeError);
    (window as Window & { grecaptcha?: Window["grecaptcha"] }).grecaptcha = {
      ready: (callback: () => void) => callback(),
      execute: executeMock,
    };

    await expect(getReCaptchaToken()).rejects.toBe(executeError);
  });
});
