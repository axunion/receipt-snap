import { useImageUpload } from "@/hooks/useImageUpload";
import { Icon } from "@iconify-icon/solid";
import { ImagePreview } from "./ImagePreview";
import { UploadTabs } from "./UploadTabs";

interface ReceiptCameraProps {
	onImageCapture: (file: File) => void;
	onNoImageReason?: (reason: string) => void;
	currentImage?: File;
}

export function ReceiptCamera(props: ReceiptCameraProps) {
	const {
		imagePreview,
		error,
		warning,
		activeTab,
		noImageReason,
		isCompressing,
		compressionProgress,
		compressionInfo,
		setActiveTab,
		handleFileSelect,
		clearImage,
		handleReasonChange,
		getProgressStageText,
	} = useImageUpload(props.onImageCapture, props.onNoImageReason);

	let cameraInputRef: HTMLInputElement | undefined;
	let fileInputRef: HTMLInputElement | undefined;

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
			/>

			<input
				ref={fileInputRef}
				type="file"
				accept="image/*,.heic,.heif"
				onChange={handleFileInputChange}
				class="hidden"
			/>

			{error() && (
				<div class="p-4 bg-red-50 border border-red-200 rounded-lg">
					<p class="text-sm font-medium text-red-800">{error()}</p>
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

			{isCompressing() && (
				<div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
					<div class="space-y-3">
						<div class="flex items-center gap-2">
							<Icon
								icon="material-symbols:hourglass-top"
								width="16"
								height="16"
								class="text-blue-600 animate-spin"
							/>
							<p class="text-sm font-medium text-blue-800">画像を圧縮中...</p>
						</div>

						<div class="w-full bg-blue-100 rounded-full h-2">
							<div
								class="bg-blue-500 h-2 rounded-full transition-all duration-300"
								style={`width: ${compressionProgress()}%`}
							/>
						</div>

						<div class="text-xs text-blue-600">
							{getProgressStageText(compressionProgress())}
						</div>
					</div>
				</div>
			)}

			{compressionInfo() && (
				<div class="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
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
									`${((compressionInfo()?.originalSize ?? 0) / (1024 * 1024)).toFixed(1)}MB → ${((compressionInfo()?.compressedSize ?? 0) / (1024 * 1024)).toFixed(1)}MB`}
								<span class="font-medium ml-1">
									({compressionInfo()?.ratio || 0}%削減)
								</span>
								{(compressionInfo()?.ratio || 0) >= 80 && " 🎉"}
							</div>
						</div>
					</div>
				</div>
			)}

			{imagePreview() ? (
				<ImagePreview
					imagePreview={imagePreview()}
					activeTab={activeTab()}
					onRetake={activeTab() === "camera" ? openCamera : openFileDialog}
					onClear={clearImageAndInputs}
				/>
			) : (
				<UploadTabs
					activeTab={activeTab()}
					onTabChange={setActiveTab}
					onCameraClick={openCamera}
					onFileClick={openFileDialog}
					noImageReason={noImageReason()}
					onReasonChange={handleReasonChange}
					isCompressing={isCompressing()}
				/>
			)}
		</div>
	);
}
