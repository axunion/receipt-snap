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
	const parts = dateString.split("-");
	const year = parts[0];
	const month = Number.parseInt(parts[1], 10);
	const day = Number.parseInt(parts[2], 10);
	return `${year}年${month}月${day}日`;
}
