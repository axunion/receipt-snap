import {
	AMOUNT_LIMITS,
	DATE_LIMITS,
	FILE_SIZE_LIMITS,
} from "@/constants/validation";
import { VALIDATION_MESSAGES } from "@/constants/validationMessages";
import type { FieldErrors, ImageValidationResult } from "@/types";

export function validateImageFile(file: File): ImageValidationResult {
	// Mobile-first policy: allow JPEG/PNG/HEIC, size <=12MB, warn >6MB, info for HEIC conversion
	const { MAX_SIZE_BYTES, WARNING_THRESHOLD_BYTES } = FILE_SIZE_LIMITS;
	const allowedTypes = [
		"image/jpeg",
		"image/jpg",
		"image/png",
		"image/webp",
		"image/heic",
		"image/heif",
	];

	if (!allowedTypes.includes(file.type)) {
		return { isValid: false, error: VALIDATION_MESSAGES.IMAGE.INVALID_TYPE };
	}

	if (file.size > MAX_SIZE_BYTES) {
		return { isValid: false, error: VALIDATION_MESSAGES.IMAGE.FILE_TOO_LARGE };
	}

	const isLarge = file.size > WARNING_THRESHOLD_BYTES;
	const isHeic = file.type === "image/heic" || file.type === "image/heif";

	return {
		isValid: true,
		warning: isLarge ? VALIDATION_MESSAGES.IMAGE.LARGE_FILE_WARNING : undefined,
		info: isHeic ? VALIDATION_MESSAGES.IMAGE.HEIC_INFO : undefined,
	};
}

export function validateName(value: string): string | undefined {
	return !value.trim() ? VALIDATION_MESSAGES.FORM.NAME_REQUIRED : undefined;
}

export function validateAmount(value: number): string | undefined {
	if (Number.isNaN(value) || value <= AMOUNT_LIMITS.MIN_AMOUNT) {
		return VALIDATION_MESSAGES.FORM.AMOUNT_INVALID;
	}
	if (value > AMOUNT_LIMITS.MAX_AMOUNT) {
		return VALIDATION_MESSAGES.FORM.AMOUNT_TOO_LARGE;
	}
	return undefined;
}

export function validateDate(value: string): string | undefined {
	if (!value) {
		return VALIDATION_MESSAGES.FORM.DATE_REQUIRED;
	}

	const parts = value.split("-");
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

	if (month < DATE_LIMITS.MIN_MONTH || month > DATE_LIMITS.MAX_MONTH) {
		return VALIDATION_MESSAGES.FORM.MONTH_INVALID;
	}
	if (day < DATE_LIMITS.MIN_DAY || day > DATE_LIMITS.MAX_DAY) {
		return VALIDATION_MESSAGES.FORM.DAY_INVALID;
	}

	const inputDate = new Date(year, month - 1, day);

	if (
		inputDate.getFullYear() !== year ||
		inputDate.getMonth() !== month - 1 ||
		inputDate.getDate() !== day
	) {
		return VALIDATION_MESSAGES.FORM.DATE_NOT_EXIST;
	}

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	if (inputDate.getTime() > today.getTime()) {
		return VALIDATION_MESSAGES.FORM.FUTURE_DATE;
	}

	return undefined;
}

export function validateDetails(value: string): string | undefined {
	return !value.trim() ? VALIDATION_MESSAGES.FORM.DETAILS_REQUIRED : undefined;
}

export function validateDestination(value: string): string | undefined {
	return !value ? VALIDATION_MESSAGES.FORM.DESTINATION_REQUIRED : undefined;
}

export function validateReceipt(
	file: File | null,
	noImageReason: string,
): string | undefined {
	return !file && !noImageReason.trim()
		? VALIDATION_MESSAGES.FORM.RECEIPT_REQUIRED
		: undefined;
}

// Wrapper for backward compatibility with useExpenseForm and validateForm
export function validateField(
	field: keyof FieldErrors,
	value: string | number | File | null,
	extraValue?: string,
): string | undefined {
	switch (field) {
		case "name":
			return validateName(value as string);
		case "amount":
			return validateAmount(value as number);
		case "date":
			return validateDate(value as string);
		case "details":
			return validateDetails(value as string);
		case "destination":
			return validateDestination(value as string);
		case "receipt":
			return validateReceipt(value as File | null, extraValue ?? "");
		default:
			return undefined;
	}
}

export function validateForm(formData: {
	name: string;
	amount: number;
	date: string;
	details: string;
	destination: string;
	receiptFile: File | null;
	noImageReason: string;
}) {
	const errors: string[] = [];
	const fieldErrors: Partial<FieldErrors> = {};

	// Validate each field using the consolidated function
	const fields: Array<{
		field: keyof FieldErrors;
		value: string | number | File | null;
		extra?: string;
	}> = [
		{ field: "name", value: formData.name },
		{ field: "amount", value: formData.amount },
		{ field: "date", value: formData.date },
		{ field: "details", value: formData.details },
		{ field: "destination", value: formData.destination },
		{
			field: "receipt",
			value: formData.receiptFile,
			extra: formData.noImageReason,
		},
	];

	for (const { field, value, extra } of fields) {
		const error = validateField(field, value, extra);
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
