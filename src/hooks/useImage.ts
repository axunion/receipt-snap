import { createEffect, createSignal } from "solid-js";
import { expenseFormStore } from "@/stores";
import type { CompressionResult, TabType } from "@/types";
import {
	calculateCompressionRatio,
	compressImage,
	formatFileSize,
	getReceiptCompressionOptions,
	validateImageFile,
} from "@/utils";
export function useImage(onImageCapture?: (file: File) => void) {
	const [imagePreview, setImagePreview] = createSignal("");
	const [error, setError] = createSignal("");
	const [warning, setWarning] = createSignal("");
	const [activeTab, setActiveTab] = createSignal<TabType>("camera");
	const [info, setInfo] = createSignal("");

	const handleTabChange = (tab: TabType) => {
		setActiveTab(tab);
	};

	const [isCompressing, setIsCompressing] = createSignal(false);
	const [compressionInfo, setCompressionInfo] =
		createSignal<CompressionResult | null>(null);

	// Automatically clear preview when receipt file in store becomes null
	createEffect(() => {
		if (expenseFormStore.receiptFile() === null) {
			if (imagePreview()) {
				URL.revokeObjectURL(imagePreview());
			}
			setImagePreview("");
			setError("");
			setWarning("");
			setInfo("");
			setCompressionInfo(null);
		}
	});

	const handleFileSelect = async (file: File) => {
		setError("");
		setWarning("");
		setInfo("");
		setCompressionInfo(null);

		const validation = validateImageFile(file);
		if (!validation.isValid) {
			setError(validation.error || "Invalid file");
			return;
		}

		if (validation.warning) setWarning(validation.warning);
		if (validation.info) setInfo(validation.info);

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
				duration: 0,
			});

			setWarning("");

			onImageCapture?.(compressedFile);

			// Create object URL for preview (memory efficient vs DataURL)
			if (imagePreview()) {
				URL.revokeObjectURL(imagePreview());
			}
			const objectUrl = URL.createObjectURL(compressedFile);
			setImagePreview(objectUrl);
		} catch (compressionError) {
			console.error("Image compression error:", compressionError);
			setError("Image compression failed. Using original image.");

			onImageCapture?.(file); // still hand back original so caller may decide
			if (imagePreview()) {
				URL.revokeObjectURL(imagePreview());
			}
			const fallbackUrl = URL.createObjectURL(file);
			setImagePreview(fallbackUrl);
		} finally {
			setIsCompressing(false);
		}
	};

	const clearImage = () => {
		if (imagePreview()) {
			URL.revokeObjectURL(imagePreview());
		}
		setImagePreview("");
		setError("");
		setWarning("");
		setInfo("");
		setCompressionInfo(null);
	};

	return {
		imagePreview,
		error,
		warning,
		info,
		activeTab,
		isCompressing,
		compressionInfo,
		setActiveTab: handleTabChange,
		handleFileSelect,
		clearImage,
	};
}
