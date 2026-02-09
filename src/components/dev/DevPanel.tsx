import { createSignal, Show } from "solid-js";
import {
	getDevForceError,
	getDevMockEnabled,
	setDevForceError,
	setDevMockEnabled,
} from "@/utils/localStorage";
import styles from "./DevPanel.module.css";

function Toggle(props: {
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
	disabled?: boolean;
}) {
	return (
		<label
			class={`${styles.toggleRow} ${props.disabled ? styles.toggleRowDisabled : ""}`}
		>
			<span class={styles.toggleLabel}>{props.label}</span>
			<button
				type="button"
				role="switch"
				aria-checked={props.checked}
				disabled={props.disabled}
				class={`${styles.toggleButton} ${props.checked ? styles.toggleActive : styles.toggleInactive}`}
				onClick={() => props.onChange(!props.checked)}
			>
				<span
					class={`${styles.toggleKnob} ${props.checked ? styles.toggleKnobOn : styles.toggleKnobOff}`}
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
		<div class={styles.container}>
			<Show
				when={open()}
				fallback={
					<button
						type="button"
						class={styles.openButton}
						onClick={() => setOpen(true)}
					>
						DEV
					</button>
				}
			>
				<div class={styles.panel}>
					<button
						type="button"
						class={styles.closeButton}
						onClick={() => setOpen(false)}
					>
						<svg
							class={styles.closeIcon}
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-label="Close"
						>
							<title>Close</title>
							<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
						</svg>
					</button>
					<div class={styles.panelTitle}>
						<span class={styles.titleText}>DEV</span>
					</div>
					<div class={styles.toggleList}>
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
