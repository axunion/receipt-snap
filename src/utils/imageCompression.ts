import {
	CANVAS_SETTINGS,
	DEVICE_PERFORMANCE,
	FILE_SIZE_THRESHOLDS,
	PROGRESS_STAGES,
	QUALITY_ADJUSTMENTS,
	QUALITY_PRESETS,
	RESOLUTION_PRESETS,
	SUPPORTED_FORMATS,
	TARGET_SETTINGS,
} from "@/constants/compression";

export interface CompressionOptions {
	maxWidth?: number;
	maxHeight?: number;
	quality?: number; // 0.1 - 1.0
	format?: "image/jpeg" | "image/webp" | "image/png";
	progressCallback?: (progress: number) => void;
	enablePreshrinkning?: boolean; // 大きなファイル用の段階的圧縮
}

/**
 * 画像ファイルを圧縮する（メモリ最適化版）
 * @param file 元の画像ファイル
 * @param options 圧縮オプション
 * @returns 圧縮された画像ファイル
 */
export async function compressImage(
	file: File,
	options: CompressionOptions = {},
): Promise<File> {
	const { progressCallback, enablePreshrinkning = true } = options;

	// 大きなファイル（設定値以上）の場合は段階的圧縮を使用
	const fileSizeMB = file.size / (1024 * 1024);
	const isLargeFile = fileSizeMB >= FILE_SIZE_THRESHOLDS.LARGE_FILE;

	if (isLargeFile && enablePreshrinkning) {
		progressCallback?.(PROGRESS_STAGES.START);
		return await compressImageStaged(file, options);
	}

	// 標準の圧縮処理
	return await compressImageStandard(file, options);
}

/**
 * 段階的圧縮（大きなファイル用）
 */
async function compressImageStaged(
	file: File,
	options: CompressionOptions,
): Promise<File> {
	const { progressCallback } = options;

	try {
		progressCallback?.(PROGRESS_STAGES.FIRST_STAGE_START);

		// 第1段階: 粗い圧縮でファイルサイズを大幅に削減
		const firstStageOptions = {
			...options,
			maxWidth: RESOLUTION_PRESETS.FIRST_STAGE.width,
			maxHeight: RESOLUTION_PRESETS.FIRST_STAGE.height,
			quality: QUALITY_PRESETS.FIRST_STAGE,
		};

		const firstStageResult = await compressImageStandard(
			file,
			firstStageOptions,
		);
		progressCallback?.(PROGRESS_STAGES.FIRST_STAGE_COMPLETE);

		// 第1段階で十分小さくなった場合はそのまま返す
		const firstStageLimitBytes =
			FILE_SIZE_THRESHOLDS.FIRST_STAGE_LIMIT * 1024 * 1024;
		if (firstStageResult.size < firstStageLimitBytes) {
			progressCallback?.(PROGRESS_STAGES.QUALITY_ADJUSTED);

			// 第2段階: 最終的な品質調整
			const finalOptions = {
				...options,
				enablePreshrinkning: false, // 無限ループ防止
			};

			const finalResult = await compressImageStandard(
				firstStageResult,
				finalOptions,
			);
			progressCallback?.(PROGRESS_STAGES.COMPLETE);

			return finalResult;
		}

		// まだ大きい場合はより積極的に圧縮
		const aggressiveOptions = {
			...options,
			maxWidth: RESOLUTION_PRESETS.MEDIUM.width,
			maxHeight: RESOLUTION_PRESETS.MEDIUM.height,
			quality: QUALITY_PRESETS.LOW,
			enablePreshrinkning: false,
		};

		progressCallback?.(PROGRESS_STAGES.SECOND_STAGE_COMPLETE);
		const finalResult = await compressImageStandard(
			firstStageResult,
			aggressiveOptions,
		);
		progressCallback?.(PROGRESS_STAGES.COMPLETE);

		return finalResult;
	} catch (error) {
		console.warn("段階的圧縮に失敗、標準圧縮にフォールバック:", error);
		// フォールバック: 標準圧縮を試行
		return await compressImageStandard(file, {
			...options,
			enablePreshrinkning: false,
		});
	}
}

/**
 * 標準の画像圧縮処理
 */
async function compressImageStandard(
	file: File,
	options: CompressionOptions,
): Promise<File> {
	const {
		maxWidth = RESOLUTION_PRESETS.VERY_HIGH.width,
		maxHeight = RESOLUTION_PRESETS.VERY_HIGH.height,
		quality = QUALITY_PRESETS.STANDARD,
		format = SUPPORTED_FORMATS.OUTPUT_FORMAT,
		progressCallback,
	} = options;

	return new Promise((resolve, reject) => {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const img = new Image();

		// メモリリークを防ぐためのクリーンアップ関数
		const cleanup = () => {
			try {
				if (img.src?.startsWith("blob:")) {
					URL.revokeObjectURL(img.src);
				}
				// Canvasをクリア
				canvas.width = 0;
				canvas.height = 0;
			} catch (e) {
				console.warn("クリーンアップエラー:", e);
			}
		};

		img.onload = () => {
			try {
				progressCallback?.(PROGRESS_STAGES.IMAGE_LOADED);

				// 元のサイズを取得
				const { width, height } = img;

				// リサイズ後のサイズを計算
				const { newWidth, newHeight } = calculateNewSize(
					width,
					height,
					maxWidth,
					maxHeight,
				);

				// メモリ使用量をチェック（概算）
				const estimatedMemoryMB =
					(newWidth * newHeight * TARGET_SETTINGS.BYTES_PER_PIXEL) /
					(1024 * 1024); // RGBA
				if (estimatedMemoryMB > TARGET_SETTINGS.MEMORY_WARNING_MB) {
					console.warn(
						`大きなメモリ使用量が予想されます: ${estimatedMemoryMB.toFixed(1)}MB`,
					);
				}

				// Canvasのサイズを設定
				canvas.width = newWidth;
				canvas.height = newHeight;

				progressCallback?.(PROGRESS_STAGES.SIZE_CALCULATED);

				// 高品質な描画設定
				if (ctx) {
					ctx.imageSmoothingEnabled = true;
					ctx.imageSmoothingQuality = CANVAS_SETTINGS.SMOOTHING_QUALITY;

					// レシート用の画像最適化
					// 白背景を設定（透明背景の場合に有効）
					ctx.fillStyle = CANVAS_SETTINGS.BACKGROUND_COLOR;
					ctx.fillRect(0, 0, newWidth, newHeight);

					// 画像を描画
					ctx.drawImage(img, 0, 0, newWidth, newHeight);

					progressCallback?.(PROGRESS_STAGES.CANVAS_READY);

					// 動的品質調整: 元ファイルサイズと出力サイズの両方を考慮
					const targetSizeKB = TARGET_SETTINGS.TARGET_SIZE_KB;
					const originalSizeKB = file.size / 1024;
					const estimatedSizeKB =
						(newWidth * newHeight * TARGET_SETTINGS.COMPRESSION_RATIO_FACTOR) /
						1024; // RGB推定

					let adjustedQuality = quality;

					// 元ファイルが大きい場合はより積極的に圧縮
					const largeSizeKB = FILE_SIZE_THRESHOLDS.AGGRESSIVE_QUALITY * 1024;
					const mediumSizeKB = FILE_SIZE_THRESHOLDS.MODERATE_QUALITY * 1024;

					if (originalSizeKB > largeSizeKB) {
						adjustedQuality = Math.max(
							QUALITY_ADJUSTMENTS.MIN_QUALITY,
							quality - QUALITY_ADJUSTMENTS.LARGE_FILE_REDUCTION,
						);
					} else if (originalSizeKB > mediumSizeKB) {
						adjustedQuality = Math.max(
							QUALITY_ADJUSTMENTS.MIN_QUALITY,
							quality - QUALITY_ADJUSTMENTS.MEDIUM_FILE_REDUCTION,
						);
					} else if (estimatedSizeKB > targetSizeKB * 2) {
						adjustedQuality = Math.max(
							QUALITY_ADJUSTMENTS.MIN_QUALITY,
							quality - QUALITY_ADJUSTMENTS.MEDIUM_FILE_REDUCTION,
						);
					}

					progressCallback?.(PROGRESS_STAGES.QUALITY_ADJUSTED);

					// Blobに変換
					canvas.toBlob(
						(blob) => {
							try {
								if (blob) {
									// 新しいFileオブジェクトを作成
									const compressedFile = new File(
										[blob],
										generateFileName(file.name, format),
										{
											type: format,
											lastModified: Date.now(),
										},
									);
									progressCallback?.(PROGRESS_STAGES.COMPLETE);
									cleanup();
									resolve(compressedFile);
								} else {
									cleanup();
									reject(new Error("画像の圧縮に失敗しました"));
								}
							} catch (error) {
								cleanup();
								reject(error);
							}
						},
						format,
						adjustedQuality,
					);
				} else {
					cleanup();
					reject(new Error("Canvas context の取得に失敗しました"));
				}
			} catch (error) {
				cleanup();
				reject(error);
			}
		};

		img.onerror = () => {
			cleanup();
			reject(new Error("画像の読み込みに失敗しました"));
		};

		// 画像を読み込み
		progressCallback?.(PROGRESS_STAGES.START);
		img.src = URL.createObjectURL(file);
	});
}

/**
 * アスペクト比を保持しながら新しいサイズを計算
 */
function calculateNewSize(
	originalWidth: number,
	originalHeight: number,
	maxWidth: number,
	maxHeight: number,
): { newWidth: number; newHeight: number } {
	let newWidth = originalWidth;
	let newHeight = originalHeight;

	// 最大幅を超える場合
	if (newWidth > maxWidth) {
		newHeight = (newHeight * maxWidth) / newWidth;
		newWidth = maxWidth;
	}

	// 最大高さを超える場合
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
 * ファイル名を生成（拡張子を新しい形式に変更）
 */
function generateFileName(originalName: string, format: string): string {
	const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
	const extension = format.split("/")[1];
	return `${nameWithoutExt}_compressed.${extension}`;
}

/**
 * ファイルサイズを人間が読みやすい形式でフォーマット
 */
export function formatFileSize(bytes: number): string {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

/**
 * 圧縮率を計算
 */
export function calculateCompressionRatio(
	originalSize: number,
	compressedSize: number,
): number {
	if (originalSize === 0) return 0;
	return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}

/**
 * 圧縮処理のパフォーマンス測定
 */
export function measureCompressionPerformance<T>(
	operation: () => Promise<T>,
	operationName: string,
): Promise<{ result: T; duration: number }> {
	const startTime = performance.now();

	return operation().then((result) => {
		const endTime = performance.now();
		const duration = endTime - startTime;

		console.log(`${operationName}: ${duration.toFixed(2)}ms`);

		return { result, duration };
	});
}

/**
 * 最適な解像度を計算（メモリ効率を考慮）
 */
export function calculateOptimalResolution(
	originalWidth: number,
	originalHeight: number,
	targetSizeKB: number = TARGET_SETTINGS.TARGET_SIZE_KB,
	maxMemoryMB: number = TARGET_SETTINGS.MEMORY_WARNING_MB,
): { width: number; height: number } {
	// アスペクト比を保持
	const aspectRatio = originalWidth / originalHeight;

	// メモリ制限から最大ピクセル数を計算
	const maxPixels =
		(maxMemoryMB * 1024 * 1024) / TARGET_SETTINGS.BYTES_PER_PIXEL;

	// 目標ファイルサイズから推奨ピクセル数を計算
	const targetPixels =
		(targetSizeKB * 1024) / TARGET_SETTINGS.COMPRESSION_RATIO_FACTOR;

	// より厳しい制限を採用
	const limitPixels = Math.min(maxPixels, targetPixels);

	// 新しい解像度を計算
	let newWidth = Math.sqrt(limitPixels * aspectRatio);
	let newHeight = limitPixels / newWidth;

	// 整数に丸める
	newWidth = Math.round(newWidth);
	newHeight = Math.round(newHeight);

	// 元のサイズより大きくならないようにする
	if (newWidth > originalWidth || newHeight > originalHeight) {
		return { width: originalWidth, height: originalHeight };
	}

	return { width: newWidth, height: newHeight };
}

/**
 * レシート用の推奨圧縮設定を取得
 */
export function getReceiptCompressionOptions(): CompressionOptions {
	return {
		maxWidth: RESOLUTION_PRESETS.VERY_HIGH.width,
		maxHeight: RESOLUTION_PRESETS.VERY_HIGH.height,
		quality: QUALITY_PRESETS.STANDARD,
		format: SUPPORTED_FORMATS.OUTPUT_FORMAT,
		enablePreshrinkning: true,
	};
}

/**
 * ファイルサイズベースの動的圧縮設定を取得
 */
export function getDynamicCompressionOptions(
	fileSizeMB: number,
): CompressionOptions {
	if (fileSizeMB >= FILE_SIZE_THRESHOLDS.VERY_LARGE_FILE) {
		// 非常に大きなファイル
		return {
			maxWidth: RESOLUTION_PRESETS.MEDIUM.width,
			maxHeight: RESOLUTION_PRESETS.MEDIUM.height,
			quality: QUALITY_PRESETS.VERY_LOW,
			format: SUPPORTED_FORMATS.OUTPUT_FORMAT,
			enablePreshrinkning: true,
		};
	}

	if (fileSizeMB >= FILE_SIZE_THRESHOLDS.LARGE_FILE) {
		// 大きなファイル
		return {
			maxWidth: RESOLUTION_PRESETS.HIGH.width,
			maxHeight: RESOLUTION_PRESETS.HIGH.height,
			quality: QUALITY_PRESETS.LOW,
			format: SUPPORTED_FORMATS.OUTPUT_FORMAT,
			enablePreshrinkning: true,
		};
	}

	if (fileSizeMB >= FILE_SIZE_THRESHOLDS.MEDIUM_FILE) {
		// 中程度のファイル
		return {
			maxWidth: RESOLUTION_PRESETS.VERY_HIGH.width,
			maxHeight: RESOLUTION_PRESETS.VERY_HIGH.height,
			quality: QUALITY_PRESETS.MEDIUM,
			format: SUPPORTED_FORMATS.OUTPUT_FORMAT,
			enablePreshrinkning: false,
		};
	}

	// 標準的なファイル
	return getReceiptCompressionOptions();
}

/**
 * メモリ使用量を推定
 */
export function estimateMemoryUsage(width: number, height: number): number {
	// RGBA + Canvas処理用のオーバーヘッド
	return (
		(width *
			height *
			TARGET_SETTINGS.BYTES_PER_PIXEL *
			TARGET_SETTINGS.MEMORY_OVERHEAD_FACTOR) /
		(1024 * 1024)
	); // MB単位
}

/**
 * デバイスの性能を簡易的に判定
 */
export function getDevicePerformanceLevel(): "low" | "medium" | "high" {
	if (typeof navigator === "undefined") return "medium";

	// 利用可能なコア数とメモリを基に判定
	const cores =
		navigator.hardwareConcurrency || DEVICE_PERFORMANCE.DEFAULT_CORES;
	const memory =
		(navigator as { deviceMemory?: number }).deviceMemory ||
		DEVICE_PERFORMANCE.DEFAULT_MEMORY_GB; // GB

	if (
		cores >= DEVICE_PERFORMANCE.HIGH_CORES &&
		memory >= DEVICE_PERFORMANCE.HIGH_MEMORY_GB
	)
		return "high";
	if (
		cores >= DEVICE_PERFORMANCE.MEDIUM_CORES &&
		memory >= DEVICE_PERFORMANCE.MEDIUM_MEMORY_GB
	)
		return "medium";
	return "low";
}

/**
 * デバイス性能に基づいて圧縮設定を調整
 */
export function getPerformanceAdjustedOptions(
	baseOptions: CompressionOptions,
	fileSizeMB: number,
): CompressionOptions {
	const performance = getDevicePerformanceLevel();
	const adjustedOptions = { ...baseOptions };

	if (performance === "low") {
		// 低性能デバイスではより積極的に圧縮
		adjustedOptions.maxWidth = Math.min(
			adjustedOptions.maxWidth || RESOLUTION_PRESETS.VERY_HIGH.width,
			RESOLUTION_PRESETS.MEDIUM.width,
		);
		adjustedOptions.maxHeight = Math.min(
			adjustedOptions.maxHeight || RESOLUTION_PRESETS.VERY_HIGH.height,
			RESOLUTION_PRESETS.MEDIUM.height,
		);
		adjustedOptions.quality = Math.max(
			(adjustedOptions.quality || QUALITY_PRESETS.STANDARD) -
				QUALITY_ADJUSTMENTS.LOW_PERFORMANCE_REDUCTION,
			QUALITY_ADJUSTMENTS.MIN_QUALITY,
		);

		// 大きなファイルは段階的圧縮を無効化してメモリを節約
		if (fileSizeMB > FILE_SIZE_THRESHOLDS.MEMORY_LIMIT) {
			adjustedOptions.enablePreshrinkning = false;
		}
	} else if (performance === "high") {
		// 高性能デバイスでは品質を優先
		adjustedOptions.quality = Math.min(
			(adjustedOptions.quality || QUALITY_PRESETS.STANDARD) +
				QUALITY_ADJUSTMENTS.HIGH_PERFORMANCE_BOOST,
			QUALITY_ADJUSTMENTS.MAX_QUALITY,
		);
	}

	return adjustedOptions;
}
