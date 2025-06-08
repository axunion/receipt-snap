import type { CompressionOptions } from "@/types/image";
import {
	calculateCompressionRatio,
	formatFileSize,
	getDynamicCompressionOptions,
	getPerformanceAdjustedOptions,
	measureCompressionPerformance,
	compressImage as utilCompressImage,
} from "@/utils/imageCompression";

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
	const fileSizeMB = file.size / (1024 * 1024);

	// 最適な圧縮設定を取得
	const baseOptions = getDynamicCompressionOptions(fileSizeMB);
	const finalOptions = getPerformanceAdjustedOptions(
		{ ...baseOptions, ...options },
		fileSizeMB,
	);

	// 圧縮実行
	const originalSize = file.size;
	const { result: compressedFile, duration } =
		await measureCompressionPerformance(
			() => utilCompressImage(file, finalOptions),
			`画像圧縮 (${fileSizeMB.toFixed(1)}MB)`,
		);

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
