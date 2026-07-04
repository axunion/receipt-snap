import { Icon } from "@iconify-icon/solid";
import { Match, Show, Switch } from "solid-js";
import { Button, Spinner } from "@/components/ui";
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
        <Switch
          fallback={
            <div class={styles.emptyBox}>
              <Icon
                icon="material-symbols:image-outline"
                width="48"
                height="48"
                class={styles.emptyIcon}
              />
            </div>
          }
        >
          <Match when={props.isLoading}>
            <div class={styles.loadingBox}>
              <Spinner size="md" class={styles.loadingSpinner} />
              <p class={styles.loadingText}>画像を処理中...</p>
            </div>
          </Match>
          <Match when={props.imagePreview}>
            <img
              src={props.imagePreview}
              alt="レシートプレビュー"
              class={styles.previewImage}
            />
          </Match>
        </Switch>
      </div>

      <Show when={!props.isLoading}>
        <div class={styles.actions}>
          <Button onClick={props.onRetake} size="sm">
            {props.activeTab === "camera" ? "撮り直し" : "別の画像を選択"}
          </Button>
          <Button onClick={props.onClear} variant="secondary" size="sm">
            削除
          </Button>
        </div>
      </Show>
    </div>
  );
}
