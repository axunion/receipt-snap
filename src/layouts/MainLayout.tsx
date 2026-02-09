import { type JSX, Show } from "solid-js";
import styles from "./MainLayout.module.css";

interface MainLayoutProps {
	children: JSX.Element;
	title?: string;
}

export function MainLayout(props: MainLayoutProps) {
	return (
		<div class={styles.wrapper}>
			<div class={styles.container}>
				<Show when={props.title}>
					<header class={styles.header}>
						<h1 class={styles.title}>{props.title}</h1>
					</header>
				</Show>
				{props.children}
			</div>
		</div>
	);
}
