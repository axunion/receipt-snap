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
