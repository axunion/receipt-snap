import { renderHook } from "@solidjs/testing-library";
import { useRecaptcha } from "./useRecaptcha";

const mockConfig = vi.hoisted(() => ({
	RECAPTCHA: { SITE_KEY: "test-site-key" },
	API: { BASE_URL: "" },
	POSTMESSAGE: { ALLOWED_ORIGINS: new Set<string>() },
}));

vi.mock("@/constants/config", () => ({ CONFIG: mockConfig }));

describe("useRecaptcha", () => {
	beforeEach(() => {
		mockConfig.RECAPTCHA.SITE_KEY = "test-site-key";
		for (const script of document.querySelectorAll(
			'script[src*="recaptcha"]',
		)) {
			script.remove();
		}
	});

	it("appends a recaptcha script with SITE_KEY when none exists", () => {
		renderHook(() => useRecaptcha());

		const scripts = document.querySelectorAll('script[src*="recaptcha"]');
		expect(scripts).toHaveLength(1);
		expect(scripts[0].getAttribute("src")).toContain("test-site-key");
		expect((scripts[0] as HTMLScriptElement).async).toBe(true);
	});

	it("does not add a second script when one already exists", () => {
		const existing = document.createElement("script");
		existing.src =
			"https://www.google.com/recaptcha/api.js?render=existing-key";
		document.head.appendChild(existing);

		renderHook(() => useRecaptcha());

		expect(document.querySelectorAll('script[src*="recaptcha"]')).toHaveLength(
			1,
		);
	});

	it("does not add any script when SITE_KEY is empty", () => {
		mockConfig.RECAPTCHA.SITE_KEY = "";

		renderHook(() => useRecaptcha());

		expect(document.querySelectorAll('script[src*="recaptcha"]')).toHaveLength(
			0,
		);
	});

	it("removes the script on cleanup", () => {
		const { cleanup } = renderHook(() => useRecaptcha());
		expect(document.querySelectorAll('script[src*="recaptcha"]')).toHaveLength(
			1,
		);

		cleanup();

		expect(document.querySelectorAll('script[src*="recaptcha"]')).toHaveLength(
			0,
		);
	});
});
