import {
	compressImage,
	createPreviewUrl,
	formatImageFileSize,
} from "@/services/imageService";
import { expenseFormStore } from "@/stores/expenseFormStore";
import type { CompressionResult } from "@/types/image";
import type { TabType } from "@/types/ui";
import { validateImageFile } from "@/utils";
import { createEffect, createSignal } from "solid-js";

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

	// Automatically clear preview when receiptImage in store becomes null
	createEffect(() => {
		if (expenseFormStore.receiptImage() === null) {
			setImagePreview("");
			setError("");
			setWarning("");
			setCompressionInfo(null);
		}
	});

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

		setIsCompressing(true);

		try {
			const { compressedFile, metrics } = await compressImage(file);

			console.log(
				`Compression complete: ${metrics.duration.toFixed(0)}ms, ${formatImageFileSize(metrics.originalSize)} -> ${formatImageFileSize(metrics.compressedSize)} (${metrics.compressionRatio}% reduction)`,
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
			setError("Image compression failed. Using original image.");

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
