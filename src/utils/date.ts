export function getTodayDateString(): string {
	const today = new Date();
	return formatDateForInput(today);
}

export function formatDateForInput(date: Date): string {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function formatDateForDisplay(dateString: string): string {
	const date = new Date(dateString);
	return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}
