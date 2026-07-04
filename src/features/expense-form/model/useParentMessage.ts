import { onCleanup } from "solid-js";
import { CONFIG } from "@/constants/config";
import { NAME_LIMITS } from "@/constants/validation";
import { saveUserName } from "@/utils";
import { expenseFormStore } from "./expenseFormStore";

export function useParentMessage() {
  // Skip if not running inside an iframe
  if (window === window.parent) return;

  const handler = (event: MessageEvent) => {
    if (!CONFIG.POSTMESSAGE.ALLOWED_ORIGINS.has(event.origin)) return;

    if (
      event.data?.type === "receipt-snap:set-name" &&
      typeof event.data.name === "string" &&
      event.data.name.length <= NAME_LIMITS.MAX_LENGTH
    ) {
      const name = event.data.name;
      expenseFormStore.setName(name);
      saveUserName(name);
      expenseFormStore.setIsExternalName(true);
    }
  };

  window.addEventListener("message", handler);
  // Use "*" because the parent may be cross-origin; ready contains no sensitive data
  window.parent.postMessage({ type: "receipt-snap:ready" }, "*");

  onCleanup(() => {
    window.removeEventListener("message", handler);
  });
}
