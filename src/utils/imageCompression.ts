import {
	CANVAS_SETTINGS,
	QUALITY_PRESETS,
	RESOLUTION_PRESETS,
	SUPPORTED_FORMATS,
} from "@/constants/compression";
import type { CompressionOptions } from "@/types";

/**
 * Compress image file with memory optimization
 */
export async function compressImage(
	file: File,
	options: CompressionOptions = {},
): Promise<File> {
	const {
		maxWidth = RESOLUTION_PRESETS.VERY_HIGH.width,
		maxHeight = RESOLUTION_PRESETS.VERY_HIGH.height,
		quality = QUALITY_PRESETS.STANDARD,
		format = SUPPORTED_FORMATS.OUTPUT_FORMAT,
	} = options;

	return new Promise((resolve, reject) => {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const img = new Image();

		const cleanup = () => {
			try {
				if (img.src?.startsWith("blob:")) {
					URL.revokeObjectURL(img.src);
				}
				canvas.width = 0;
				canvas.height = 0;
			} catch (e) {
				if (import.meta.env.DEV) {
					console.warn("Cleanup error:", e);
				}
			}
		};

		img.onload = () => {
			try {
				const { width, height } = img;
				const { newWidth, newHeight } = calculateNewSize(
					width,
					height,
					maxWidth,
					maxHeight,
				);

				canvas.width = newWidth;
				canvas.height = newHeight;

				if (ctx) {
					ctx.imageSmoothingEnabled = true;
					ctx.imageSmoothingQuality = CANVAS_SETTINGS.SMOOTHING_QUALITY;
					ctx.fillStyle = CANVAS_SETTINGS.BACKGROUND_COLOR;
					ctx.fillRect(0, 0, newWidth, newHeight);
					ctx.drawImage(img, 0, 0, newWidth, newHeight);

					canvas.toBlob(
						(blob) => {
							try {
								if (blob) {
									const compressedFile = new File(
										[blob],
										generateFileName(file.name, format),
										{
											type: format,
											lastModified: Date.now(),
										},
									);
									cleanup();
									resolve(compressedFile);
								} else {
									cleanup();
									reject(new Error("Image compression failed"));
								}
							} catch (error) {
								cleanup();
								reject(error);
							}
						},
						format,
						quality,
					);
				} else {
					cleanup();
					reject(new Error("Failed to get canvas context"));
				}
			} catch (error) {
				cleanup();
				reject(error);
			}
		};

		img.onerror = () => {
			cleanup();
			reject(new Error("Failed to load image"));
		};

		img.src = URL.createObjectURL(file);
	});
}

/**
 * Calculate new size while preserving aspect ratio
 */
function calculateNewSize(
	originalWidth: number,
	originalHeight: number,
	maxWidth: number,
	maxHeight: number,
): { newWidth: number; newHeight: number } {
	let newWidth = originalWidth;
	let newHeight = originalHeight;

	if (newWidth > maxWidth) {
		newHeight = (newHeight * maxWidth) / newWidth;
		newWidth = maxWidth;
	}

	if (newHeight > maxHeight) {
		newWidth = (newWidth * maxHeight) / newHeight;
		newHeight = maxHeight;
	}

	return {
		newWidth: Math.round(newWidth),
		newHeight: Math.round(newHeight),
	};
}

/**
 * Generate compressed filename with new extension
 */
function generateFileName(originalName: string, format: string): string {
	const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
	const extension = format.split("/")[1];
	return `${nameWithoutExt}_compressed.${extension}`;
}

export function getReceiptCompressionOptions(): CompressionOptions {
	return {
		maxWidth: RESOLUTION_PRESETS.VERY_HIGH.width,
		maxHeight: RESOLUTION_PRESETS.VERY_HIGH.height,
		quality: QUALITY_PRESETS.STANDARD,
		format: SUPPORTED_FORMATS.OUTPUT_FORMAT,
	};
}
