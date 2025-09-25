import { Icon } from "@iconify-icon/solid";
import { Button } from "@/components/ui";

interface UploadButtonProps {
	type: "camera" | "file";
	onClick: () => void;
	isCompressing: boolean;
}

const UPLOAD_CONFIG = {
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
} as const;

export function UploadButton(props: UploadButtonProps) {
	const config = UPLOAD_CONFIG[props.type];

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
