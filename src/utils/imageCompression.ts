import {
	CANVAS_SETTINGS,
	QUALITY_PRESETS,
	RESOLUTION_PRESETS,
	SUPPORTED_FORMATS,
} from "@/constants/compression";
import type { CompressionOptions } from "@/types";
import { generateCompressedFileName, isHEICFormat } from "./";

function setupCanvas(
	width: number,
	height: number,
): {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
} {
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;

	const ctx = canvas.getContext("2d");
	if (!ctx) {
		throw new Error("Failed to get canvas context");
	}

	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = CANVAS_SETTINGS.SMOOTHING_QUALITY;
	ctx.fillStyle = CANVAS_SETTINGS.BACKGROUND_COLOR;
	ctx.fillRect(0, 0, width, height);

	return { canvas, ctx };
}

function cleanupResources(canvas: HTMLCanvasElement, imageUrl?: string): void {
	try {
		if (imageUrl?.startsWith("blob:")) {
			URL.revokeObjectURL(imageUrl);
		}
		canvas.width = 0;
		canvas.height = 0;
	} catch (e) {
		if (import.meta.env.DEV) {
			console.warn("Cleanup error:", e);
		}
	}
}

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
		const img = new Image();

		const cleanup = (canvas?: HTMLCanvasElement) => {
			if (canvas) {
				cleanupResources(canvas, img.src);
			} else {
				cleanupResources(document.createElement("canvas"), img.src);
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

				const { canvas, ctx } = setupCanvas(newWidth, newHeight);
				ctx.drawImage(img, 0, 0, newWidth, newHeight);

				canvas.toBlob(
					(blob) => {
						try {
							if (blob) {
								const compressedFile = new File(
									[blob],
									generateCompressedFileName(file.name, format),
									{
										type: format,
										lastModified: Date.now(),
									},
								);
								cleanup(canvas);
								resolve(compressedFile);
							} else {
								cleanup(canvas);
								reject(new Error("Image compression failed"));
							}
						} catch (error) {
							cleanup(canvas);
							reject(error);
						}
					},
					format,
					quality,
				);
			} catch (error) {
				cleanup();
				reject(error);
			}
		};

		img.onerror = () => {
			cleanup();
			const errorMsg = isHEICFormat(file)
				? "HEIC file format not supported by this browser. Please try a JPEG or PNG file."
				: "Failed to load image";
			reject(new Error(errorMsg));
		};

		img.src = URL.createObjectURL(file);
	});
}

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

	try {
		const { width, height } = imageBitmap;
		const { newWidth, newHeight } = calculateNewSize(
			width,
			height,
			maxWidth,
			maxHeight,
		);

		// Create canvas and draw the ImageBitmap
		const { canvas, ctx } = setupCanvas(newWidth, newHeight);
		ctx.drawImage(imageBitmap, 0, 0, newWidth, newHeight);

		// Convert to blob and return as File
		return new Promise((resolve, reject) => {
			canvas.toBlob(
				(blob) => {
					try {
						if (blob) {
							const compressedFile = new File(
								[blob],
								generateCompressedFileName(file.name, format),
								{
									type: format,
									lastModified: Date.now(),
								},
							);
							cleanupResources(canvas);
							resolve(compressedFile);
						} else {
							cleanupResources(canvas);
							reject(new Error("Image compression failed"));
						}
					} catch (error) {
						cleanupResources(canvas);
						reject(error);
					}
				},
				format,
				quality,
			);
		});
	} finally {
		// Always clean up ImageBitmap
		imageBitmap.close();
	}
}

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

export function getCompressionOptions(): CompressionOptions {
	return {
		maxWidth: RESOLUTION_PRESETS.RECEIPT.width,
		maxHeight: RESOLUTION_PRESETS.RECEIPT.height,
		quality: QUALITY_PRESETS.STANDARD,
		format: SUPPORTED_FORMATS.OUTPUT_FORMAT,
	};
}
