import type { CompressionOptions } from "@/types/image";
import {
	calculateCompressionRatio,
	formatFileSize,
	getReceiptCompressionOptions,
	compressImage as utilCompressImage,
} from "@/utils";
import { measureAsync } from "./performanceService";

export async function compressImage(
	file: File,
	options?: Partial<CompressionOptions>,
) {
	const baseOptions = getReceiptCompressionOptions();
	const finalOptions = { ...baseOptions, ...options };

	const { result: compressedFile, duration } = await measureAsync(
		() => utilCompressImage(file, finalOptions),
		"Image compression",
	);

	const compressionRatio = calculateCompressionRatio(
		file.size,
		compressedFile.size,
	);

	return {
		compressedFile,
		metrics: {
			originalSize: file.size,
			compressedSize: compressedFile.size,
			compressionRatio,
			duration,
		},
	};
}

export function isImageFile(file: File): boolean {
	return file.type.startsWith("image/");
}

export function createPreviewUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => resolve(e.target?.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

export function revokePreviewUrl(url: string): void {
	if (url.startsWith("blob:")) {
		URL.revokeObjectURL(url);
	}
}

export const formatImageFileSize = formatFileSize;
