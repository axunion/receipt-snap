import { For } from "solid-js";
import { expenseFormStore } from "@/stores";
import type { FieldErrors, SubmitErrorResponse, TouchedFields } from "@/types";

interface FormErrorDisplayProps {
	formErrors: () => string[];
	fieldErrors: () => FieldErrors;
	touchedFields: () => TouchedFields;
}

export function FormErrorDisplay(props: FormErrorDisplayProps) {
	const submitError = () => {
		const result = expenseFormStore.submitState().result;
		return result?.result === "error"
			? (result as SubmitErrorResponse).error
			: null;
	};

	const validationErrors = () => {
		return props.formErrors().length > 0 &&
			Object.values(props.touchedFields()).some(Boolean)
			? props
					.formErrors()
					.filter(
						(fe: string) => !Object.values(props.fieldErrors()).includes(fe),
					)
			: [];
	};

	const hasErrors = () => submitError() || validationErrors().length > 0;

	if (!hasErrors()) {
		return null;
	}

	return (
		<div class="p-4 bg-red-50 border border-red-200 rounded-lg">
			{submitError() && (
				<p class="text-sm font-medium text-red-800 mb-2">{submitError()}</p>
			)}

			{validationErrors().length > 0 && (
				<>
					<p class="text-sm font-medium text-red-800 mb-2">入力エラー:</p>
					<ul class="text-sm text-red-700 list-disc list-inside space-y-1">
						<For each={validationErrors()}>{(error) => <li>{error}</li>}</For>
					</ul>
				</>
			)}
		</div>
	);
}
