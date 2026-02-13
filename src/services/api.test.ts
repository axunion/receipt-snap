import { CONFIG } from "@/constants/config";
import { ERROR_MESSAGES } from "@/constants/errorMessages";
import type { ExpenseSubmitPayload } from "@/types";
import { fetchDestinations, submitExpense } from "./api";

const { getDevMockEnabledMock, getDevForceErrorMock } = vi.hoisted(() => ({
	getDevMockEnabledMock: vi.fn<() => boolean>(),
	getDevForceErrorMock: vi.fn<() => boolean>(),
}));

vi.mock("@/utils/localStorage", () => ({
	getDevMockEnabled: getDevMockEnabledMock,
	getDevForceError: getDevForceErrorMock,
}));

describe("services/api", () => {
	const payload: ExpenseSubmitPayload = {
		recaptchaToken: "token",
		name: "Taro",
		amount: "1200",
		date: "2025-01-10",
		details: "Lunch",
		destination: "project_a",
		notes: "",
		receiptImage: "base64-image",
		noImageReason: "",
	};

	beforeEach(() => {
		vi.restoreAllMocks();
		vi.stubGlobal("fetch", vi.fn());
		getDevMockEnabledMock.mockReturnValue(false);
		getDevForceErrorMock.mockReturnValue(false);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe("fetchDestinations (API path)", () => {
		it("returns destination data on success", async () => {
			const fetchMock = vi.mocked(fetch);
			fetchMock.mockResolvedValue({
				ok: true,
				json: async () => ({
					result: "done",
					data: [{ value: "project_a", label: "ProjectA" }],
				}),
			} as Response);

			const result = await fetchDestinations();

			expect(fetchMock).toHaveBeenCalledWith(CONFIG.API.BASE_URL, undefined);
			expect(result).toEqual({
				result: "done",
				data: [{ value: "project_a", label: "ProjectA" }],
			});
		});

		it("returns HTTP error details when status is not ok", async () => {
			const fetchMock = vi.mocked(fetch);
			fetchMock.mockResolvedValue({
				ok: false,
				status: 500,
				statusText: "Internal Server Error",
				json: async () => ({}),
			} as Response);

			const result = await fetchDestinations();

			expect(result).toEqual({
				result: "error",
				error: "HTTP 500: Internal Server Error",
			});
		});

		it("maps fetch type errors to network message", async () => {
			const fetchMock = vi.mocked(fetch);
			fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

			const result = await fetchDestinations();

			expect(result).toEqual({
				result: "error",
				error: ERROR_MESSAGES.NETWORK,
			});
		});
	});

	describe("submitExpense (API path)", () => {
		it("sends POST request and returns success response", async () => {
			const fetchMock = vi.mocked(fetch);
			fetchMock.mockResolvedValue({
				ok: true,
				json: async () => ({ result: "done" }),
			} as Response);

			const result = await submitExpense(payload);

			expect(fetchMock).toHaveBeenCalledWith(CONFIG.API.BASE_URL, {
				method: "POST",
				body: JSON.stringify(payload),
			});
			expect(result).toEqual({ result: "done" });
		});

		it("returns HTTP error details when submission fails", async () => {
			const fetchMock = vi.mocked(fetch);
			fetchMock.mockResolvedValue({
				ok: false,
				status: 400,
				statusText: "Bad Request",
				json: async () => ({}),
			} as Response);

			const result = await submitExpense(payload);

			expect(result).toEqual({
				result: "error",
				error: "HTTP 400: Bad Request",
			});
		});

		it("maps fetch type errors to network message", async () => {
			const fetchMock = vi.mocked(fetch);
			fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

			const result = await submitExpense(payload);

			expect(result).toEqual({
				result: "error",
				error: ERROR_MESSAGES.NETWORK,
			});
		});
	});

	const describeDevOnly = import.meta.env.DEV ? describe : describe.skip;

	describeDevOnly("development mock path", () => {
		it("returns mock destinations when mock mode is enabled", async () => {
			vi.useFakeTimers();
			getDevMockEnabledMock.mockReturnValue(true);
			getDevForceErrorMock.mockReturnValue(false);

			const promise = fetchDestinations();
			await vi.runAllTimersAsync();
			const result = await promise;

			expect(result).toEqual({
				result: "done",
				data: [
					{ value: "project_a", label: "ProjectA" },
					{ value: "project_b", label: "ProjectB" },
				],
			});
		});

		it("returns destination mock error when forced", async () => {
			vi.useFakeTimers();
			getDevMockEnabledMock.mockReturnValue(true);
			getDevForceErrorMock.mockReturnValue(true);

			const promise = fetchDestinations();
			await vi.runAllTimersAsync();
			const result = await promise;

			expect(result).toEqual({
				result: "error",
				error: "送信先の取得に失敗しました。",
			});
		});

		it("returns submit mock success response", async () => {
			vi.useFakeTimers();
			getDevMockEnabledMock.mockReturnValue(true);
			getDevForceErrorMock.mockReturnValue(false);

			const promise = submitExpense(payload);
			await vi.runAllTimersAsync();
			const result = await promise;

			expect(result).toEqual({ result: "done" });
		});

		it("returns submit mock error when forced", async () => {
			vi.useFakeTimers();
			getDevMockEnabledMock.mockReturnValue(true);
			getDevForceErrorMock.mockReturnValue(true);

			const promise = submitExpense(payload);
			await vi.runAllTimersAsync();
			const result = await promise;

			expect(result).toEqual({
				result: "error",
				error: "Mock error: Submission failed",
			});
		});
	});
});
