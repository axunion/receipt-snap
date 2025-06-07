import { Button } from "@/components/Button";
import { Textarea } from "@/components/Textarea";
import { validateImageFile } from "@/utils/api";
import {
	compressImage,
	formatFileSize,
	calculateCompressionRatio,
	getDynamicCompressionOptions,
	getPerformanceAdjustedOptions,
	measureCompressionPerformance,
} from "@/utils/imageCompression";
import { createSignal } from "solid-js";
import { Icon } from "@iconify-icon/solid";

interface ReceiptCameraProps {
	onImageCapture: (file: File) => void;
	onNoImageReason?: (reason: string) => void;
	currentImage?: File;
}

export function ReceiptCamera(props: ReceiptCameraProps) {
	const [imagePreview, setImagePreview] = createSignal<string>("");
	const [error, setError] = createSignal<string>("");
	const [warning, setWarning] = createSignal<string>("");
	const [activeTab, setActiveTab] = createSignal<
		"camera" | "file" | "no-image"
	>("camera");
	const [noImageReason, setNoImageReason] = createSignal<string>("");
	const [isCompressing, setIsCompressing] = createSignal<boolean>(false);
	const [compressionProgress, setCompressionProgress] = createSignal<number>(0);
	const [compressionInfo, setCompressionInfo] = createSignal<{
		originalSize: number;
		compressedSize: number;
		ratio: number;
	} | null>(null);
	let cameraInputRef: HTMLInputElement | undefined;
	let fileInputRef: HTMLInputElement | undefined;

	const handleFileSelect = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		setError("");
		setCompressionInfo(null);
		setCompressionProgress(0);
		setWarning("");

		if (file) {
			// ファイルバリデーション
			const validation = validateImageFile(file);
			if (!validation.isValid) {
				setError(validation.error || "ファイルが無効です");
				return;
			}

			// 警告がある場合は表示
			if (validation.warning) {
				setWarning(validation.warning);
			}

			const fileSizeMB = file.size / (1024 * 1024);
			console.log(`処理開始: ${file.name} (${fileSizeMB.toFixed(1)}MB)`);

			setIsCompressing(true);

			try {
				// ファイルサイズに基づいて最適な圧縮設定を取得
				const baseOptions = getDynamicCompressionOptions(fileSizeMB);

				// デバイス性能に基づいて設定を調整
				const finalOptions = getPerformanceAdjustedOptions(
					baseOptions,
					fileSizeMB,
				);

				// プログレス表示用のコールバックを追加
				finalOptions.progressCallback = (progress: number) => {
					setCompressionProgress(progress);
				};

				console.log("圧縮設定:", finalOptions);

				// 画像を圧縮（パフォーマンス測定付き）
				const originalSize = file.size;

				const { result: compressedFile, duration } =
					await measureCompressionPerformance(
						() => compressImage(file, finalOptions),
						`画像圧縮 (${fileSizeMB.toFixed(1)}MB)`,
					);

				const compressedSize = compressedFile.size;
				const ratio = calculateCompressionRatio(originalSize, compressedSize);

				console.log(
					`圧縮完了: ${duration.toFixed(0)}ms, ${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)} (${ratio}%削減)`,
				);

				setCompressionInfo({
					originalSize,
					compressedSize,
					ratio,
				});

				// 圧縮が成功したら警告をクリア
				setWarning("");

				props.onImageCapture?.(compressedFile);

				// プレビュー画像を作成
				const reader = new FileReader();
				reader.onload = (e) => {
					setImagePreview(e.target?.result as string);
				};
				reader.readAsDataURL(compressedFile);
			} catch (compressionError) {
				console.error("画像圧縮エラー:", compressionError);
				setError("画像の圧縮に失敗しました。元の画像を使用します。");

				// 圧縮に失敗した場合は元の画像を使用
				props.onImageCapture?.(file);

				const reader = new FileReader();
				reader.onload = (e) => {
					setImagePreview(e.target?.result as string);
				};
				reader.readAsDataURL(file);
			} finally {
				setIsCompressing(false);
				setCompressionProgress(0);
			}
		}
	};

	const openCamera = () => {
		if (cameraInputRef) {
			cameraInputRef.click();
		}
	};

	const openFileDialog = () => {
		if (fileInputRef) {
			fileInputRef.click();
		}
	};

	const clearImage = () => {
		setImagePreview("");
		setError("");
		setWarning("");
		setNoImageReason("");
		setCompressionInfo(null);
		setCompressionProgress(0);
		if (cameraInputRef) {
			cameraInputRef.value = "";
		}
		if (fileInputRef) {
			fileInputRef.value = "";
		}
	};

	const handleReasonChange = (reason: string) => {
		setNoImageReason(reason);
		if (reason.trim() && props.onNoImageReason) {
			props.onNoImageReason(reason.trim());
		}
	};

	return (
		<div class="space-y-4">
			<input
				ref={cameraInputRef}
				type="file"
				accept="image/*,.heic,.heif"
				capture="environment"
				onChange={handleFileSelect}
				class="hidden"
			/>

			<input
				ref={fileInputRef}
				type="file"
				accept="image/*,.heic,.heif"
				onChange={handleFileSelect}
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

						{/* プログレスバー */}
						<div class="w-full bg-blue-100 rounded-full h-2">
							<div
								class="bg-blue-500 h-2 rounded-full transition-all duration-300"
								style={`width: ${compressionProgress()}%`}
							/>
						</div>

						<div class="text-xs text-blue-600">
							{compressionProgress() < 30 && "ファイルを読み込み中..."}
							{compressionProgress() >= 30 &&
								compressionProgress() < 60 &&
								"画像をリサイズ中..."}
							{compressionProgress() >= 60 &&
								compressionProgress() < 90 &&
								"圧縮処理中..."}
							{compressionProgress() >= 90 && "最終処理中..."}
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
								{formatFileSize(compressionInfo()?.originalSize || 0)} →{" "}
								{formatFileSize(compressionInfo()?.compressedSize || 0)}{" "}
								<span class="font-medium">
									({compressionInfo()?.ratio || 0}%削減)
								</span>
								{(compressionInfo()?.ratio || 0) >= 80 && " 🎉"}
							</div>
						</div>
					</div>
				</div>
			)}

			{imagePreview() ? (
				<div class="space-y-3">
					<div class="flex justify-center">
						<img
							src={imagePreview()}
							alt="レシートプレビュー"
							class="w-auto h-40"
						/>
					</div>

					<div class="flex gap-2 justify-center">
						<Button
							onClick={activeTab() === "camera" ? openCamera : openFileDialog}
							size="sm"
						>
							{activeTab() === "camera" ? "撮り直し" : "別の画像を選択"}
						</Button>
						<Button onClick={clearImage} variant="secondary" size="sm">
							削除
						</Button>
					</div>
				</div>
			) : (
				<div class="border border-slate-200 rounded-md">
					<div class="flex bg-slate-50 rounded-t-lg border-b border-slate-200">
						<button
							type="button"
							onClick={() => setActiveTab("camera")}
							class={`flex-1 px-2 py-3 text-xs sm:text-sm font-medium rounded-tl-lg ${
								activeTab() === "camera"
									? "bg-white text-blue-600 border-b-2 border-white -mb-px"
									: "bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
							}`}
						>
							撮影
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("file")}
							class={`flex-1 px-2 py-3 text-xs sm:text-sm font-medium border-l border-slate-200 ${
								activeTab() === "file"
									? "bg-white text-blue-600 border-b-2 border-b-white border-l-slate-200 -mb-px"
									: "bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
							}`}
						>
							画像選択
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("no-image")}
							class={`flex-1 px-2 py-3 text-xs sm:text-sm font-medium border-l border-slate-200 rounded-tr-lg ${
								activeTab() === "no-image"
									? "bg-white text-blue-600 border-b-2 border-b-white border-l-slate-200 -mb-px"
									: "bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
							}`}
						>
							なし
						</button>
					</div>

					<div class="p-6">
						{activeTab() === "camera" && (
							<div class="border-2 border-dashed border-slate-300 rounded-lg h-48 text-center bg-slate-50/30 flex flex-col justify-center items-center p-6 sm:p-8">
								<div class="space-y-4">
									<div class="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-slate-400">
										<Icon
											icon="material-symbols:photo-camera-outline"
											width="100%"
											height="100%"
										/>
									</div>
									<div>
										<p class="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4 font-medium">
											レシートを撮影してください
										</p>
										<Button
											onClick={openCamera}
											class="w-40"
											disabled={isCompressing()}
										>
											{isCompressing() ? "処理中..." : "カメラを起動"}
										</Button>
									</div>
								</div>
							</div>
						)}

						{activeTab() === "file" && (
							<div class="border-2 border-dashed border-slate-300 rounded-lg h-48 text-center bg-slate-50/30 flex flex-col justify-center items-center p-6 sm:p-8">
								<div class="space-y-4">
									<div class="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-slate-400">
										<Icon
											icon="material-symbols:upload-file-outline-rounded"
											width="100%"
											height="100%"
										/>
									</div>
									<div>
										<p class="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4 font-medium">
											レシート画像を選択してください
										</p>
										<Button
											onClick={openFileDialog}
											class="w-40"
											disabled={isCompressing()}
										>
											{isCompressing() ? "処理中..." : "ファイルを選択"}
										</Button>
									</div>
								</div>
							</div>
						)}

						{activeTab() === "no-image" && (
							<div class="h-48 flex flex-col justify-between">
								<div>
									<p class="text-xs sm:text-sm text-slate-600 font-medium text-center">
										レシートがない理由を入力してください
									</p>
								</div>
								<div class="flex-1 flex flex-col justify-end">
									<Textarea
										placeholder="例：紛失、発行されていないなど"
										value={noImageReason()}
										onInput={handleReasonChange}
										rows={6}
										class="w-full"
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
