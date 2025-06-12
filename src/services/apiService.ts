import type {
	ExpenseData,
	PurposeOption,
	SubmitExpenseResult,
} from "@/types/expense";

const BASE_URL = "/api";

async function simulateDelay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchPurposes(): Promise<PurposeOption[]> {
	// Simulate API call in development
	if (import.meta.env.DEV) {
		console.log("Fetching sample purposes for development environment");
		await simulateDelay(500);
		return [
			{ value: "value1", label: "イベント" },
			{ value: "value2", label: "修理代" },
			{ value: "value3", label: "交通費" },
		];
	}

	try {
		const response = await fetch(`${BASE_URL}/purposes`);
		if (!response.ok) {
			const errorText = await response.text();
			console.error(
				`Failed to fetch purposes: ${response.status} ${response.statusText}`,
				errorText,
			);
			throw new Error(`Failed to fetch purposes: ${response.status}`);
		}
		const data: PurposeOption[] = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching purposes from API:", error);
		throw new Error("Could not fetch purposes. Please try again later");
	}
}

function buildFormData(expenseData: ExpenseData): FormData {
	const formData = new FormData();
	formData.append("name", expenseData.name);
	formData.append("amount", expenseData.amount);
	formData.append("date", expenseData.date);
	formData.append("details", expenseData.details);
	formData.append("purpose", expenseData.purpose);

	if (expenseData.notes) {
		formData.append("notes", expenseData.notes);
	}
	if (expenseData.receiptImage) {
		formData.append("receiptImage", expenseData.receiptImage);
	}
	return formData;
}

export async function submitExpense(
	expenseData: ExpenseData,
): Promise<SubmitExpenseResult> {
	// Simulate API response in development
	if (import.meta.env.DEV) {
		console.log("Development: Simulating expense submission");
		await simulateDelay(1500);
		const result: SubmitExpenseResult = {
			id: `exp_${Date.now()}`,
			status: "success" as const,
			message: "Expense report submitted successfully",
			submittedAt: new Date().toISOString(),
		};
		console.log("Submission complete:", result.id);
		return result;
	}

	const formData = buildFormData(expenseData);

	try {
		const response = await fetch(`${BASE_URL}/expenses`, {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			const errorBody = await response.text();
			console.error(
				`HTTP error! status: ${response.status}, body: ${errorBody}`,
			);
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error("API call error:", error);
		throw new Error("Failed to submit expense report");
	}
}
