import { Icon } from "@iconify-icon/solid";
import { Button } from "@/components/ui";
import type { TabType } from "@/types";

interface ImagePreviewProps {
	imagePreview?: string;
	activeTab: TabType;
	onRetake: () => void;
	onClear: () => void;
	isLoading?: boolean;
}

export function ImagePreview(props: ImagePreviewProps) {
	return (
		<div class="space-y-3">
			<div class="flex justify-center">
				{props.isLoading ? (
					<div class="w-full h-40 bg-gray-50 border border-gray-200 rounded-lg flex flex-col items-center justify-center">
						<Icon
							icon="material-symbols:hourglass-top"
							width="24"
							height="24"
							class="text-gray-400 animate-spin mb-2"
						/>
						<p class="text-xs text-gray-500">画像を処理中...</p>
					</div>
				) : props.imagePreview ? (
					<img
						src={props.imagePreview}
						alt="レシートプレビュー"
						class="w-auto h-40"
					/>
				) : (
					<div class="w-full h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
						<Icon
							icon="material-symbols:image-outline"
							width="48"
							height="48"
							class="text-gray-400"
						/>
					</div>
				)}
			</div>

			{/* 処理中でない場合のみボタンを表示 */}
			{!props.isLoading && (
				<div class="flex gap-2 justify-center">
					<Button onClick={props.onRetake} size="sm">
						{props.activeTab === "camera" ? "撮り直し" : "別の画像を選択"}
					</Button>
					<Button onClick={props.onClear} variant="secondary" size="sm">
						削除
					</Button>
				</div>
			)}
		</div>
	);
}
