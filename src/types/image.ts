export interface CompressionOptions {
	maxWidth?: number;
	maxHeight?: number;
	quality?: number;
	format?: "image/jpeg" | "image/webp" | "image/png";
}

export interface ImageValidationResult {
	isValid: boolean;
	error?: string;
	warning?: string;
}

export interface CompressionResult {
	originalSize: number;
	compressedSize: number;
	ratio: number;
	duration: number;
}
