import { NextResponse, type NextRequest } from "next/server";

// Next.js 16 renamed Middleware to Proxy. The file lives at src/proxy.ts
// and exports a function named `proxy`. See:
// node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md

// Routes excluded from origin-based CSRF protection. Webhooks and
// invitation-acceptance flows are legitimately invoked cross-origin.
const CSRF_BYPASS = [
  "/api/stripe/webhook",
  "/api/cron/",
  // Public invitation accept can be hit without an origin if the user
  // pastes the link; rate-limit (Med #11/#12) already covers brute-force.
  "/api/invitations/",
];

export async function proxy(request: NextRequest) {
  // Defense-in-depth CSRF: state-changing requests on API routes must
  // come from our own origin. SameSite=Lax cookies block most cross-site
  // POSTs already, but this gives us a hard server-side gate that doesn't
  // depend on browser behavior. We accept Origin OR Referer because some
  // clients (Safari with strict privacy modes) strip Origin.
  const isMutation =
    request.method !== "GET" &&
    request.method !== "HEAD" &&
    request.method !== "OPTIONS";
  const isApi = request.nextUrl.pathname.startsWith("/api/");
  const isBypassed = CSRF_BYPASS.some((p) => request.nextUrl.pathname.startsWith(p));

  if (isMutation && isApi && !isBypassed) {
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");
    const expected = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    const sameOrigin =
      (origin && origin === expected) ||
      (referer && referer.startsWith(expected + "/"));
    if (!sameOrigin) {
      return NextResponse.json(
        { error: "Cross-origin request rejected." },
        { status: 403 }
      );
    }
  }

  // Skip auth check if Supabase is not configured
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next();
  }

  // Dynamic import to avoid errors when env vars aren't set
  const { handleAuth } = await import("@/lib/supabase/middleware");
  return await handleAuth(request);
}

export const config = {
  matcher: [
    // Match all paths except static assets and API routes that handle their
    // own auth (Stripe webhook needs raw body, auth/setup is called right
    // after signup before the session cookie is set).
    "/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook|api/auth/setup|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
