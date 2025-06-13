import type { ImageValidationResult } from "@/types/image";
import type { FieldErrors } from "@/types/validation";

// Validation error messages
const VALIDATION_MESSAGES = {
	IMAGE: {
		INVALID_TYPE: "Only JPEG, PNG, WebP, HEIC/HEIF image files are supported.",
		FILE_TOO_LARGE: "File size must be 100MB or less.",
		LARGE_FILE_WARNING: "Large file. Processing may take some time.",
		HEIC_WARNING: "HEIC/HEIF file. May not be viewable in all environments.",
	},
	FORM: {
		NAME_REQUIRED: "Name is required.",
		AMOUNT_INVALID: "Amount must be greater than 0.",
		AMOUNT_TOO_LARGE: "Amount must be 1,000,000 or less.",
		DATE_REQUIRED: "Payment date is required.",
		DATE_INVALID_FORMAT: "Date must be in YYYY-MM-DD format.",
		DATE_INVALID_NUMBERS: "Please use valid numbers for the date.",
		MONTH_INVALID: "Month must be between 1 and 12.",
		DAY_INVALID: "Day must be between 1 and 31.",
		DATE_NOT_EXIST:
			"Please enter a valid date (e.g., February 30th does not exist).",
		FUTURE_DATE: "Future dates are not allowed.",
		DETAILS_REQUIRED: "Details are required.",
		PURPOSE_REQUIRED: "Purpose is required.",
		RECEIPT_REQUIRED:
			"Either a receipt image or a reason for not providing one is required.",
	},
} as const;

export function validateImageFile(file: File): ImageValidationResult {
	const maxSize = 100 * 1024 * 1024; // 100MB
	const allowedTypes = [
		"image/jpeg",
		"image/jpg",
		"image/png",
		"image/webp",
		"image/heic",
		"image/heif",
	];

	if (!allowedTypes.includes(file.type)) {
		return {
			isValid: false,
			error: VALIDATION_MESSAGES.IMAGE.INVALID_TYPE,
		};
	}

	if (file.size > maxSize) {
		return {
			isValid: false,
			error: VALIDATION_MESSAGES.IMAGE.FILE_TOO_LARGE,
		};
	}

	// Generate warning for large files or HEIC format
	const fileSizeMB = file.size / (1024 * 1024);
	let warning: string | undefined;

	if (fileSizeMB > 50) {
		warning = VALIDATION_MESSAGES.IMAGE.LARGE_FILE_WARNING;
	} else if (file.type === "image/heic" || file.type === "image/heif") {
		warning = VALIDATION_MESSAGES.IMAGE.HEIC_WARNING;
	}

	return {
		isValid: true,
		warning,
	};
}

export function validateNameField(name: string): string | undefined {
	return !name.trim() ? VALIDATION_MESSAGES.FORM.NAME_REQUIRED : undefined;
}

export function validateAmountField(amount: number): string | undefined {
	if (Number.isNaN(amount) || amount <= 0) {
		return VALIDATION_MESSAGES.FORM.AMOUNT_INVALID;
	}
	if (amount > 1000000) {
		return VALIDATION_MESSAGES.FORM.AMOUNT_TOO_LARGE;
	}
	return undefined;
}

export function validateDateField(dateString: string): string | undefined {
	if (!dateString) {
		return VALIDATION_MESSAGES.FORM.DATE_REQUIRED;
	}

	const parts = dateString.split("-");
	if (
		parts.length !== 3 ||
		parts[0].length !== 4 ||
		parts[1].length !== 2 ||
		parts[2].length !== 2
	) {
		return VALIDATION_MESSAGES.FORM.DATE_INVALID_FORMAT;
	}

	const year = Number.parseInt(parts[0], 10);
	const month = Number.parseInt(parts[1], 10);
	const day = Number.parseInt(parts[2], 10);

	if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
		return VALIDATION_MESSAGES.FORM.DATE_INVALID_NUMBERS;
	}

	if (month < 1 || month > 12) {
		return VALIDATION_MESSAGES.FORM.MONTH_INVALID;
	}
	if (day < 1 || day > 31) {
		return VALIDATION_MESSAGES.FORM.DAY_INVALID;
	}

	// Validate actual date existence (month is 0-indexed in Date constructor)
	const inputDate = new Date(year, month - 1, day);

	if (
		inputDate.getFullYear() !== year ||
		inputDate.getMonth() !== month - 1 ||
		inputDate.getDate() !== day
	) {
		return VALIDATION_MESSAGES.FORM.DATE_NOT_EXIST;
	}

	// Check if date is in the future
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	if (inputDate.getTime() > today.getTime()) {
		return VALIDATION_MESSAGES.FORM.FUTURE_DATE;
	}

	return undefined;
}

export function validateDetailsField(details: string): string | undefined {
	return !details.trim()
		? VALIDATION_MESSAGES.FORM.DETAILS_REQUIRED
		: undefined;
}

export function validatePurposeField(purpose: string): string | undefined {
	return !purpose ? VALIDATION_MESSAGES.FORM.PURPOSE_REQUIRED : undefined;
}

export function validateReceiptField(
	receiptImage?: File,
	noImageReason?: string,
): string | undefined {
	return !receiptImage && !noImageReason?.trim()
		? VALIDATION_MESSAGES.FORM.RECEIPT_REQUIRED
		: undefined;
}

export function validateExpenseForm(formData: {
	name: string;
	amount: number;
	date: string;
	details: string;
	purpose: string;
	receiptImage?: File;
	noImageReason?: string;
}) {
	const errors: string[] = [];
	const fieldErrors: Partial<FieldErrors> = {};

	// Validate each field
	const validations = [
		{ field: "name", validator: () => validateNameField(formData.name) },
		{ field: "amount", validator: () => validateAmountField(formData.amount) },
		{ field: "date", validator: () => validateDateField(formData.date) },
		{
			field: "details",
			validator: () => validateDetailsField(formData.details),
		},
		{
			field: "purpose",
			validator: () => validatePurposeField(formData.purpose),
		},
		{
			field: "receipt",
			validator: () =>
				validateReceiptField(formData.receiptImage, formData.noImageReason),
		},
	] as const;

	for (const { field, validator } of validations) {
		const error = validator();
		if (error) {
			fieldErrors[field] = error;
			errors.push(error);
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
		fieldErrors,
	};
}
