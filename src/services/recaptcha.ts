import { CONFIG } from "@/constants/config";

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string },
      ) => Promise<string>;
    };
  }
}

const TOKEN_TIMEOUT_MS = 10_000;

export async function getReCaptchaToken(action = "submit"): Promise<string> {
  if (typeof window === "undefined" || !window.grecaptcha) {
    console.warn("reCAPTCHA not loaded");
    return "";
  }

  const token = new Promise<string>((resolve, reject) => {
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(CONFIG.RECAPTCHA.SITE_KEY, { action })
        .then(resolve)
        .catch(reject);
    });
  });

  // Without a timeout, a hung grecaptcha call would leave the submit
  // overlay visible forever (no way for the user to recover).
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error("reCAPTCHA token request timed out")),
      TOKEN_TIMEOUT_MS,
    );
  });

  try {
    return await Promise.race([token, timeout]);
  } finally {
    clearTimeout(timeoutId);
  }
}
