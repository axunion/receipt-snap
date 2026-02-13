import { renderHook } from "@solidjs/testing-library";
import { VALIDATION_MESSAGES } from "@/constants/validationMessages";
import { expenseFormStore } from "@/stores";
import { useExpenseForm } from "./useExpenseForm";

const { submitExpenseMock, getReCaptchaTokenMock, fileToBase64Mock } =
	vi.hoisted(() => ({
		submitExpenseMock: vi.fn(),
		getReCaptchaTokenMock: vi.fn(),
		fileToBase64Mock: vi.fn(),
	}));

vi.mock("@/services", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/services")>();
	return {
		...actual,
		submitExpense: submitExpenseMock,
		getReCaptchaToken: getReCaptchaTokenMock,
	};
});

vi.mock("@/utils", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/utils")>();
	return {
		...actual,
		fileToBase64: fileToBase64Mock,
	};
});

function resetFormStore() {
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

function setValidFormData() {
	expenseFormStore.setName("Taro");
	expenseFormStore.setAmount("1,200");
	expenseFormStore.setDate("2025-01-01");
	expenseFormStore.setDetails("Lunch");
	expenseFormStore.setDestination("project_a");
	expenseFormStore.setNoImageReason("");
}

describe("useExpenseForm", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		resetFormStore();
		submitExpenseMock.mockReset();
		getReCaptchaTokenMock.mockReset();
		fileToBase64Mock.mockReset();
		getReCaptchaTokenMock.mockResolvedValue("recaptcha-token");
		fileToBase64Mock.mockResolvedValue("base64-image");
	});

	it("does not submit when form is invalid and sets field errors", async () => {
		expenseFormStore.setDate("");
		const { result } = renderHook(() => useExpenseForm());

		const submitResult = await result.submitForm();

		expect(submitResult).toBeUndefined();
		expect(submitExpenseMock).not.toHaveBeenCalled();
		expect(result.formErrors()).toHaveLength(6);
		expect(result.fieldErrors().name).toBe(
			VALIDATION_MESSAGES.FORM.NAME_REQUIRED,
		);
		expect(result.fieldErrors().amount).toBe(
			VALIDATION_MESSAGES.FORM.AMOUNT_INVALID,
		);
		expect(result.fieldErrors().date).toBe(
			VALIDATION_MESSAGES.FORM.DATE_REQUIRED,
		);
		expect(result.fieldErrors().details).toBe(
			VALIDATION_MESSAGES.FORM.DETAILS_REQUIRED,
		);
		expect(result.fieldErrors().destination).toBe(
			VALIDATION_MESSAGES.FORM.DESTINATION_REQUIRED,
		);
		expect(result.fieldErrors().receipt).toBe(
			VALIDATION_MESSAGES.FORM.RECEIPT_REQUIRED,
		);
		expect(result.touchedFields()).toEqual({
			name: true,
			amount: true,
			date: true,
			details: true,
			destination: true,
			receipt: true,
		});
	});

	it("submits valid form with receipt image", async () => {
		setValidFormData();
		const receiptFile = new File(["img"], "receipt.jpg", {
			type: "image/jpeg",
		});
		expenseFormStore.setReceiptFile(receiptFile);
		submitExpenseMock.mockResolvedValue({ result: "done" });
		const { result } = renderHook(() => useExpenseForm());

		const submitResult = await result.submitForm();

		expect(fileToBase64Mock).toHaveBeenCalledWith(receiptFile);
		expect(getReCaptchaTokenMock).toHaveBeenCalledWith();
		expect(submitExpenseMock).toHaveBeenCalledWith({
			recaptchaToken: "recaptcha-token",
			name: "Taro",
			amount: "1200",
			date: "2025-01-01",
			details: "Lunch",
			destination: "project_a",
			notes: "",
			receiptImage: "base64-image",
			noImageReason: "",
		});
		expect(submitResult).toEqual({ result: "done" });
		expect(expenseFormStore.submitState().isLoading).toBe(false);
		expect(expenseFormStore.submitState().result).toEqual({ result: "done" });
	});

	it("submits without base64 conversion when no receipt file exists", async () => {
		setValidFormData();
		expenseFormStore.setNoImageReason("Lost receipt");
		submitExpenseMock.mockResolvedValue({ result: "done" });
		const { result } = renderHook(() => useExpenseForm());

		await result.submitForm();

		expect(fileToBase64Mock).not.toHaveBeenCalled();
		expect(submitExpenseMock).toHaveBeenCalledWith(
			expect.objectContaining({
				receiptImage: "",
				noImageReason: "Lost receipt",
			}),
		);
	});

	it("returns error result when submit throws", async () => {
		setValidFormData();
		expenseFormStore.setNoImageReason("Lost receipt");
		submitExpenseMock.mockRejectedValue(new Error("submission failed"));
		const { result } = renderHook(() => useExpenseForm());

		const submitResult = await result.submitForm();

		expect(submitResult).toEqual({
			result: "error",
			error: "An error occurred during submission. Please try again",
		});
		expect(expenseFormStore.submitState().isLoading).toBe(false);
		expect(expenseFormStore.submitState().result).toEqual({
			result: "error",
			error: "An error occurred during submission. Please try again",
		});
	});

	it("prevents duplicate submission while loading", async () => {
		setValidFormData();
		expenseFormStore.setSubmitState({ isLoading: true, result: null });
		const { result } = renderHook(() => useExpenseForm());

		const submitResult = await result.submitForm();

		expect(submitResult).toBeUndefined();
		expect(getReCaptchaTokenMock).not.toHaveBeenCalled();
		expect(submitExpenseMock).not.toHaveBeenCalled();
	});
});
