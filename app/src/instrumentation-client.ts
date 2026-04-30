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
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
