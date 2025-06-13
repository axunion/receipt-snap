# Receipt Snap API Specification

## Endpoints

### 1. Get Purposes
**GET** `/`

**Success Response**
```json
[
  { "value": "event", "label": "イベント" },
  { "value": "transport", "label": "交通費" }
]
```

### 2. Submit Expense
**POST** `/`

**Request**: `multipart/form-data`
- `name` (string): Expense name
- `amount` (string): Amount (e.g., "1500")
- `date` (string): Date (ISO format: "2025-06-14")
- `details` (string): Description
- `purpose` (string): Purpose value
- `notes` (string, optional): Additional notes
- `receiptImage` (File, optional): Receipt image

**Success Response**
```json
{
  "success": true
}
```

**Error Response**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Invalid input data"
  }
}
```
