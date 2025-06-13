import { Textarea } from "@/components/ui";
import { expenseFormStore } from "@/stores/expenseFormStore";

export function NoImageTab() {
	return (
		<div class="h-48 flex flex-col justify-between">
			<div>
				<p class="text-xs sm:text-sm text-slate-600 font-medium text-center">
					レシートがない理由を入力してください
				</p>
			</div>
			<div class="flex-1 flex flex-col justify-end">
				<Textarea
					placeholder="例：紛失、発行されていないなど"
					value={expenseFormStore.noImageReason()}
					onInput={expenseFormStore.setNoImageReason}
					rows={6}
					class="w-full"
				/>
			</div>
		</div>
	);
}
