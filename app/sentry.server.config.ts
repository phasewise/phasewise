// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://62b44f6a597c40a827b07503d686ce53@o4511310959738880.ingest.us.sentry.io/4511310970617856",

  // 100% of traces in early stage — visibility over cost. Lower to ~0.2
  // once traffic grows and Sentry plan limits start to bite.
  tracesSampleRate: 1,

  // PII off by default for a B2B billing tool. Phasewise touches
  // salaries, billing rates, client emails, financial reports — we
  // don't want any of that flowing into Sentry without an explicit
  // decision. Re-enable per-event with Sentry.setUser({ id }) when we
  // want to know which user hit a given error.
  sendDefaultPii: false,
});
