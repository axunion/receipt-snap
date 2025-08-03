export const VALIDATION_MESSAGES = {
	IMAGE: {
		INVALID_TYPE: "JPEG、PNG、WebP、HEIC/HEIF形式の画像のみ対応しています。",
		FILE_TOO_LARGE: "ファイルサイズは100MB以下にしてください。",
		LARGE_FILE_WARNING:
			"ファイルサイズが大きいため、処理に時間がかかる場合があります。",
		HEIC_WARNING: "HEIC/HEIF形式は一部環境で表示できない場合があります。",
	},
	FORM: {
		NAME_REQUIRED: "名前は必須項目です。",
		AMOUNT_INVALID: "金額は0より大きい値を入力してください。",
		AMOUNT_TOO_LARGE: "金額は1,000,000以下で入力してください。",
		DATE_REQUIRED: "支払日を入力してください。",
		DATE_INVALID_FORMAT: "日付はYYYY-MM-DD形式で入力してください。",
		DATE_INVALID_NUMBERS: "日付には有効な数字を入力してください。",
		MONTH_INVALID: "月は1〜12の範囲で入力してください。",
		DAY_INVALID: "日は1〜31の範囲で入力してください。",
		DATE_NOT_EXIST: "存在しない日付です（例：2月30日などは入力できません）。",
		FUTURE_DATE: "未来の日付は入力できません。",
		DETAILS_REQUIRED: "内訳は必須項目です。",
		DESTINATION_REQUIRED: "対象は必須項目です。",
		RECEIPT_REQUIRED:
			"レシート書画像または未提出理由のいずれかを入力してください。",
	},
} as const;
