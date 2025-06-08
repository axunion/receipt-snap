import {
	compressImage,
	createPreviewUrl,
	formatImageFileSize,
} from "@/services/imageService";
import type { CompressionResult } from "@/types/image";
import type { TabType } from "@/types/ui";
import { validateImageFile } from "@/validators/validation";
import { createSignal } from "solid-js";

export function useImageUpload(
	onImageCapture?: (file: File) => void,
	onNoImageReason?: (reason: string) => void,
) {
	const [imagePreview, setImagePreview] = createSignal<string>("");
	const [error, setError] = createSignal<string>("");
	const [warning, setWarning] = createSignal<string>("");
	const [activeTab, setActiveTab] = createSignal<TabType>("camera");

	// デバッグ用：タブ変更をログ出力
	const handleTabChange = (tab: TabType) => {
		setActiveTab(tab);
	};
	const [noImageReason, setNoImageReason] = createSignal<string>("");

	const [isCompressing, setIsCompressing] = createSignal<boolean>(false);
	const [compressionProgress, setCompressionProgress] = createSignal<number>(0);
	const [compressionInfo, setCompressionInfo] =
		createSignal<CompressionResult | null>(null);

	const handleFileSelect = async (file: File) => {
		setError("");
		setCompressionInfo(null);
		setCompressionProgress(0);
		setWarning("");

		const validation = validateImageFile(file);
		if (!validation.isValid) {
			setError(validation.error || "ファイルが無効です");
			return;
		}

		if (validation.warning) {
			setWarning(validation.warning);
		}

		const fileSizeMB = file.size / (1024 * 1024);
		console.log(`処理開始: ${file.name} (${fileSizeMB.toFixed(1)}MB)`);

		setIsCompressing(true);

		try {
			// プログレス表示用のコールバック
			const progressCallback = (progress: number) => {
				setCompressionProgress(progress);
			};

			// 画像を圧縮
			const { compressedFile, metrics } = await compressImage(file, {
				progressCallback,
			});

			console.log(
				`圧縮完了: ${metrics.duration.toFixed(0)}ms, ${formatImageFileSize(metrics.originalSize)} → ${formatImageFileSize(metrics.compressedSize)} (${metrics.compressionRatio}%削減)`,
			);

			setCompressionInfo({
				originalSize: metrics.originalSize,
				compressedSize: metrics.compressedSize,
				ratio: metrics.compressionRatio,
				duration: metrics.duration,
			});

			// 圧縮が成功したら警告をクリア
			setWarning("");

			onImageCapture?.(compressedFile);

			// プレビュー画像を作成
			const previewUrl = await createPreviewUrl(compressedFile);
			setImagePreview(previewUrl);
		} catch (compressionError) {
			console.error("画像圧縮エラー:", compressionError);
			setError("画像の圧縮に失敗しました。元の画像を使用します。");

			// 圧縮に失敗した場合は元の画像を使用
			onImageCapture?.(file);

			const previewUrl = await createPreviewUrl(file);
			setImagePreview(previewUrl);
		} finally {
			setIsCompressing(false);
			setCompressionProgress(0);
		}
	};

	// 画像クリア
	const clearImage = () => {
		setImagePreview("");
		setError("");
		setWarning("");
		setNoImageReason("");
		setCompressionInfo(null);
		setCompressionProgress(0);
	};

	// なし理由の変更
	const handleReasonChange = (reason: string) => {
		setNoImageReason(reason);
		if (reason.trim() && onNoImageReason) {
			onNoImageReason(reason.trim());
		}
	};

	// プログレス段階の文字列を取得
	const getProgressStageText = (progress: number): string => {
		if (progress < 30) return "ファイルを読み込み中...";
		if (progress < 60) return "画像をリサイズ中...";
		if (progress < 90) return "圧縮処理中...";
		return "最終処理中...";
	};

	return {
		// State
		imagePreview,
		error,
		warning,
		activeTab,
		noImageReason,
		isCompressing,
		compressionProgress,
		compressionInfo,

		// Actions
		setActiveTab: handleTabChange,
		handleFileSelect,
		clearImage,
		handleReasonChange,

		// Computed
		getProgressStageText,
	};
}
