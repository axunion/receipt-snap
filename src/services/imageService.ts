import type { CompressionOptions } from "@/types/image";
import {
	calculateCompressionRatio,
	formatFileSize,
	getReceiptCompressionOptions,
	compressImage as utilCompressImage,
} from "@/utils/imageCompression";

/**
 * Compress image with performance metrics
 */
export async function compressImage(
	file: File,
	options?: Partial<CompressionOptions>,
): Promise<{
	compressedFile: File;
	metrics: {
		originalSize: number;
		compressedSize: number;
		compressionRatio: number;
		duration: number;
	};
}> {
	const baseOptions = getReceiptCompressionOptions();
	const finalOptions = { ...baseOptions, ...options };

	const originalSize = file.size;
	const startTime = performance.now();

	try {
		const compressedFile = await utilCompressImage(file, finalOptions);
		const endTime = performance.now();
		const duration = endTime - startTime;

		const compressedSize = compressedFile.size;
		const compressionRatio = calculateCompressionRatio(
			originalSize,
			compressedSize,
		);

		return {
			compressedFile,
			metrics: {
				originalSize,
				compressedSize,
				compressionRatio,
				duration,
			},
		};
	} catch (error) {
		const endTime = performance.now();
		const duration = endTime - startTime;
		console.error(
			`Image compression failed after ${duration.toFixed(2)}ms:`,
			error,
		);
		throw error;
	}
}

export function formatImageFileSize(bytes: number): string {
	return formatFileSize(bytes);
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
