/**
 * 日付関連のユーティリティ関数
 */

/**
 * 日付フォーマット関数
 * @param date Date オブジェクト
 * @returns YYYY-MM-DD形式の文字列
 */
export function formatDateForInput(date: Date): string {
	return date.toISOString().split("T")[0];
}

/**
 * 日付文字列を人間が読みやすい形式にフォーマット
 * @param dateString YYYY-MM-DD形式の文字列
 * @returns YYYY年MM月DD日形式の文字列
 */
export function formatDateForDisplay(dateString: string): string {
	const date = new Date(dateString);
	return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

/**
 * 現在日時をISO形式で取得
 */
export function getCurrentISOString(): string {
	return new Date().toISOString();
}

/**
 * 日付の差分を計算（日数）
 */
export function getDaysDifference(date1: Date, date2: Date): number {
	const timeDifference = Math.abs(date2.getTime() - date1.getTime());
	return Math.ceil(timeDifference / (1000 * 3600 * 24));
}
