import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { Textarea } from "@/components/Textarea";
import { validateImageFile } from "@/utils/api";
import { createSignal } from "solid-js";

interface ReceiptCameraProps {
	onImageCapture: (file: File) => void;
	onNoImageReason?: (reason: string) => void;
	currentImage?: File;
}

export function ReceiptCamera(props: ReceiptCameraProps) {
	const [imagePreview, setImagePreview] = createSignal<string>("");
	const [error, setError] = createSignal<string>("");
	const [activeTab, setActiveTab] = createSignal<
		"camera" | "file" | "no-image"
	>("camera");
	const [noImageReason, setNoImageReason] = createSignal<string>("");
	let cameraInputRef: HTMLInputElement | undefined;
	let fileInputRef: HTMLInputElement | undefined;

	const handleFileSelect = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		setError("");

		if (file) {
			// ファイルバリデーション
			const validation = validateImageFile(file);
			if (!validation.isValid) {
				setError(validation.error || "ファイルが無効です");
				return;
			}

			props.onImageCapture?.(file);

			// プレビュー画像を作成
			const reader = new FileReader();
			reader.onload = (e) => {
				setImagePreview(e.target?.result as string);
			};
			reader.readAsDataURL(file);
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
		setNoImageReason("");
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
			<Label required>レシート画像</Label>

			{/* カメラ用のinput（capture属性付き） */}
			<input
				ref={cameraInputRef}
				type="file"
				accept="image/*"
				capture="environment"
				onChange={handleFileSelect}
				class="hidden"
			/>

			{/* ファイル選択用のinput（capture属性なし） */}
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleFileSelect}
				class="hidden"
			/>

			{/* エラーメッセージ */}
			{error() && (
				<div class="p-4 bg-red-50 border border-red-200 rounded-lg">
					<p class="text-sm font-medium text-red-800">{error()}</p>
				</div>
			)}

			{/* 画像がアップロード済みの場合 */}
			{imagePreview() ? (
				<div class="space-y-3">
					<div class="relative">
						<img
							src={imagePreview()}
							alt="レシートプレビュー"
							class="w-full max-w-sm mx-auto rounded-lg border border-slate-200 shadow-sm"
						/>
					</div>
					<div class="flex gap-2 justify-center">
						<Button
							onClick={activeTab() === "camera" ? openCamera : openFileDialog}
							variant="secondary"
							size="sm"
						>
							撮り直し
						</Button>
						<Button onClick={clearImage} variant="secondary" size="sm">
							削除
						</Button>
					</div>
				</div>
			) : (
				<div>
					{/* タブナビゲーション */}
					<div class="flex border-b border-slate-200 mb-6">
						<button
							type="button"
							onClick={() => setActiveTab("camera")}
							class={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
								activeTab() === "camera"
									? "border-blue-500 text-blue-600"
									: "border-transparent text-slate-500 hover:text-slate-700"
							}`}
						>
							カメラ撮影
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("file")}
							class={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
								activeTab() === "file"
									? "border-blue-500 text-blue-600"
									: "border-transparent text-slate-500 hover:text-slate-700"
							}`}
						>
							ファイル選択
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("no-image")}
							class={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
								activeTab() === "no-image"
									? "border-blue-500 text-blue-600"
									: "border-transparent text-slate-500 hover:text-slate-700"
							}`}
						>
							画像なし
						</button>
					</div>

					{/* タブコンテンツ - 固定の高さを設定 */}
					<div class="min-h-[200px]">
						{activeTab() === "camera" && (
							<div class="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50/30">
								<div class="space-y-4">
									<div class="mx-auto h-12 w-12 text-slate-400">
										<svg
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											aria-hidden="true"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
											/>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
									</div>
									<div>
										<p class="text-sm text-slate-600 mb-4 font-medium">
											レシートを撮影してください
										</p>
										<Button onClick={openCamera}>カメラを起動</Button>
									</div>
								</div>
							</div>
						)}

						{activeTab() === "file" && (
							<div class="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50/30">
								<div class="space-y-4">
									<div class="mx-auto h-12 w-12 text-slate-400">
										<svg
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											aria-hidden="true"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
											/>
										</svg>
									</div>
									<div>
										<p class="text-sm text-slate-600 mb-4 font-medium">
											レシート画像ファイルを選択してください
										</p>
										<Button onClick={openFileDialog}>ファイルを選択</Button>
									</div>
								</div>
							</div>
						)}

						{activeTab() === "no-image" && (
							<div class="border border-slate-200 rounded-lg p-6 bg-slate-50/30">
								<div class="space-y-4">
									<div>
										<p class="text-sm font-medium text-slate-700 mb-3">
											レシート画像がない理由を入力してください
										</p>
										<Textarea
											placeholder="理由を入力してください（例：紛失、電子レシート未対応、現金以外の支払いなど）"
											value={noImageReason()}
											onInput={handleReasonChange}
											rows={4}
											class="w-full"
										/>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
