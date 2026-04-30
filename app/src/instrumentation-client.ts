// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://62b44f6a597c40a827b07503d686ce53@o4511310959738880.ingest.us.sentry.io/4511310970617856",

  // 100% of traces in early stage. Lower as traffic grows.
  tracesSampleRate: 1,

  // PII off by default — see sentry.server.config.ts for rationale.
  sendDefaultPii: false,

  // Drop errors that originate outside our own code. These are almost
  // always browser-extension or injected-script noise that we can't fix
  // and don't want polluting the Issues feed. Caught a real instance of
  // this on day one: a HeadlessChrome bot with a Chrome extension threw
  // "SyntaxError: Unexpected token '<'" from app:/// — 5 events, 0 users.
  denyUrls: [
    // Chrome's internal app:/// scheme used by extensions
    /^app:\/\//i,
    // Browser extension protocols
    /^chrome-extension:\/\//i,
    /^moz-extension:\/\//i,
    /^safari-extension:\/\//i,
    /^safari-web-extension:\/\//i,
    // Common third-party injection points
    /extensions\//i,
    /^chrome:\/\//i,
  ],

  // Drop errors with these messages. The "Unexpected token '<'" pattern
  // is the classic HTML-served-instead-of-JS error which is almost always
  // a stale chunk reference from an old browser tab after a deploy — not
  // a real bug. Real users hit it once, hard-refresh, and recover.
  ignoreErrors: [
    "Unexpected token '<'",
    "Loading chunk",
    "ChunkLoadError",
    // ResizeObserver loop is a benign browser quirk; not a real error.
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
