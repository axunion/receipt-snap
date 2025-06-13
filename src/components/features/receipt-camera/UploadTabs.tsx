import type { TabType } from "@/types/ui";
import { NoImageTab } from "./NoImageTab";
import { TabButton } from "./TabButton";
import { UploadButton } from "./UploadButton";

interface UploadTabsProps {
	activeTab: TabType;
	onTabChange: (tab: TabType) => void;
	onCameraClick: () => void;
	onFileClick: () => void;
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

				{props.activeTab === "no-image" && <NoImageTab />}
			</div>
		</div>
	);
}
