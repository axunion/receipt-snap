import { renderHook } from "@solidjs/testing-library";
import { expenseFormStore } from "./expenseFormStore";
import { useSubmitFeedback } from "./useSubmitFeedback";

vi.mock("./destinationStore", () => ({
	destinationStore: {
		destinations: () => [],
		error: () => null,
		loading: () => false,
		refetch: vi.fn(),
		getDestinationLabel: vi.fn().mockReturnValue("Project Alpha"),
	},
}));

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

describe("useSubmitFeedback", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		resetStore();
	});

	it("opens success modal with submittedData when result is done", () => {
		expenseFormStore.setDetails("Lunch");
		expenseFormStore.setAmount("1200");
		expenseFormStore.setDestination("project_a");

		const resetForm = vi.fn();
		const { result } = renderHook(() => useSubmitFeedback(resetForm));

		expenseFormStore.setSubmitState({
			isLoading: false,
			result: { result: "done" },
		});

		expect(result.showSuccessModal()).toBe(true);
		expect(result.submittedData()).toEqual({
			destinationLabel: "Project Alpha",
			details: "Lunch",
			amount: 1200,
		});
	});

	it("opens error modal with error message when result is error", () => {
		const resetForm = vi.fn();
		const { result } = renderHook(() => useSubmitFeedback(resetForm));

		expenseFormStore.setSubmitState({
			isLoading: false,
			result: { result: "error", error: "Server unavailable" },
		});

		expect(result.showErrorModal()).toBe(true);
		expect(result.errorMessage()).toBe("Server unavailable");
	});

	it("does not open modal while isLoading is true", () => {
		const resetForm = vi.fn();
		const { result } = renderHook(() => useSubmitFeedback(resetForm));

		expenseFormStore.setSubmitState({
			isLoading: true,
			result: { result: "done" },
		});

		expect(result.showSuccessModal()).toBe(false);
		expect(result.showErrorModal()).toBe(false);
	});

	describe("handleNewExpense", () => {
		it("closes success modal, clears submittedData, resets submitState, calls resetForm callback", () => {
			const resetForm = vi.fn();
			const { result } = renderHook(() => useSubmitFeedback(resetForm));

			expenseFormStore.setSubmitState({
				isLoading: false,
				result: { result: "done" },
			});
			expect(result.showSuccessModal()).toBe(true);

			result.handleNewExpense();

			expect(result.showSuccessModal()).toBe(false);
			expect(result.submittedData()).toBeUndefined();
			expect(expenseFormStore.submitState().result).toBeNull();
			expect(resetForm).toHaveBeenCalledOnce();
		});
	});

	describe("handleCloseError", () => {
		it("closes error modal, clears errorMessage, resets submitState", () => {
			const resetForm = vi.fn();
			const { result } = renderHook(() => useSubmitFeedback(resetForm));

			expenseFormStore.setSubmitState({
				isLoading: false,
				result: { result: "error", error: "Network error" },
			});
			expect(result.showErrorModal()).toBe(true);

			result.handleCloseError();

			expect(result.showErrorModal()).toBe(false);
			expect(result.errorMessage()).toBe("");
			expect(expenseFormStore.submitState().result).toBeNull();
		});
	});
});
