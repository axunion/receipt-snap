import { expenseFormStore } from "@/stores";
import type { CompressionResult, TabType } from "@/types";
import {
	calculateCompressionRatio,
	compressImage,
	formatFileSize,
	getReceiptCompressionOptions,
	validateImageFile,
} from "@/utils";
import { createEffect, createSignal } from "solid-js";

// Helper function for creating preview URLs
function createPreviewUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => resolve(e.target?.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

export function useImage(onImageCapture?: (file: File) => void) {
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
			const baseOptions = getReceiptCompressionOptions();
			const compressedFile = await compressImage(file, baseOptions);

			const compressionRatio = calculateCompressionRatio(
				file.size,
				compressedFile.size,
			);

			if (import.meta.env.DEV) {
				console.log(
					`Image compression complete: ${formatFileSize(file.size)} -> ${formatFileSize(compressedFile.size)} (${compressionRatio}% reduction)`,
				);
			}

			setCompressionInfo({
				originalSize: file.size,
				compressedSize: compressedFile.size,
				ratio: compressionRatio,
				duration: 0, // Direct compression doesn't track duration
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
