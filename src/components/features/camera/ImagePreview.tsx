import { Icon } from "@iconify-icon/solid";
import { Button } from "@/components/ui";
import type { TabType } from "@/types";
import styles from "./ImagePreview.module.css";

interface ImagePreviewProps {
	imagePreview?: string;
	activeTab: TabType;
	onRetake: () => void;
	onClear: () => void;
	isLoading?: boolean;
}

export function ImagePreview(props: ImagePreviewProps) {
	return (
		<div class={styles.wrapper}>
			<div class={styles.previewContainer}>
				{props.isLoading ? (
					<div class={styles.loadingBox}>
						<Icon
							icon="material-symbols:hourglass-top"
							width="24"
							height="24"
							class={styles.loadingIcon}
						/>
						<p class={styles.loadingText}>画像を処理中...</p>
					</div>
				) : props.imagePreview ? (
					<img
						src={props.imagePreview}
						alt="レシートプレビュー"
						class={styles.previewImage}
					/>
				) : (
					<div class={styles.emptyBox}>
						<Icon
							icon="material-symbols:image-outline"
							width="48"
							height="48"
							class={styles.emptyIcon}
						/>
					</div>
				)}
			</div>

			{!props.isLoading && (
				<div class={styles.actions}>
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
