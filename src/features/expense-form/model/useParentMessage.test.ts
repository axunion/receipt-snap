import { renderHook } from "@solidjs/testing-library";
import { NAME_LIMITS } from "@/constants/validation";
import { expenseFormStore } from "./expenseFormStore";
import { useParentMessage } from "./useParentMessage";

const { saveUserNameMock } = vi.hoisted(() => ({
	saveUserNameMock: vi.fn(),
}));

vi.mock("@/utils", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/utils")>();
	return { ...actual, saveUserName: saveUserNameMock };
});

function resetStore() {
	expenseFormStore.setName("");
	expenseFormStore.setAmount("");
	expenseFormStore.setDate("2025-01-01");
	expenseFormStore.setDetails("");
	expenseFormStore.setDestination("");
	expenseFormStore.setNotes("");
	expenseFormStore.setNoImageReason("");
	expenseFormStore.setReceiptFile(null);
	expenseFormStore.setSubmitState({ isLoading: false, result: null });
	expenseFormStore.setIsExternalName(false);
}

describe("useParentMessage", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		saveUserNameMock.mockReset();
		resetStore();
	});

	describe("when not inside an iframe (window === window.parent)", () => {
		it("registers no message listener", () => {
			const addEventListenerSpy = vi.spyOn(window, "addEventListener");
			renderHook(() => useParentMessage());
			expect(addEventListenerSpy).not.toHaveBeenCalledWith(
				"message",
				expect.any(Function),
			);
		});
	});

	describe("when inside an iframe (window !== window.parent)", () => {
		const mockParent = { postMessage: vi.fn() };

		beforeEach(() => {
			mockParent.postMessage.mockReset();
			Object.defineProperty(window, "parent", {
				get: () => mockParent,
				configurable: true,
			});
		});

		afterEach(() => {
			Object.defineProperty(window, "parent", {
				get: () => window,
				configurable: true,
			});
		});

		it("sends receipt-snap:ready to parent on mount", () => {
			renderHook(() => useParentMessage());
			expect(mockParent.postMessage).toHaveBeenCalledWith(
				{ type: "receipt-snap:ready" },
				"*",
			);
		});

		it("sets name from allowed origin and marks isExternalName", () => {
			renderHook(() => useParentMessage());

			window.dispatchEvent(
				new MessageEvent("message", {
					origin: window.location.origin,
					data: { type: "receipt-snap:set-name", name: "Hanako" },
				}),
			);

			expect(expenseFormStore.name()).toBe("Hanako");
			expect(expenseFormStore.isExternalName()).toBe(true);
			expect(saveUserNameMock).toHaveBeenCalledWith("Hanako");
		});

		it("ignores messages from disallowed origin", () => {
			renderHook(() => useParentMessage());

			window.dispatchEvent(
				new MessageEvent("message", {
					origin: "http://evil.example.com",
					data: { type: "receipt-snap:set-name", name: "Hacker" },
				}),
			);

			expect(expenseFormStore.name()).toBe("");
			expect(expenseFormStore.isExternalName()).toBe(false);
			expect(saveUserNameMock).not.toHaveBeenCalled();
		});

		it("ignores messages with wrong type", () => {
			renderHook(() => useParentMessage());

			window.dispatchEvent(
				new MessageEvent("message", {
					origin: window.location.origin,
					data: { type: "other:event", name: "Ignored" },
				}),
			);

			expect(expenseFormStore.name()).toBe("");
		});

		it("ignores messages where name is not a string", () => {
			renderHook(() => useParentMessage());

			window.dispatchEvent(
				new MessageEvent("message", {
					origin: window.location.origin,
					data: { type: "receipt-snap:set-name", name: 42 },
				}),
			);

			expect(expenseFormStore.name()).toBe("");
		});

		it("ignores names exceeding MAX_LENGTH", () => {
			renderHook(() => useParentMessage());
			const tooLong = "a".repeat(NAME_LIMITS.MAX_LENGTH + 1);

			window.dispatchEvent(
				new MessageEvent("message", {
					origin: window.location.origin,
					data: { type: "receipt-snap:set-name", name: tooLong },
				}),
			);

			expect(expenseFormStore.name()).toBe("");
		});

		it("accepts a name exactly at MAX_LENGTH", () => {
			renderHook(() => useParentMessage());
			const atLimit = "a".repeat(NAME_LIMITS.MAX_LENGTH);

			window.dispatchEvent(
				new MessageEvent("message", {
					origin: window.location.origin,
					data: { type: "receipt-snap:set-name", name: atLimit },
				}),
			);

			expect(expenseFormStore.name()).toBe(atLimit);
		});

		it("removes event listener on cleanup", () => {
			const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
			const { cleanup } = renderHook(() => useParentMessage());

			cleanup();

			expect(removeEventListenerSpy).toHaveBeenCalledWith(
				"message",
				expect.any(Function),
			);
		});
	});
});
