import { Button, LoadingOverlay } from "@/components/ui";
import { expenseFormStore } from "@/stores/expenseFormStore";

export function FormSubmission() {
	const isSubmitting = () => expenseFormStore.submitState().isLoading;

	return (
		<>
			<Button
				type="submit"
				disabled={isSubmitting()}
				class="w-full"
				variant={isSubmitting() ? "secondary" : "primary"}
				size="lg"
			>
				{isSubmitting() ? "送信中..." : "送信する"}
			</Button>

			<LoadingOverlay isVisible={isSubmitting()} message="送信中..." />
		</>
	);
}
