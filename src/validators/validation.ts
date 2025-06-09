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
			error: "JPEG、PNG、WebP、HEIC/HEIF形式の画像ファイルのみ対応しています",
		};
	}

	if (file.size > maxSize) {
		return {
			isValid: false,
			error: "ファイルサイズは100MB以下にしてください",
		};
	}

	// Large file warning
	const fileSizeMB = file.size / (1024 * 1024);
	let warning: string | undefined;

	if (fileSizeMB > 50) {
		warning = "大きなファイルです。処理に時間がかかる場合があります。";
	} else if (file.type === "image/heic" || file.type === "image/heif") {
		warning =
			"HEIC/HEIF形式のファイルです。一部の環境で表示できない場合があります。";
	}

	return {
		isValid: true,
		warning,
	};
}

export function validateNameField(name: string): string | undefined {
	if (!name.trim()) {
		return "名前は必須です";
	}
	return undefined;
}

export function validateAmountField(amount: number): string | undefined {
	if (Number.isNaN(amount) || amount <= 0) {
		return "金額は0より大きい値を入力してください";
	}
	if (amount > 1000000) {
		return "金額は1,000,000円以下で入力してください";
	}
	return undefined;
}

export function validateDateField(dateString: string): string | undefined {
	if (!dateString) {
		return "支払日は必須です";
	}

	const parts = dateString.split("-");
	if (
		parts.length !== 3 ||
		parts[0].length !== 4 ||
		parts[1].length !== 2 ||
		parts[2].length !== 2
	) {
		return "日付はYYYY-MM-DD形式で入力してください";
	}

	const year = Number.parseInt(parts[0], 10);
	const month = Number.parseInt(parts[1], 10); // Month from input (1-12)
	const day = Number.parseInt(parts[2], 10);

	if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
		return "有効な数値を日付に使用してください";
	}

	if (month < 1 || month > 12) {
		return "月は1から12の間で入力してください";
	}
	if (day < 1 || day > 31) {
		// Basic check, more complex validation follows
		return "日は1から31の間で入力してください";
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
		return "有効な日付を入力してください (例: 2月30日は存在しません)";
	}

	const today = new Date();
	today.setHours(0, 0, 0, 0); // Set to 00:00:00 local time of today

	if (inputDate.getTime() > today.getTime()) {
		return "未来の日付は入力できません";
	}

	return undefined;
}

export function validateCategoryField(category: string): string | undefined {
	if (!category) {
		return "カテゴリは必須です";
	}
	return undefined;
}

export function validateReceiptField(
	receiptImage?: File,
	noImageReason?: string,
): string | undefined {
	if (!receiptImage && !noImageReason?.trim()) {
		return "レシート画像または入力しない理由のどちらかを入力してください";
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

	// Future dates are invalid
	if (date > now) {
		return false;
	}

	// Dates older than 1 year trigger warning - this logic is not used for blocking errors anymore
	// const oneYearAgo = new Date();
	// oneYearAgo.setFullYear(now.getFullYear() - 1);
	// return date >= oneYearAgo;
	return true; // Simplified as detailed validation is in validateDateField
}

export function validateAmount(amount: number): boolean {
	// return amount > 0 && amount <= 1000000; // Max 1M yen - Simplified as detailed validation is in validateAmountField
	return !validateAmountField(amount);
}
