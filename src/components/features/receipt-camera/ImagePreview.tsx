import { Button } from "@/components/ui/Button";
import type { TabType } from "@/types/ui";

interface ImagePreviewProps {
	imagePreview: string;
	activeTab: TabType;
	onRetake: () => void;
	onClear: () => void;
}

export function ImagePreview(props: ImagePreviewProps) {
	return (
		<div class="space-y-3">
			<div class="flex justify-center">
				<img
					src={props.imagePreview}
					alt="レシートプレビュー"
					class="w-auto h-40"
				/>
			</div>

			<div class="flex gap-2 justify-center">
				<Button onClick={props.onRetake} size="sm">
					{props.activeTab === "camera" ? "撮り直し" : "別の画像を選択"}
				</Button>
				<Button onClick={props.onClear} variant="secondary" size="sm">
					削除
				</Button>
			</div>
		</div>
	);
}
