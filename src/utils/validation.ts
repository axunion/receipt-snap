import { VALIDATION_MESSAGES } from "@/constants/validationMessages";
import type { FieldErrors, ImageValidationResult } from "@/types";

export function validateImageFile(file: File): ImageValidationResult {
	// Mobile-first policy: allow JPEG/PNG/HEIC, size <=12MB, warn >6MB, info for HEIC conversion
	const MAX_SIZE_BYTES = 12 * 1024 * 1024;
	const WARNING_THRESHOLD_BYTES = 6 * 1024 * 1024;
	const allowedTypes = [
		"image/jpeg",
		"image/jpg",
		"image/png",
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

// Consolidated field validation function
export function validateField(
	field: keyof FieldErrors,
	value: string | number | File | null,
	extraValue?: string,
): string | undefined {
	switch (field) {
		case "name": {
			const name = value as string;
			return !name.trim() ? VALIDATION_MESSAGES.FORM.NAME_REQUIRED : undefined;
		}

		case "amount": {
			const amount = value as number;
			if (Number.isNaN(amount) || amount <= 0) {
				return VALIDATION_MESSAGES.FORM.AMOUNT_INVALID;
			}
			if (amount > 1000000) {
				return VALIDATION_MESSAGES.FORM.AMOUNT_TOO_LARGE;
			}
			return undefined;
		}

		case "date": {
			const dateString = value as string;
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

		case "details": {
			const details = value as string;
			return !details.trim()
				? VALIDATION_MESSAGES.FORM.DETAILS_REQUIRED
				: undefined;
		}

		case "destination": {
			const destination = value as string;
			return !destination
				? VALIDATION_MESSAGES.FORM.DESTINATION_REQUIRED
				: undefined;
		}

		case "receipt": {
			const receiptFile = value as File | null;
			return !receiptFile && !extraValue?.trim()
				? VALIDATION_MESSAGES.FORM.RECEIPT_REQUIRED
				: undefined;
		}

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
