export function formatAmount(value: string): string {
	const numbersOnly = value.replace(/[^\d]/g, "");

	if (!numbersOnly) return "";

	const withoutLeadingZeros = numbersOnly.replace(/^0+/, "") || "0";

	return Number(withoutLeadingZeros).toLocaleString();
}

export function parseAmount(formattedValue: string): number {
	const numbersOnly = formattedValue.replace(/[^\d]/g, "");
	return numbersOnly ? Number(numbersOnly) : 0;
}

export function formatFileSize(bytes: number): string {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

export function calculateCompressionRatio(
	originalSize: number,
	compressedSize: number,
): number {
	if (originalSize === 0) return 0;
	return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}
