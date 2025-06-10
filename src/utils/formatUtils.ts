export function formatAmount(value: string): string {
	const numbersOnly = value.replace(/[^\d]/g, "");

	if (!numbersOnly) return "";

	const withoutLeadingZeros = numbersOnly.replace(/^0+/, "") || "0";

	return Number(withoutLeadingZeros).toLocaleString();
}

export function parseAmount(formattedValue: string): number {
	const numbersOnly = formattedValue.replace(/[^\d]/g, "");
	return numbersOnly ? Number(numbersOnly) : 0;
}

export function toDisplayValue(rawValue: string): string {
	if (!rawValue) return "";
	return formatAmount(rawValue);
}
