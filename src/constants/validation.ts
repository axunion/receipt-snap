// File size validation settings
export const FILE_SIZE_LIMITS = {
	MAX_SIZE_BYTES: 12 * 1024 * 1024, // 12MB
	WARNING_THRESHOLD_BYTES: 6 * 1024 * 1024, // 6MB
} as const;

// Amount validation settings
export const AMOUNT_LIMITS = {
	MIN_AMOUNT: 0,
	MAX_AMOUNT: 1_000_000, // 1,000,000円
} as const;

// Date validation settings
export const DATE_LIMITS = {
	MIN_MONTH: 1,
	MAX_MONTH: 12,
	MIN_DAY: 1,
	MAX_DAY: 31,
} as const;
