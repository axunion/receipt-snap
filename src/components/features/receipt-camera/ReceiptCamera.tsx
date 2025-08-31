import { Icon } from "@iconify-icon/solid";
import { createEffect } from "solid-js";
import { useImage } from "@/hooks";
import { expenseFormStore } from "@/stores";
import { formatFileSize } from "@/utils";
import { ImagePreview } from "./ImagePreview";
import { UploadTabs } from "./UploadTabs";

interface ReceiptCameraProps {
	onImageCapture: (base64: string) => void;
}

export function ReceiptCamera(props: ReceiptCameraProps) {
	const {
		imagePreview,
		error,
		warning,
		info,
		activeTab,
		isCompressing,
		compressionInfo,
		setActiveTab,
		handleFileSelect,
		clearImage,
	} = useImage(props.onImageCapture);

	let cameraInputRef: HTMLInputElement | undefined;
	let fileInputRef: HTMLInputElement | undefined;

	createEffect(() => {
		if (expenseFormStore.receiptImage() === null) {
			if (cameraInputRef) {
				cameraInputRef.value = "";
			}
			if (fileInputRef) {
				fileInputRef.value = "";
			}
		}
	});

	const handleFileInputChange = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			await handleFileSelect(file);
		}
	};

	const openCamera = () => {
		setActiveTab("camera");
		if (cameraInputRef) {
			cameraInputRef.click();
		}
	};

	const openFileDialog = () => {
		setActiveTab("file");
		if (fileInputRef) {
			fileInputRef.click();
		}
	};

	const clearImageAndInputs = () => {
		clearImage();
		expenseFormStore.setNoImageReason("");
		if (cameraInputRef) {
			cameraInputRef.value = "";
		}
		if (fileInputRef) {
			fileInputRef.value = "";
		}
	};

	return (
		<div class="space-y-4">
			<input
				ref={cameraInputRef}
				type="file"
				accept="image/*,.heic,.heif"
				capture="environment"
				onChange={handleFileInputChange}
				class="hidden"
				aria-label="レシートをカメラで撮影"
			/>

			<input
				ref={fileInputRef}
				type="file"
				accept="image/*,.heic,.heif"
				onChange={handleFileInputChange}
				class="hidden"
				aria-label="レシートの画像ファイルを選択"
			/>

			{error() && (
				<div
					class="p-4 bg-red-50 border border-red-200 rounded-lg"
					role="alert"
				>
					<div class="flex items-start gap-2">
						<Icon
							icon="material-symbols:error-outline"
							width="16"
							height="16"
							class="text-red-600 mt-0.5 flex-shrink-0"
						/>
						<div>
							<p class="text-sm font-medium text-red-800">{error()}</p>
							<p class="text-xs text-red-600 mt-1">
								JPEG / PNG / HEIC (12MB以下) の画像を選択してください
							</p>
						</div>
					</div>
				</div>
			)}

			{warning() && (
				<div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
					<div class="flex items-start gap-2">
						<Icon
							icon="material-symbols:warning-outline"
							width="16"
							height="16"
							class="text-yellow-600 mt-0.5"
						/>
						<p class="text-sm text-yellow-800">{warning()}</p>
					</div>
				</div>
			)}

			{info() && (
				<div class="p-3 bg-sky-50 border border-sky-200 rounded-lg">
					<div class="flex items-start gap-2">
						<Icon
							icon="material-symbols:info-outline"
							width="16"
							height="16"
							class="text-sky-600 mt-0.5"
						/>
						<p class="text-xs text-sky-700 leading-relaxed">{info()}</p>
					</div>
				</div>
			)}

			{compressionInfo() && (
				<div class="p-3 bg-emerald-50 border border-emerald-200 rounded-lg transition-opacity duration-300">
					<div class="flex items-start gap-2">
						<Icon
							icon="material-symbols:compress"
							width="16"
							height="16"
							class="text-emerald-600 mt-0.5"
						/>
						<div class="flex-1">
							<p class="text-sm text-emerald-700">
								<span class="font-medium">画像を圧縮しました</span>
							</p>
							<div class="mt-1 text-xs text-emerald-600">
								{compressionInfo()?.originalSize &&
									`${formatFileSize(compressionInfo()?.originalSize ?? 0)} → ${formatFileSize(compressionInfo()?.compressedSize ?? 0)}`}
								<span class="font-medium ml-1">
									({Math.min(compressionInfo()?.ratio || 0, 99)}%削減)
								</span>
							</div>
						</div>
					</div>
				</div>
			)}

			{isCompressing() || imagePreview() ? (
				<ImagePreview
					imagePreview={imagePreview()}
					activeTab={activeTab()}
					onRetake={activeTab() === "camera" ? openCamera : openFileDialog}
					onClear={clearImageAndInputs}
					isLoading={isCompressing()}
				/>
			) : (
				<UploadTabs
					activeTab={activeTab()}
					onTabChange={setActiveTab}
					onCameraClick={openCamera}
					onFileClick={openFileDialog}
					isCompressing={false}
				/>
			)}
		</div>
	);
}
