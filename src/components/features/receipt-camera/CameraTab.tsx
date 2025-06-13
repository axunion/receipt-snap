import { Button } from "@/components/ui";
import { Icon } from "@iconify-icon/solid";

interface CameraTabProps {
	onCameraClick: () => void;
	isCompressing: boolean;
}

export function CameraTab(props: CameraTabProps) {
	return (
		<div class="border-2 border-dashed border-slate-300 rounded-lg h-48 text-center bg-slate-50/30 flex flex-col justify-center items-center p-6 sm:p-8">
			<div class="space-y-4">
				<div class="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-slate-400">
					<Icon
						icon="material-symbols:photo-camera-outline"
						width="100%"
						height="100%"
					/>
				</div>
				<div>
					<p class="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4 font-medium">
						レシートを撮影してください
					</p>
					<Button
						onClick={props.onCameraClick}
						class="w-40"
						disabled={props.isCompressing}
					>
						{props.isCompressing ? "処理中..." : "カメラを起動"}
					</Button>
				</div>
			</div>
		</div>
	);
}
