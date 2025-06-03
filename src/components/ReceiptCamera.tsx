import { createSignal } from "solid-js";
import { validateImageFile } from "../utils/api";
import { Button } from "./Button";
import { Label } from "./Label";

interface ReceiptCameraProps {
	onImageCapture: (file: File) => void;
	currentImage?: File;
}

export function ReceiptCamera(props: ReceiptCameraProps) {
	const [imagePreview, setImagePreview] = createSignal<string>("");
	const [error, setError] = createSignal<string>("");
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
		if (fileInputRef) {
			fileInputRef.click();
		}
	};

	const clearImage = () => {
		setImagePreview("");
		setError("");
		if (fileInputRef) {
			fileInputRef.value = "";
		}
	};

	return (
		<div class="space-y-4">
			<Label required>レシート画像</Label>

			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				capture="environment"
				onChange={handleFileSelect}
				class="hidden"
			/>

			{/* エラーメッセージ */}
			{error() && (
				<div class="p-3 bg-red-50 border border-red-200 rounded-lg">
					<p class="text-sm text-red-800">{error()}</p>
				</div>
			)}

			{imagePreview() ? (
				<div class="space-y-3">
					<div class="relative">
						<img
							src={imagePreview()}
							alt="レシートプレビュー"
							class="w-full max-w-sm mx-auto rounded-lg border border-gray-200"
						/>
					</div>
					<div class="flex gap-2 justify-center">
						<Button onClick={openCamera} variant="secondary" size="sm">
							撮り直し
						</Button>
						<Button onClick={clearImage} variant="secondary" size="sm">
							削除
						</Button>
					</div>
				</div>
			) : (
				<div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
					<div class="space-y-3">
						<div class="mx-auto h-12 w-12 text-gray-400">
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
							<p class="text-sm text-gray-600 mb-3">
								レシートを撮影してください
							</p>
							<Button onClick={openCamera}>カメラを起動</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
