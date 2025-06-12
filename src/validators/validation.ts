import type { ImageValidationResult } from "@/types/image";

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
			error: "Only JPEG, PNG, WebP, HEIC/HEIF image files are supported.",
		};
	}

	if (file.size > maxSize) {
		return {
			isValid: false,
			error: "File size must be 100MB or less.",
		};
	}

	// Large file warning
	const fileSizeMB = file.size / (1024 * 1024);
	let warning: string | undefined;

	if (fileSizeMB > 50) {
		warning = "Large file. Processing may take some time.";
	} else if (file.type === "image/heic" || file.type === "image/heif") {
		warning = "HEIC/HEIF file. May not be viewable in all environments.";
	}

	return {
		isValid: true,
		warning,
	};
}

export function validateNameField(name: string): string | undefined {
	if (!name.trim()) {
		return "Name is required.";
	}
	return undefined;
}

export function validateAmountField(amount: number): string | undefined {
	if (Number.isNaN(amount) || amount <= 0) {
		return "Amount must be greater than 0.";
	}
	if (amount > 1000000) {
		return "Amount must be 1,000,000 or less.";
	}
	return undefined;
}

export function validateDateField(dateString: string): string | undefined {
	if (!dateString) {
		return "Payment date is required.";
	}

	const parts = dateString.split("-");
	if (
		parts.length !== 3 ||
		parts[0].length !== 4 ||
		parts[1].length !== 2 ||
		parts[2].length !== 2
	) {
		return "Date must be in YYYY-MM-DD format.";
	}

	const year = Number.parseInt(parts[0], 10);
	const month = Number.parseInt(parts[1], 10); // Month from input (1-12)
	const day = Number.parseInt(parts[2], 10);

	if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
		return "Please use valid numbers for the date.";
	}

	if (month < 1 || month > 12) {
		return "Month must be between 1 and 12.";
	}
	if (day < 1 || day > 31) {
		// Basic check, more complex validation follows
		return "Day must be between 1 and 31.";
	}

	// Create Date object using local time zone at 00:00:00
	// Month in Date constructor is 0-indexed (0-11)
	const inputDate = new Date(year, month - 1, day);

	// Verify that the Date object was not adjusted due to invalid date (e.g., Feb 30th)
	if (
		inputDate.getFullYear() !== year ||
		inputDate.getMonth() !== month - 1 || // Compare with 0-indexed month
		inputDate.getDate() !== day
	) {
		return "Please enter a valid date (e.g., February 30th does not exist).";
	}

	const today = new Date();
	today.setHours(0, 0, 0, 0); // Set to 00:00:00 local time of today

	if (inputDate.getTime() > today.getTime()) {
		return "Future dates are not allowed.";
	}

	return undefined;
}

export function validateCategoryField(category: string): string | undefined {
	if (!category) {
		return "Category is required.";
	}
	return undefined;
}

export function validateReceiptField(
	receiptImage?: File,
	noImageReason?: string,
): string | undefined {
	if (!receiptImage && !noImageReason?.trim()) {
		return "Either a receipt image or a reason for not providing one is required.";
	}
	return undefined;
}

export function validateExpenseForm(data: {
	name: string;
	amount: number;
	date: string;
	category: string;
	receiptImage?: File;
	noImageReason?: string;
}) {
	const errors: string[] = [];
	const nameError = validateNameField(data.name);
	if (nameError) errors.push(nameError);

	const amountError = validateAmountField(data.amount);
	if (amountError) errors.push(amountError);

	const dateError = validateDateField(data.date);
	if (dateError) errors.push(dateError);

	const categoryError = validateCategoryField(data.category);
	if (categoryError) errors.push(categoryError);

	const receiptError = validateReceiptField(
		data.receiptImage,
		data.noImageReason,
	);
	if (receiptError) errors.push(receiptError);

	return {
		isValid: errors.length === 0,
		errors,
		fieldErrors: {
			name: nameError,
			amount: amountError,
			date: dateError,
			category: categoryError,
			receipt: receiptError,
		},
	};
}

export function validateDate(dateString: string): boolean {
	const date = new Date(dateString);
	const now = new Date();

	if (date > now) {
		return false;
	}

	return true;
}

export function validateAmount(amount: number): boolean {
	return !validateAmountField(amount);
}
