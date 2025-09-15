import {
	CANVAS_SETTINGS,
	QUALITY_PRESETS,
	RESOLUTION_PRESETS,
	SUPPORTED_FORMATS,
} from "@/constants/compression";
import type { CompressionOptions } from "@/types";

/**
 * Check if the file is HEIC/HEIF format
 */
function isHEICFormat(file: File): boolean {
	return (
		file.type === "image/heic" ||
		file.type === "image/heif" ||
		file.name.toLowerCase().endsWith(".heic") ||
		file.name.toLowerCase().endsWith(".heif")
	);
}

/**
 * Compress image file with memory optimization and HEIC support
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

	// Try createImageBitmap first for HEIC/HEIF files
	if (isHEICFormat(file)) {
		try {
			return await compressWithImageBitmap(file, {
				maxWidth,
				maxHeight,
				quality,
				format,
			});
		} catch (error) {
			if (import.meta.env.DEV) {
				console.warn("ImageBitmap fallback failed for HEIC file:", error);
			}
			// If ImageBitmap fails, fall back to regular Image element method
		}
	}

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
			// Provide more specific error message for HEIC files
			if (isHEICFormat(file)) {
				reject(
					new Error(
						"HEIC file format not supported by this browser. Please try a JPEG or PNG file.",
					),
				);
			} else {
				reject(new Error("Failed to load image"));
			}
		};

		img.src = URL.createObjectURL(file);
	});
}

/**
 * Compress image using createImageBitmap API (supports HEIC in some browsers)
 */
async function compressWithImageBitmap(
	file: File,
	options: {
		maxWidth: number;
		maxHeight: number;
		quality: number;
		format: string;
	},
): Promise<File> {
	const { maxWidth, maxHeight, quality, format } = options;

	// Create ImageBitmap from file
	const imageBitmap = await createImageBitmap(file);

	const { width, height } = imageBitmap;
	const { newWidth, newHeight } = calculateNewSize(
		width,
		height,
		maxWidth,
		maxHeight,
	);

	// Create canvas and draw the ImageBitmap
	const canvas = document.createElement("canvas");
	canvas.width = newWidth;
	canvas.height = newHeight;

	const ctx = canvas.getContext("2d");
	if (!ctx) {
		imageBitmap.close();
		throw new Error("Failed to get canvas context");
	}

	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = CANVAS_SETTINGS.SMOOTHING_QUALITY;
	ctx.fillStyle = CANVAS_SETTINGS.BACKGROUND_COLOR;
	ctx.fillRect(0, 0, newWidth, newHeight);
	ctx.drawImage(imageBitmap, 0, 0, newWidth, newHeight);

	// Clean up ImageBitmap
	imageBitmap.close();

	// Convert to blob and return as File
	return new Promise((resolve, reject) => {
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
						canvas.width = 0;
						canvas.height = 0;
						resolve(compressedFile);
					} else {
						reject(new Error("Image compression failed"));
					}
				} catch (error) {
					reject(error);
				}
			},
			format,
			quality,
		);
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
		maxWidth: RESOLUTION_PRESETS.RECEIPT.width,
		maxHeight: RESOLUTION_PRESETS.RECEIPT.height,
		quality: QUALITY_PRESETS.STANDARD,
		format: SUPPORTED_FORMATS.OUTPUT_FORMAT,
	};
}
