import { createSignal, Show } from "solid-js";
import {
	getDevForceError,
	getDevMockEnabled,
	setDevForceError,
	setDevMockEnabled,
} from "@/utils/localStorage";

function Toggle(props: {
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
	disabled?: boolean;
}) {
	return (
		<label
			class={`flex items-center justify-between gap-4 ${props.disabled ? "opacity-40" : ""}`}
		>
			<span class="text-xs text-slate-300">{props.label}</span>
			<button
				type="button"
				role="switch"
				aria-checked={props.checked}
				disabled={props.disabled}
				class={`relative inline-flex !min-h-0 !min-w-0 h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
					props.checked ? "bg-sky-500" : "bg-slate-600"
				} ${props.disabled ? "cursor-not-allowed" : ""}`}
				onClick={() => props.onChange(!props.checked)}
			>
				<span
					class={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
						props.checked ? "translate-x-6.5" : "translate-x-0.5"
					}`}
				/>
			</button>
		</label>
	);
}

export function DevPanel() {
	const [open, setOpen] = createSignal(false);
	const [mockEnabled, setMockEnabled] = createSignal(getDevMockEnabled());
	const [forceError, setForceError] = createSignal(getDevForceError());

	const handleMockToggle = (checked: boolean) => {
		setDevMockEnabled(checked);
		setMockEnabled(checked);
	};

	const handleForceErrorToggle = (checked: boolean) => {
		setDevForceError(checked);
		setForceError(checked);
	};

	return (
		<div class="fixed bottom-4 right-4 z-50">
			<Show
				when={open()}
				fallback={
					<button
						type="button"
						class="rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-amber-400 shadow-lg ring-1 ring-slate-700 hover:bg-slate-700"
						onClick={() => setOpen(true)}
					>
						DEV
					</button>
				}
			>
				<div class="relative w-52 rounded-xl bg-slate-800 px-4 pt-4 pb-4 shadow-xl ring-1 ring-slate-700">
					<button
						type="button"
						class="absolute top-2 right-2 flex !min-h-0 !min-w-0 h-6 w-6 items-center justify-center rounded-full text-slate-500 hover:bg-slate-700 hover:text-slate-300"
						onClick={() => setOpen(false)}
					>
						<svg
							class="h-3.5 w-3.5"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-label="Close"
						>
							<title>Close</title>
							<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
						</svg>
					</button>
					<div class="mb-3">
						<span class="text-xs font-bold text-amber-400">DEV</span>
					</div>
					<div class="space-y-2.5">
						<Toggle
							label="Mock API"
							checked={mockEnabled()}
							onChange={handleMockToggle}
						/>
						<Toggle
							label="Force Error"
							checked={forceError()}
							onChange={handleForceErrorToggle}
							disabled={!mockEnabled()}
						/>
					</div>
				</div>
			</Show>
		</div>
	);
}
