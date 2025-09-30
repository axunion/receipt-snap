export function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result;
			if (typeof result === "string") {
				const base64 = result.split(",")[1] || "";
				resolve(base64);
			} else {
				reject(new Error("Failed to convert file to base64"));
			}
		};
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(file);
	});
}

export function isHEICFormat(file: File): boolean {
	return (
		file.type === "image/heic" ||
		file.type === "image/heif" ||
		file.name.toLowerCase().endsWith(".heic") ||
		file.name.toLowerCase().endsWith(".heif")
	);
}

export function generateCompressedFileName(
	originalName: string,
	format: string,
): string {
	const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
	const extension = format.split("/")[1];
	return `${nameWithoutExt}_compressed.${extension}`;
}

export function formatFileSize(bytes: number): string {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

export function calculateRatio(
	originalSize: number,
	compressedSize: number,
): number {
	if (originalSize === 0) return 0;
	return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}
