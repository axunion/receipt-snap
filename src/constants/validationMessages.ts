export const VALIDATION_MESSAGES = {
	IMAGE: {
		INVALID_TYPE: "JPEG / PNG / HEIC形式の画像のみ使用できます。",
		FILE_TOO_LARGE: "画像サイズは12MB以下にしてください。",
		LARGE_FILE_WARNING:
			"画像サイズが大きいため処理に時間がかかる可能性があります。",
		HEIC_INFO:
			"HEIC画像をJPEGに変換しました。ブラウザの対応状況により、一部環境では処理できない場合があります。",
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
			"レシート画像または未提出理由のいずれかを入力してください。",
	},
} as const;
