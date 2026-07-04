import { For, Show } from "solid-js";
import type { SelectOption } from "@/types";
import styles from "./Select.module.css";

interface SelectProps {
  id?: string;
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onSelect?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  class?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

export function Select(props: SelectProps) {
  return (
    <select
      id={props.id}
      value={props.value ?? ""}
      onChange={(e) => props.onSelect?.(e.currentTarget.value)}
      required={props.required}
      disabled={props.disabled}
      class={`${styles.select} ${props.class ?? ""}`}
      aria-invalid={props["aria-invalid"]}
      aria-describedby={props["aria-describedby"]}
    >
      <Show when={props.placeholder}>
        <option value="" disabled>
          {props.placeholder}
        </option>
      </Show>
      <For each={props.options}>
        {(option) => <option value={option.value}>{option.label}</option>}
      </For>
    </select>
  );
}
