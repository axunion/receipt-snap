import { Button } from "@/components/ui/Button";
import { Icon } from "@iconify-icon/solid";

interface FileTabProps {
	onFileClick: () => void;
	isCompressing: boolean;
}

export function FileTab(props: FileTabProps) {
	return (
		<div class="border-2 border-dashed border-slate-300 rounded-lg h-48 text-center bg-slate-50/30 flex flex-col justify-center items-center p-6 sm:p-8">
			<div class="space-y-4">
				<div class="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-slate-400">
					<Icon
						icon="material-symbols:upload-file-outline-rounded"
						width="100%"
						height="100%"
					/>
				</div>
				<div>
					<p class="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4 font-medium">
						レシート画像を選択してください
					</p>
					<Button
						onClick={props.onFileClick}
						class="w-40"
						disabled={props.isCompressing}
					>
						{props.isCompressing ? "処理中..." : "ファイルを選択"}
					</Button>
				</div>
			</div>
		</div>
	);
}
