# Receipt Snap

A mobile-first receipt management and expense submission app. Snap a photo of a receipt, fill out the expense form, and submit it to any backend API.

The frontend is **backend-agnostic** — any server that accepts the JSON payload and returns the expected response shape works.

## Features

- **Receipt Capture** — Camera, file upload, or no-image entry with a reason
- **Expense Form** — Name, amount, date, description, destination, and notes
- **Mobile-First UI** — Optimized for smartphone use
- **Real-Time Validation** — Instant form feedback as you type
- **Image Compression** — Automatic HEIC/HEIF conversion and resize (900×1600, 70% JPEG)
- **Onboarding** — First-time name setup with local storage persistence
- **iframe Embedding** — Parent app can inject user name via `postMessage`

## Getting Started

### Prerequisites

- Node.js 24 (via [Volta](https://volta.sh/) or directly)
- pnpm

### Setup

```bash
# Install dependencies
pnpm install

# Create environment file (see Environment Variables below)
cp .env.example .env.local

# Start the dev server
pnpm dev
# → http://localhost:5173
```

In development mode the app runs with **mock data** by default — no backend needed.

## Commands

```bash
pnpm dev          # Start Vite dev server
pnpm build        # Type-check (tsc -b) then Vite build
pnpm preview      # Preview production build
pnpm check        # Biome lint + format check
pnpm check:write  # Auto-fix lint + format issues
pnpm test         # Run Vitest (unit tests)
pnpm test:watch   # Vitest in watch mode
```

## Environment Variables

Create a `.env.local` file in the project root (never committed):

```env
VITE_API_BASE_URL=https://your-backend.example.com/api
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_v3_site_key

# Optional: allow postMessage from additional origins (comma-separated)
# VITE_ALLOWED_ORIGINS=https://parent.example.com,http://localhost:3000
```

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Yes (prod) | Backend API base URL. Both the GET and POST endpoints share this URL. |
| `VITE_RECAPTCHA_SITE_KEY` | Yes (prod) | Google reCAPTCHA v3 site key. |
| `VITE_ALLOWED_ORIGINS` | No | Comma-separated list of origins allowed to send `postMessage` events. `window.location.origin` is always allowed and does not need to be listed. Omit to restrict to same-origin only. |

## Backend API Reference

Both endpoints share the same `VITE_API_BASE_URL`. The app expects JSON responses with a `result` discriminant (`"done"` or `"error"`).

### GET — Fetch destinations

Fetches the list of expense destinations shown in the form dropdown.

**Request**

```
GET {VITE_API_BASE_URL}
```

No request body or query parameters required.

**Response — success**

```json
{
  "result": "done",
  "data": [
    { "value": "project_a", "label": "Project A" },
    { "value": "project_b", "label": "Project B" }
  ]
}
```

**Response — error**

```json
{
  "result": "error",
  "error": "Human-readable error message"
}
```

### POST — Submit expense

Submits the completed expense form.

**Request**

```
POST {VITE_API_BASE_URL}
Content-Type: (intentionally omitted — see note below)

{
  "recaptchaToken": "03AGdBq...",
  "name": "Taro Yamada",
  "amount": "1500",
  "date": "2026-04-03",
  "details": "Team lunch",
  "destination": "project_a",
  "notes": "Optional free text",
  "receiptImage": "data:image/jpeg;base64,...",
  "noImageReason": ""
}
```

| Field | Type | Description |
|---|---|---|
| `recaptchaToken` | `string` | Google reCAPTCHA v3 token obtained at submit time. |
| `name` | `string` | Submitter name (max 100 characters). |
| `amount` | `string` | Amount as a numeric string (1–1,000,000). |
| `date` | `string` | Date in `YYYY-MM-DD` format. Must not be a future date. |
| `details` | `string` | Expense description (required). |
| `destination` | `string` | Destination `value` from the destinations list (required). |
| `notes` | `string` | Optional free-text notes. Empty string if unused. |
| `receiptImage` | `string` | Base64-encoded JPEG receipt image. Empty string if `noImageReason` is provided. |
| `noImageReason` | `string` | Reason for no receipt image. Empty string if `receiptImage` is provided. Either this or `receiptImage` must be non-empty. |

> **Note on `Content-Type`:** The header is intentionally omitted from the POST request to avoid CORS preflight (`OPTIONS`) requests. This is required for Google Apps Script backends, which cannot handle preflight requests. Parse the body as text and deserialize with `JSON.parse` on the server side. If your backend requires `Content-Type: application/json`, add it in `src/services/api.ts`.

**Response — success**

```json
{ "result": "done" }
```

**Response — error**

```json
{
  "result": "error",
  "error": "Human-readable error message"
}
```

## iframe Embedding

Receipt Snap can be embedded as an iframe. The parent app can inject the user's name via `postMessage`, which skips onboarding and makes the name field read-only.

### Protocol

```
[iframe: Receipt Snap]                        [Parent app]
        |                                          |
        |── { type: "receipt-snap:ready" } ───────>|  sent on mount
        |                                          |
        |<── { type: "receipt-snap:set-name",      |  parent responds
        |      name: "Taro Yamada" }               |
```

### Allowing cross-origin parents

By default, only same-origin messages are accepted. To allow a parent on a different origin (e.g. a subdomain or localhost during development), add it to `VITE_ALLOWED_ORIGINS`:

```env
VITE_ALLOWED_ORIGINS=https://parent.example.com,http://localhost:3000
```

### Behavior when name is set externally

- Onboarding overlay is skipped
- Name field is displayed as read-only and is not clickable
- The externally set name persists even after the form is reset (intentional — scoped to the iframe session)

### Security

- Only activates inside an iframe — standalone behavior is unaffected
- Allowed origins are controlled via `VITE_ALLOWED_ORIGINS`; `window.location.origin` is always implicitly allowed
- `name` must be a non-empty string, max 100 characters — silently ignored if violated
- All message types use the `receipt-snap:` namespace prefix to avoid collisions

## Development

### Mock mode

When running `pnpm dev`, the app uses mock data by default — no backend needed. A **DevPanel** in the bottom-right corner of the screen lets you:

- Toggle mock mode on/off
- Force API error responses to test error handling

### Testing

```bash
pnpm test         # Run all unit tests once
pnpm test:watch   # Watch mode
```

Tests use Vitest + `@solidjs/testing-library` with `happy-dom`. Test files are co-located with source files (`*.test.ts` / `*.test.tsx`).

## Project Structure

```
src/
├── features/
│   └── expense-form/         # Feature module
│       ├── model/            # Business logic: stores, hooks, state
│       └── ui/               # UI components
│           └── camera/       # Receipt capture components
├── components/
│   ├── ui/                   # Shared presentational components
│   └── dev/                  # DevPanel (development only)
├── hooks/                    # Shared hooks
├── services/                 # API communication (fetch wrapper, reCAPTCHA)
├── types/                    # TypeScript type definitions
├── utils/                    # Pure utility functions
├── constants/                # Named constants (validation limits, messages, config)
└── layouts/                  # Page layout components
```

## Tech Stack

- **SolidJS 1.9** — Fine-grained reactivity, no virtual DOM
- **Vite 7** — Build tool
- **TypeScript 5.9** — Strict mode
- **CSS Modules + Lightning CSS** — Scoped styles, native nesting, auto vendor prefixes
- **Biome 2** — Linter and formatter
- **Vitest 4** — Unit tests
