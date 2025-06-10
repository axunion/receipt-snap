import type { TabType } from "@/types/ui";
import { CameraTab } from "./CameraTab";
import { FileTab } from "./FileTab";
import { NoImageTab } from "./NoImageTab";
import { TabButton } from "./TabButton";

interface UploadTabsProps {
	activeTab: TabType;
	onTabChange: (tab: TabType) => void;
	onCameraClick: () => void;
	onFileClick: () => void;
	noImageReason: string;
	onReasonChange: (reason: string) => void;
	isCompressing: boolean;
}

export function UploadTabs(props: UploadTabsProps) {
	return (
		<div class="border border-slate-200 rounded-md overflow-hidden">
			<div class="flex bg-slate-50">
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

			<div class="p-6 bg-white">
				{props.activeTab === "camera" && (
					<CameraTab
						onCameraClick={props.onCameraClick}
						isCompressing={props.isCompressing}
					/>
				)}

				{props.activeTab === "file" && (
					<FileTab
						onFileClick={props.onFileClick}
						isCompressing={props.isCompressing}
					/>
				)}

				{props.activeTab === "no-image" && (
					<NoImageTab
						reason={props.noImageReason}
						onReasonChange={props.onReasonChange}
					/>
				)}
			</div>
		</div>
	);
}
