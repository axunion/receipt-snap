/**
 * 画像処理関連の型定義
 */

export interface CompressionOptions {
	maxWidth?: number;
	maxHeight?: number;
	quality?: number; // 0.1 - 1.0
	format?: "image/jpeg" | "image/webp" | "image/png";
	progressCallback?: (progress: number) => void;
	enablePreshrinkning?: boolean; // 大きなファイル用の段階的圧縮
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

export interface DevicePerformance {
	level: "low" | "medium" | "high";
	cores: number;
	memory: number;
}

export interface ResolutionPreset {
	width: number;
	height: number;
}
