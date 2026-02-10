# Receipt Snap

A simple, mobile-first receipt management and expense submission app. Snap a photo of your receipt, fill out the expense form, and submit it to any backend API.

## Features

- 📸 **Receipt Capture** — Camera, file upload, or no-image entry
- 📝 **Expense Form** — Name, amount, date, description, purpose, and notes
- 📱 **Mobile-First UI** — Optimized for smartphone use
- ✅ **Real-Time Validation** — Instant form feedback as you type
- 🗜️ **Image Compression** — Automatic HEIC/HEIF conversion and size optimization
- 🔄 **Onboarding** — First-time name setup with local storage persistence
- 🖼️ **iframe Embedding** — Parent app can set user name via `postMessage`

## Tech Stack

- **SolidJS** — Reactive UI framework
- **Vite** — Build tool
- **CSS Modules + Lightning CSS** — Scoped styles with native nesting and auto vendor prefixes
- **TypeScript** — Strict mode enabled
- **Biome** — Linter and formatter
- **Iconify Icon** — Icon library

## Getting Started

```bash
# Install dependencies
pnpm install

# Start the dev server
pnpm dev

# Open http://localhost:5173
```

## Project Structure

```
src/
├── components/
│   ├── ui/               # Presentational components
│   ├── features/         # Domain-specific components
│   └── dev/              # Development tools (DevPanel)
├── hooks/                # Business logic and validation
├── stores/               # Global state management
├── services/             # API communication
├── types/                # Shared type definitions
├── utils/                # Utility functions
├── constants/            # Configuration and constants
└── layouts/              # Page layout components
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
VITE_API_BASE_URL=your_backend_api_url
```

- `VITE_RECAPTCHA_SITE_KEY` — Google reCAPTCHA v3 site key
- `VITE_API_BASE_URL` — Backend API URL (e.g. Google Apps Script, Express, etc.)

## iframe Embedding

Receipt Snap can be embedded as an iframe within a same-origin parent app. The parent can provide the user's name via `postMessage`, which skips onboarding and locks the name field.

- The iframe sends `receipt-snap:ready` on mount; the parent responds with `receipt-snap:set-name`
- Same-origin only — cross-origin messages are ignored
- When not in an iframe, the listener is not registered and standalone behavior is unchanged
