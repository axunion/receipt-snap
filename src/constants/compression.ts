/**
 * 画像圧縮関連の定数定義
 */

// ファイルサイズの閾値（MB）
export const FILE_SIZE_THRESHOLDS = {
	LARGE_FILE: 50, // 段階的圧縮を開始するサイズ
	VERY_LARGE_FILE: 80, // 非常に積極的な圧縮が必要なサイズ
	MEDIUM_FILE: 20, // 中程度の圧縮が必要なサイズ
	AGGRESSIVE_QUALITY: 10, // より積極的な品質調整を行うサイズ
	MODERATE_QUALITY: 5, // 適度な品質調整を行うサイズ
	FIRST_STAGE_LIMIT: 5, // 第1段階圧縮の目標サイズ
	MEMORY_LIMIT: 30, // 低性能デバイスでの段階的圧縮無効化サイズ
} as const;

// 画像の解像度設定
export const RESOLUTION_PRESETS = {
	VERY_HIGH: { width: 800, height: 1200 }, // 標準品質
	HIGH: { width: 700, height: 1000 }, // 高圧縮
	MEDIUM: { width: 600, height: 900 }, // 中圧縮
	LOW: { width: 600, height: 900 }, // 積極的圧縮
	FIRST_STAGE: { width: 1200, height: 1800 }, // 段階的圧縮の第1段階
} as const;

// JPEG品質設定
export const QUALITY_PRESETS = {
	HIGH: 0.9, // 高品質
	STANDARD: 0.7, // 標準品質
	MEDIUM: 0.5, // 中品質
	LOW: 0.4, // 低品質
	VERY_LOW: 0.3, // 最低品質
	FIRST_STAGE: 0.5, // 段階的圧縮の第1段階
} as const;

// 品質調整の設定
export const QUALITY_ADJUSTMENTS = {
	LARGE_FILE_REDUCTION: 0.3, // 大きなファイルの品質削減量
	MEDIUM_FILE_REDUCTION: 0.2, // 中程度ファイルの品質削減量
	LOW_PERFORMANCE_REDUCTION: 0.2, // 低性能デバイスでの品質削減量
	HIGH_PERFORMANCE_BOOST: 0.1, // 高性能デバイスでの品質向上量
	MIN_QUALITY: 0.3, // 最低品質の下限
	MAX_QUALITY: 0.9, // 最高品質の上限
} as const;

// 目標サイズとメモリ設定
export const TARGET_SETTINGS = {
	TARGET_SIZE_KB: 500, // 目標ファイルサイズ（KB）
	MEMORY_WARNING_MB: 500, // メモリ使用量警告の閾値（MB）
	BYTES_PER_PIXEL: 4, // RGBA形式のバイト数
	MEMORY_OVERHEAD_FACTOR: 2, // Canvas処理用のメモリオーバーヘッド係数
	COMPRESSION_RATIO_FACTOR: 3, // RGB推定用の係数
} as const;

// デバイス性能判定の閾値
export const DEVICE_PERFORMANCE = {
	HIGH_CORES: 8, // 高性能判定のCPUコア数
	HIGH_MEMORY_GB: 8, // 高性能判定のメモリサイズ（GB）
	MEDIUM_CORES: 4, // 中性能判定のCPUコア数
	MEDIUM_MEMORY_GB: 4, // 中性能判定のメモリサイズ（GB）
	DEFAULT_CORES: 2, // デフォルトのCPUコア数
	DEFAULT_MEMORY_GB: 4, // デフォルトのメモリサイズ（GB）
} as const;

// ファイル形式とサポート
export const SUPPORTED_FORMATS = {
	OUTPUT_FORMAT: "image/jpeg" as const,
	SUPPORTED_INPUTS: [
		"image/jpeg",
		"image/jpg",
		"image/png",
		"image/webp",
		"image/heic",
		"image/heif",
	] as const,
	FILE_EXTENSIONS: [
		".jpg",
		".jpeg",
		".png",
		".webp",
		".heic",
		".heif",
	] as const,
} as const;

// Canvas設定
export const CANVAS_SETTINGS = {
	BACKGROUND_COLOR: "#ffffff", // 白背景
	SMOOTHING_QUALITY: "high" as ImageSmoothingQuality,
} as const;

// プログレス段階
export const PROGRESS_STAGES = {
	START: 10,
	IMAGE_LOADED: 30,
	SIZE_CALCULATED: 50,
	CANVAS_READY: 70,
	QUALITY_ADJUSTED: 80,
	FIRST_STAGE_START: 20,
	FIRST_STAGE_COMPLETE: 60,
	SECOND_STAGE_COMPLETE: 90,
	COMPLETE: 100,
} as const;
