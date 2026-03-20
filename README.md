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

- **SolidJS 1.9** — Reactive UI framework (fine-grained reactivity, no virtual DOM)
- **Vite 7** — Build tool
- **TypeScript 5.9** — Strict mode enabled
- **CSS Modules + Lightning CSS** — Scoped styles with native nesting and auto vendor prefixes
- **Biome 2** — Linter and formatter
- **Vitest 4** — Unit tests
- **Iconify Icon** — Icon library

## Getting Started

```bash
# Install dependencies
pnpm install

# Start the dev server
pnpm dev

# Open http://localhost:5173
```

## Commands

```bash
pnpm dev          # Start Vite dev server
pnpm build        # Type-check then Vite build
pnpm preview      # Preview production build
pnpm check        # Biome lint + format check
pnpm check:write  # Auto-fix lint + format issues
pnpm test         # Run Vitest
pnpm test:watch   # Vitest in watch mode
```

## Project Structure

```
src/
├── features/
│   └── expense-form/     # Feature module
│       ├── model/        # Business logic: stores, hooks, state
│       └── ui/           # UI components for this feature
│           └── camera/   # Receipt camera/upload components
├── components/
│   ├── ui/               # Shared presentational components (no business logic)
│   └── dev/              # Development tools (DevPanel)
├── hooks/                # Shared cross-feature hooks
├── services/             # API communication
├── types/                # Shared type definitions
├── utils/                # Pure utility functions
├── constants/            # Named constants
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
