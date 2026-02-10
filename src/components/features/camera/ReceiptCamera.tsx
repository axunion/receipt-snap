import { Icon } from "@iconify-icon/solid";
import { createEffect, Show } from "solid-js";
import { useImage } from "@/hooks";
import { expenseFormStore } from "@/stores";
import { formatFileSize } from "@/utils";
import { ImagePreview } from "./ImagePreview";
import styles from "./ReceiptCamera.module.css";
import { UploadTabs } from "./UploadTabs";

interface ReceiptCameraProps {
	onImageCapture: (file: File) => void;
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
		if (expenseFormStore.receiptFile() === null) {
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
		expenseFormStore.setReceiptFile(null);
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
		<div class={styles.wrapper}>
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

			<Show when={error()}>
				<div class={styles.alertError} role="alert">
					<div class={styles.alertContent}>
						<Icon
							icon="material-symbols:error-outline"
							width="16"
							height="16"
							class={styles.alertIconError}
						/>
						<div>
							<p class={styles.errorTitle}>{error()}</p>
							<p class={styles.errorHint}>
								JPEG / PNG / HEIC (12MB以下) の画像を選択してください
							</p>
						</div>
					</div>
				</div>
			</Show>

			<Show when={warning()}>
				<div class={styles.alertWarning}>
					<div class={styles.alertContent}>
						<Icon
							icon="material-symbols:warning-outline"
							width="16"
							height="16"
							class={styles.alertIconWarning}
						/>
						<p class={styles.warningText}>{warning()}</p>
					</div>
				</div>
			</Show>

			<Show when={info()}>
				<div class={styles.alertInfo}>
					<div class={styles.alertContent}>
						<Icon
							icon="material-symbols:info-outline"
							width="16"
							height="16"
							class={styles.alertIconInfo}
						/>
						<p class={styles.infoText}>{info()}</p>
					</div>
				</div>
			</Show>

			<Show when={compressionInfo()}>
				{(info) => (
					<div class={styles.alertCompression}>
						<div class={styles.alertContent}>
							<Icon
								icon="material-symbols:compress"
								width="16"
								height="16"
								class={styles.alertIconCompression}
							/>
							<div class={styles.compressionBody}>
								<p class={styles.compressionTitle}>
									<span class={styles.compressionTitleBold}>
										画像を圧縮しました
									</span>
								</p>
								<div class={styles.compressionDetails}>
									{info().originalSize &&
										`${formatFileSize(info().originalSize ?? 0)} → ${formatFileSize(info().compressedSize ?? 0)}`}
									<span class={styles.compressionRatio}>
										({Math.min(info().ratio || 0, 99)}%削減)
									</span>
								</div>
							</div>
						</div>
					</div>
				)}
			</Show>

			<Show
				when={isCompressing() || imagePreview()}
				fallback={
					<UploadTabs
						activeTab={activeTab()}
						onTabChange={setActiveTab}
						onCameraClick={openCamera}
						onFileClick={openFileDialog}
						isCompressing={false}
					/>
				}
			>
				<ImagePreview
					imagePreview={imagePreview()}
					activeTab={activeTab()}
					onRetake={activeTab() === "camera" ? openCamera : openFileDialog}
					onClear={clearImageAndInputs}
					isLoading={isCompressing()}
				/>
			</Show>
		</div>
	);
}
