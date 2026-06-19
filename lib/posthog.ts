import posthog from "posthog-js";

let initialized = false;

export function initPostHog() {
  if (typeof window === "undefined" || initialized) return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  posthog.init(key, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    capture_pageview: false,
    autocapture: false,
    disable_session_recording: true,
    disable_surveys: true,
    disable_surveys_automatic_display: true,
    disable_product_tours: true,
    disable_conversations: true,
    loaded: (client) => {
      if (process.env.NODE_ENV === "development") client.debug();
    },
  });

  initialized = true;
}

export function isPostHogInitialized() {
  return initialized;
}

export default posthog;
