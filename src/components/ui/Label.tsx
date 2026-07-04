import { Icon } from "@iconify-icon/solid";
import { type JSX, Show } from "solid-js";
import styles from "./Label.module.css";

interface LabelProps {
  children: JSX.Element;
  for?: string;
  required?: boolean;
  class?: string;
  icon?: string;
}

export function Label(props: LabelProps) {
  return (
    <label for={props.for} class={`${styles.label} ${props.class ?? ""}`}>
      <div class={styles.content}>
        <Show when={props.icon}>
          {(icon) => <Icon icon={icon()} width="1.2em" height="1.2em" />}
        </Show>
        <span class={styles.text}>
          {props.children}
          <Show when={props.required}>
            <Icon
              icon="material-symbols:asterisk-rounded"
              width="8"
              height="8"
              class={styles.required}
            />
          </Show>
        </span>
      </div>
    </label>
  );
}
