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

export function validateExpenseForm(data: {
	name: string;
	amount: number;
	date: string;
	category: string;
	receiptImage?: File;
	noImageReason?: string;
}) {
	const errors: string[] = [];

	if (!data.name.trim()) {
		errors.push("名前は必須です");
	}

	if (data.amount <= 0) {
		errors.push("金額は0より大きい値を入力してください");
	}

	if (!data.date) {
		errors.push("支払日は必須です");
	}

	if (!data.category) {
		errors.push("カテゴリは必須です");
	}

	// Either image or reason is required
	if (!data.receiptImage && !data.noImageReason?.trim()) {
		errors.push("レシート画像またはない理由のどちらかを入力してください");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}

export function validateDate(dateString: string): boolean {
	const date = new Date(dateString);
	const now = new Date();

	// Future dates are invalid
	if (date > now) {
		return false;
	}

	// Dates older than 1 year trigger warning
	const oneYearAgo = new Date();
	oneYearAgo.setFullYear(now.getFullYear() - 1);

	return date >= oneYearAgo;
}

export function validateAmount(amount: number): boolean {
	return amount > 0 && amount <= 1000000; // Max 1M yen
}
