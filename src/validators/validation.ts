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

	// 大きなファイルに対する警告
	const fileSizeMB = file.size / (1024 * 1024);
	let warning: string | undefined;

	if (fileSizeMB > 50) {
		warning = "大きなファイルです。圧縮処理に時間がかかる場合があります。";
	} else if (fileSizeMB > 80) {
		warning =
			"非常に大きなファイルです。段階的圧縮を行い、処理時間がかかります。";
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
}): { isValid: boolean; errors: string[] } {
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

	// 画像またはなし理由のどちらかが必要
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

	// 未来の日付は無効
	if (date > now) {
		return false;
	}

	// 1年以上前の日付は警告
	const oneYearAgo = new Date();
	oneYearAgo.setFullYear(now.getFullYear() - 1);

	return date >= oneYearAgo;
}

export function validateAmount(amount: number): boolean {
	return amount > 0 && amount <= 1000000; // 100万円以下
}
