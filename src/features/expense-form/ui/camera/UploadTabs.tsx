import { Icon } from "@iconify-icon/solid";
import { Button } from "@/components/ui";
import type { TabType } from "@/types";
import { NoImageTab } from "./NoImageTab";
import styles from "./UploadTabs.module.css";

interface UploadTabsProps {
	activeTab: TabType;
	onTabChange: (tab: TabType) => void;
	onCameraClick: () => void;
	onFileClick: () => void;
	noImageReason: string;
	onNoImageReasonChange: (value: string) => void;
	isCompressing: boolean;
}

function TabButton(props: {
	active: boolean;
	onClick: () => void;
	position: "left" | "center" | "right";
	children: string;
}) {
	const positionClass = {
		left: styles.tabLeft,
		center: styles.tabCenter,
		right: styles.tabRight,
	};

	return (
		<button
			type="button"
			onClick={props.onClick}
			class={`${styles.tab} ${positionClass[props.position]} ${props.active ? styles.tabActive : styles.tabInactive}`}
		>
			{props.children}
		</button>
	);
}

function UploadButton(props: {
	type: "camera" | "file";
	onClick: () => void;
	isCompressing: boolean;
}) {
	const config = {
		camera: {
			icon: "material-symbols:photo-camera-outline",
			text: "レシートを撮影",
			buttonText: "カメラを起動",
		},
		file: {
			icon: "material-symbols:upload-file-outline-rounded",
			text: "レシート画像を選択",
			buttonText: "ファイルを選択",
		},
	}[props.type];

	return (
		<div class={styles.uploadArea}>
			<div class={styles.uploadContent}>
				<div class={styles.uploadIcon}>
					<Icon icon={config.icon} width="100%" height="100%" />
				</div>
				<div>
					<p class={styles.uploadText}>{config.text}</p>
					<Button
						onClick={props.onClick}
						class="w-full"
						disabled={props.isCompressing}
					>
						{props.isCompressing ? "処理中..." : config.buttonText}
					</Button>
				</div>
			</div>
		</div>
	);
}

export function UploadTabs(props: UploadTabsProps) {
	return (
		<div class={styles.wrapper}>
			<div class={styles.tabBar}>
				<TabButton
					active={props.activeTab === "camera"}
					onClick={() => props.onTabChange("camera")}
					position="left"
				>
					撮影
				</TabButton>
				<TabButton
					active={props.activeTab === "file"}
					onClick={() => props.onTabChange("file")}
					position="center"
				>
					画像選択
				</TabButton>
				<TabButton
					active={props.activeTab === "no-image"}
					onClick={() => props.onTabChange("no-image")}
					position="right"
				>
					なし
				</TabButton>
			</div>

			<div class={styles.content}>
				{props.activeTab === "camera" && (
					<UploadButton
						type="camera"
						onClick={props.onCameraClick}
						isCompressing={props.isCompressing}
					/>
				)}

				{props.activeTab === "file" && (
					<UploadButton
						type="file"
						onClick={props.onFileClick}
						isCompressing={props.isCompressing}
					/>
				)}

				{props.activeTab === "no-image" && (
					<NoImageTab
						value={props.noImageReason}
						onInput={props.onNoImageReasonChange}
					/>
				)}
			</div>
		</div>
	);
}
