"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * Per-segment error boundary for all authenticated app routes.
 *
 * Without this, any uncaught render error inside (app)/* falls through
 * to global-error.tsx which replaces the ENTIRE app shell — including
 * the sidebar — with a bare error page. With this boundary, a crash on
 * /admin/billing keeps the sidebar visible and offers a Reload action,
 * so the user can navigate away to a working page instead of being
 * stuck staring at a white screen.
 *
 * Sentry capture is wired so production crashes show up in the dashboard
 * with stack traces + source maps. Free even when no error.tsx exists,
 * but explicit capture here adds the route segment as a tag.
 */
export default function AppRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error, {
      tags: { boundary: "app-segment" },
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F7F9F7]">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E2EBE4] shadow-sm p-8 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mb-5">
          <AlertTriangle className="w-6 h-6 text-rose-600" strokeWidth={1.75} />
        </div>
        <h1 className="font-serif text-2xl text-[#1A2E22] mb-2">Something went wrong</h1>
        <p className="text-sm text-[#3D5C48] leading-relaxed">
          We hit an unexpected error loading this page. The team has been notified
          automatically.
        </p>
        {/* Digest is the Next.js opaque error ID — useful when reporting to
            support without leaking the underlying stack trace. */}
        {error.digest && (
          <p className="mt-3 text-[11px] font-mono text-[#A3BEA9]">
            ref: {error.digest}
          </p>
        )}
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-[#E2EBE4] bg-white text-[#1A2E22] hover:bg-[#F7F9F7] transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
