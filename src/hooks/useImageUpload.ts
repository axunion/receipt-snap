import {
	compressImage,
	createPreviewUrl,
	formatImageFileSize,
} from "@/services/imageService";
import type { CompressionResult } from "@/types/image";
import type { TabType } from "@/types/ui";
import { validateImageFile } from "@/validators/validation";
import { createSignal } from "solid-js";

export function useImageUpload(onImageCapture?: (file: File) => void) {
	const [imagePreview, setImagePreview] = createSignal("");
	const [error, setError] = createSignal("");
	const [warning, setWarning] = createSignal("");
	const [activeTab, setActiveTab] = createSignal<TabType>("camera");

	const handleTabChange = (tab: TabType) => {
		setActiveTab(tab);
	};

	const [isCompressing, setIsCompressing] = createSignal(false);
	const [compressionInfo, setCompressionInfo] =
		createSignal<CompressionResult | null>(null);

	const handleFileSelect = async (file: File) => {
		setError("");
		setWarning("");
		setCompressionInfo(null);

		const validation = validateImageFile(file);
		if (!validation.isValid) {
			setError(validation.error || "Invalid file");
			return;
		}

		if (validation.warning) {
			setWarning(validation.warning);
		}

		const fileSizeMB = file.size / (1024 * 1024);
		console.log(`Processing: ${file.name} (${fileSizeMB.toFixed(1)}MB)`);

		setIsCompressing(true);

		try {
			const { compressedFile, metrics } = await compressImage(file);

			console.log(
				`Compression complete: ${metrics.duration.toFixed(0)}ms, ${formatImageFileSize(metrics.originalSize)} → ${formatImageFileSize(metrics.compressedSize)} (${metrics.compressionRatio}% reduction)`,
			);
			setCompressionInfo({
				originalSize: metrics.originalSize,
				compressedSize: metrics.compressedSize,
				ratio: metrics.compressionRatio,
				duration: metrics.duration,
			});

			setWarning("");

			onImageCapture?.(compressedFile);

			const previewUrl = await createPreviewUrl(compressedFile);
			setImagePreview(previewUrl);
		} catch (compressionError) {
			console.error("Image compression error:", compressionError);
			setError("画像の圧縮に失敗しました。元の画像を使用します。");

			onImageCapture?.(file);

			const previewUrl = await createPreviewUrl(file);
			setImagePreview(previewUrl);
		} finally {
			setIsCompressing(false);
		}
	};

	const clearImage = () => {
		setImagePreview("");
		setError("");
		setWarning("");
		setCompressionInfo(null);
	};

	return {
		imagePreview,
		error,
		warning,
		activeTab,
		isCompressing,
		compressionInfo,
		setActiveTab: handleTabChange,
		handleFileSelect,
		clearImage,
	};
}
