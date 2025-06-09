export function formatDateForInput(date: Date): string {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	return `${year}-${month}-${day}`;
}

/**
 * Format date string for Japanese display (YYYY年MM月DD日)
 */
export function formatDateForDisplay(dateString: string): string {
	const date = new Date(dateString);
	return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export function getCurrentISOString(): string {
	return new Date().toISOString();
}

/**
 * Calculate difference between two dates in days
 */
export function getDaysDifference(date1: Date, date2: Date): number {
	const timeDifference = Math.abs(date2.getTime() - date1.getTime());
	return Math.ceil(timeDifference / (1000 * 3600 * 24));
}
