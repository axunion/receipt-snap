import { VALIDATION_MESSAGES } from "@/constants/validationMessages";
import {
	validateAmount,
	validateDate,
	validateDestination,
	validateDetails,
	validateField,
	validateForm,
	validateImageFile,
	validateName,
	validateReceipt,
} from "./validation";

function createFile(name: string, size: number, type: string): File {
	const buffer = new ArrayBuffer(size);
	return new File([buffer], name, { type });
}

// -- validateName --

describe("validateName", () => {
	it("returns error when empty", () => {
		expect(validateName("")).toBe(VALIDATION_MESSAGES.FORM.NAME_REQUIRED);
	});

	it("returns error when whitespace only", () => {
		expect(validateName("   ")).toBe(VALIDATION_MESSAGES.FORM.NAME_REQUIRED);
	});

	it("returns undefined for valid name", () => {
		expect(validateName("Taro")).toBeUndefined();
	});
});

// -- validateAmount --

describe("validateAmount", () => {
	it("returns error for 0", () => {
		expect(validateAmount(0)).toBe(VALIDATION_MESSAGES.FORM.AMOUNT_INVALID);
	});

	it("returns error for negative", () => {
		expect(validateAmount(-1)).toBe(VALIDATION_MESSAGES.FORM.AMOUNT_INVALID);
	});

	it("returns error for NaN", () => {
		expect(validateAmount(Number.NaN)).toBe(
			VALIDATION_MESSAGES.FORM.AMOUNT_INVALID,
		);
	});

	it("returns undefined for 1 (minimum valid)", () => {
		expect(validateAmount(1)).toBeUndefined();
	});

	it("returns undefined for 1000000 (max boundary)", () => {
		expect(validateAmount(1_000_000)).toBeUndefined();
	});

	it("returns error for 1000001 (over max)", () => {
		expect(validateAmount(1_000_001)).toBe(
			VALIDATION_MESSAGES.FORM.AMOUNT_TOO_LARGE,
		);
	});
});

// -- validateDate --

describe("validateDate", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date(2025, 1, 11)); // 2025-02-11
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("returns error when empty", () => {
		expect(validateDate("")).toBe(VALIDATION_MESSAGES.FORM.DATE_REQUIRED);
	});

	it("returns error for invalid format (missing parts)", () => {
		expect(validateDate("2025-01")).toBe(
			VALIDATION_MESSAGES.FORM.DATE_INVALID_FORMAT,
		);
	});

	it("returns error for invalid format (wrong lengths)", () => {
		expect(validateDate("25-1-1")).toBe(
			VALIDATION_MESSAGES.FORM.DATE_INVALID_FORMAT,
		);
	});

	it("returns error for non-numeric parts", () => {
		expect(validateDate("abcd-ef-gh")).toBe(
			VALIDATION_MESSAGES.FORM.DATE_INVALID_NUMBERS,
		);
	});

	it("returns error for month 0", () => {
		expect(validateDate("2025-00-15")).toBe(
			VALIDATION_MESSAGES.FORM.MONTH_INVALID,
		);
	});

	it("returns error for month 13", () => {
		expect(validateDate("2025-13-01")).toBe(
			VALIDATION_MESSAGES.FORM.MONTH_INVALID,
		);
	});

	it("returns error for day 0", () => {
		expect(validateDate("2025-01-00")).toBe(
			VALIDATION_MESSAGES.FORM.DAY_INVALID,
		);
	});

	it("returns error for day 32", () => {
		expect(validateDate("2025-01-32")).toBe(
			VALIDATION_MESSAGES.FORM.DAY_INVALID,
		);
	});

	it("accepts leap year date 2024-02-29", () => {
		expect(validateDate("2024-02-29")).toBeUndefined();
	});

	it("rejects non-leap year date 2023-02-29", () => {
		expect(validateDate("2023-02-29")).toBe(
			VALIDATION_MESSAGES.FORM.DATE_NOT_EXIST,
		);
	});

	it("rejects April 31 (does not exist)", () => {
		expect(validateDate("2025-04-31")).toBe(
			VALIDATION_MESSAGES.FORM.DATE_NOT_EXIST,
		);
	});

	it("returns undefined for valid past date", () => {
		expect(validateDate("2025-01-15")).toBeUndefined();
	});

	it("returns undefined for today", () => {
		expect(validateDate("2025-02-11")).toBeUndefined();
	});

	it("returns error for future date", () => {
		expect(validateDate("2025-12-31")).toBe(
			VALIDATION_MESSAGES.FORM.FUTURE_DATE,
		);
	});
});

// -- validateDetails --

describe("validateDetails", () => {
	it("returns error when empty", () => {
		expect(validateDetails("")).toBe(VALIDATION_MESSAGES.FORM.DETAILS_REQUIRED);
	});

	it("returns error when whitespace only", () => {
		expect(validateDetails("  ")).toBe(
			VALIDATION_MESSAGES.FORM.DETAILS_REQUIRED,
		);
	});

	it("returns undefined for valid input", () => {
		expect(validateDetails("Office supplies")).toBeUndefined();
	});
});

// -- validateDestination --

describe("validateDestination", () => {
	it("returns error when empty", () => {
		expect(validateDestination("")).toBe(
			VALIDATION_MESSAGES.FORM.DESTINATION_REQUIRED,
		);
	});

	it("returns error when whitespace only", () => {
		expect(validateDestination("   ")).toBe(
			VALIDATION_MESSAGES.FORM.DESTINATION_REQUIRED,
		);
	});

	it("returns undefined for valid input", () => {
		expect(validateDestination("Tokyo Office")).toBeUndefined();
	});
});

// -- validateImageFile --

describe("validateImageFile", () => {
	it("accepts JPEG file", () => {
		const file = createFile("photo.jpg", 1024, "image/jpeg");
		const result = validateImageFile(file);
		expect(result.isValid).toBe(true);
		expect(result.error).toBeUndefined();
	});

	it("accepts PNG file", () => {
		const file = createFile("photo.png", 1024, "image/png");
		expect(validateImageFile(file).isValid).toBe(true);
	});

	it("accepts WebP file", () => {
		const file = createFile("photo.webp", 1024, "image/webp");
		expect(validateImageFile(file).isValid).toBe(true);
	});

	it("rejects unsupported MIME type", () => {
		const file = createFile("doc.pdf", 1024, "application/pdf");
		const result = validateImageFile(file);
		expect(result.isValid).toBe(false);
		expect(result.error).toBe(VALIDATION_MESSAGES.IMAGE.INVALID_TYPE);
	});

	it("rejects file exceeding 12MB", () => {
		const file = createFile("huge.jpg", 13 * 1024 * 1024, "image/jpeg");
		const result = validateImageFile(file);
		expect(result.isValid).toBe(false);
		expect(result.error).toBe(VALIDATION_MESSAGES.IMAGE.FILE_TOO_LARGE);
	});

	it("accepts file exactly at 12MB limit", () => {
		const file = createFile("limit.jpg", 12 * 1024 * 1024, "image/jpeg");
		const result = validateImageFile(file);
		expect(result.isValid).toBe(true);
		expect(result.error).toBeUndefined();
	});

	it("warns for file over 6MB", () => {
		const file = createFile("big.jpg", 7 * 1024 * 1024, "image/jpeg");
		const result = validateImageFile(file);
		expect(result.isValid).toBe(true);
		expect(result.warning).toBe(VALIDATION_MESSAGES.IMAGE.LARGE_FILE_WARNING);
	});

	it("does not warn for file exactly at 6MB threshold", () => {
		const file = createFile("threshold.jpg", 6 * 1024 * 1024, "image/jpeg");
		const result = validateImageFile(file);
		expect(result.isValid).toBe(true);
		expect(result.warning).toBeUndefined();
	});

	it("returns no warning for file under 6MB", () => {
		const file = createFile("small.jpg", 5 * 1024 * 1024, "image/jpeg");
		const result = validateImageFile(file);
		expect(result.isValid).toBe(true);
		expect(result.warning).toBeUndefined();
	});

	it("returns info for HEIC file", () => {
		const file = createFile("photo.heic", 1024, "image/heic");
		const result = validateImageFile(file);
		expect(result.isValid).toBe(true);
		expect(result.info).toBe(VALIDATION_MESSAGES.IMAGE.HEIC_INFO);
	});

	it("returns info for HEIF file", () => {
		const file = createFile("photo.heif", 1024, "image/heif");
		const result = validateImageFile(file);
		expect(result.isValid).toBe(true);
		expect(result.info).toBe(VALIDATION_MESSAGES.IMAGE.HEIC_INFO);
	});
});

// -- validateReceipt --

describe("validateReceipt", () => {
	it("returns error when no file and no reason", () => {
		expect(validateReceipt(null, "")).toBe(
			VALIDATION_MESSAGES.FORM.RECEIPT_REQUIRED,
		);
	});

	it("returns error when no file and whitespace-only reason", () => {
		expect(validateReceipt(null, "   ")).toBe(
			VALIDATION_MESSAGES.FORM.RECEIPT_REQUIRED,
		);
	});

	it("returns undefined when file is provided", () => {
		const file = createFile("receipt.jpg", 1024, "image/jpeg");
		expect(validateReceipt(file, "")).toBeUndefined();
	});

	it("returns undefined when reason is provided (no file)", () => {
		expect(validateReceipt(null, "Lost receipt")).toBeUndefined();
	});

	it("returns undefined when both file and reason are provided", () => {
		const file = createFile("receipt.jpg", 1024, "image/jpeg");
		expect(validateReceipt(file, "Backup copy")).toBeUndefined();
	});
});

// -- validateField --

describe("validateField", () => {
	it("delegates to validateName for 'name'", () => {
		expect(validateField("name", "")).toBe(
			VALIDATION_MESSAGES.FORM.NAME_REQUIRED,
		);
		expect(validateField("name", "Taro")).toBeUndefined();
	});

	it("delegates to validateAmount for 'amount'", () => {
		expect(validateField("amount", 0)).toBe(
			VALIDATION_MESSAGES.FORM.AMOUNT_INVALID,
		);
		expect(validateField("amount", 100)).toBeUndefined();
	});

	it("delegates to validateReceipt with extraValue for 'receipt'", () => {
		expect(validateField("receipt", null, "")).toBe(
			VALIDATION_MESSAGES.FORM.RECEIPT_REQUIRED,
		);
		expect(validateField("receipt", null, "Lost")).toBeUndefined();
	});

	it("returns undefined for unknown field", () => {
		expect(
			validateField("unknown" as keyof import("@/types").FieldErrors, "x"),
		).toBeUndefined();
	});
});

// -- validateForm --

describe("validateForm", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date(2025, 1, 11));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	const validFormData = {
		name: "Taro",
		amount: 500,
		date: "2025-01-15",
		details: "Lunch",
		destination: "Tokyo Office",
		receiptFile: createFile("receipt.jpg", 1024, "image/jpeg"),
		noImageReason: "",
	};

	it("returns isValid true when all fields are valid", () => {
		const result = validateForm(validFormData);
		expect(result.isValid).toBe(true);
		expect(result.errors).toHaveLength(0);
	});

	it("returns isValid false when all fields are invalid", () => {
		const result = validateForm({
			name: "",
			amount: 0,
			date: "",
			details: "",
			destination: "",
			receiptFile: null,
			noImageReason: "",
		});
		expect(result.isValid).toBe(false);
		expect(result.errors.length).toBe(6);
	});

	it("collects fieldErrors for invalid fields", () => {
		const result = validateForm({
			...validFormData,
			name: "",
			amount: -1,
		});
		expect(result.isValid).toBe(false);
		expect(result.fieldErrors.name).toBe(
			VALIDATION_MESSAGES.FORM.NAME_REQUIRED,
		);
		expect(result.fieldErrors.amount).toBe(
			VALIDATION_MESSAGES.FORM.AMOUNT_INVALID,
		);
		expect(result.fieldErrors.date).toBeUndefined();
	});
});
