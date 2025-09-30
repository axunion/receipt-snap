import { Icon } from "@iconify-icon/solid";
import { Button } from "@/components/ui";
import type { TabType } from "@/types";
import { NoImageTab } from "./NoImageTab";

interface UploadTabsProps {
	activeTab: TabType;
	onTabChange: (tab: TabType) => void;
	onCameraClick: () => void;
	onFileClick: () => void;
	isCompressing: boolean;
}

// Internal component for tab buttons
function TabButton(props: {
	active: boolean;
	onClick: () => void;
	position: "left" | "center" | "right";
	children: string;
}) {
	const baseClasses = "flex-1 px-2 py-3 text-sm font-medium cursor-pointer";
	const positionClasses = {
		left: "rounded-tl-lg",
		center: "border-l border-slate-200",
		right: "border-l border-slate-200 rounded-tr-lg",
	};
	const stateClasses = {
		active: "bg-white",
		inactive: "bg-slate-50 border-b border-slate-200 text-slate-500",
	};

	return (
		<button
			type="button"
			onClick={props.onClick}
			class={`${baseClasses} ${positionClasses[props.position]} ${stateClasses[props.active ? "active" : "inactive"]}`}
		>
			{props.children}
		</button>
	);
}

// Internal component for upload buttons
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
		<div class="border-2 border-dashed border-slate-300 rounded-lg h-48 text-center bg-slate-50/30 flex flex-col justify-center items-center p-6 sm:p-8">
			<div class="space-y-2">
				<div class="mx-auto h-12 w-12 text-slate-400">
					<Icon icon={config.icon} width="100%" height="100%" />
				</div>
				<div>
					<p class="text-sm text-slate-600 mb-3 sm:mb-4 font-medium">
						{config.text}
					</p>
					<Button
						onClick={props.onClick}
						class="w-40"
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
