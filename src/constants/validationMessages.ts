export const VALIDATION_MESSAGES = {
	IMAGE: {
		INVALID_TYPE: "Only JPEG, PNG, WebP, HEIC/HEIF image files are supported.",
		FILE_TOO_LARGE: "File size must be 100MB or less.",
		LARGE_FILE_WARNING: "Large file. Processing may take some time.",
		HEIC_WARNING: "HEIC/HEIF file. May not be viewable in all environments.",
	},
	FORM: {
		NAME_REQUIRED: "Name is required.",
		AMOUNT_INVALID: "Amount must be greater than 0.",
		AMOUNT_TOO_LARGE: "Amount must be 1,000,000 or less.",
		DATE_REQUIRED: "Payment date is required.",
		DATE_INVALID_FORMAT: "Date must be in YYYY-MM-DD format.",
		DATE_INVALID_NUMBERS: "Please use valid numbers for the date.",
		MONTH_INVALID: "Month must be between 1 and 12.",
		DAY_INVALID: "Day must be between 1 and 31.",
		DATE_NOT_EXIST:
			"Please enter a valid date (e.g., February 30th does not exist).",
		FUTURE_DATE: "Future dates are not allowed.",
		DETAILS_REQUIRED: "Details are required.",
		DESTINATION_REQUIRED: "Destination is required.",
		RECEIPT_REQUIRED:
			"Either a receipt image or a reason for not providing one is required.",
	},
} as const;
