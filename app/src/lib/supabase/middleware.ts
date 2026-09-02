import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function handleAuth(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Public routes: anyone can access these without being logged in.
  // Exact-match paths
  const publicExact = new Set([
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/invite",
    // Public marketing pages
    "/blog",
    "/demo",
    "/help",
    "/migrate",
    "/pricing",
    "/privacy",
    "/terms",
    // PWA + SEO assets
    "/manifest.webmanifest",
    "/robots.txt",
    "/sitemap.xml",
    "/icon",
    "/icon1",
    "/icon2",
    "/icon3",
    "/apple-icon",
    "/favicon.ico",
    "/opengraph-image",
    "/twitter-image",
    // /demo page binary assets — without these the <video> element gets
    // redirected to /login and HTML5 playback fails silently.
    "/demo.mp4",
    "/demo-poster.jpg",
  ]);

  // Path-prefix matches
  const path = request.nextUrl.pathname;
  const isPublicPath =
    publicExact.has(path) ||
    path.startsWith("/blog/") ||
    path.startsWith("/demo/") ||
    path.startsWith("/demo-clips/") ||
    path.startsWith("/help/") ||
    path.startsWith("/invite/") ||
    // Public invoice viewer + its PDF endpoint. Clients open these from
    // an email link without a Phasewise account; the cuid token in the
    // URL is the only credential.
    path.startsWith("/invoice/") ||
    path.startsWith("/api/public/invoices/") ||
    path.startsWith("/api/auth/") ||
    path.startsWith("/api/invitations/") ||
    // Scheduled cron endpoints. Vercel Cron invokes these internally
    // and bypasses the edge middleware, but external manual triggers
    // (curl, `vercel dev`, health checks) previously hit this auth
    // gate first and got 401 before the route's own CRON_SECRET check
    // ran — making the cron routes untestable from outside Vercel.
    // Each cron route enforces its own `Authorization: Bearer
    // CRON_SECRET` check, which is the real gate; the middleware here
    // was redundant defense-in-depth in exchange for real usability
    // loss. Same pattern as /api/stripe/webhook — public at edge,
    // HMAC-verified inside the route.
    path.startsWith("/api/cron/") ||
    // Migration request form on /migrate — accepts a POST from
    // unauthenticated visitors.
    path === "/api/migration-request" ||
    // DB-touch health check for UptimeRobot — keeps Supabase from
    // auto-pausing on idle since the marketing site is static and
    // doesn't query Postgres on every request.
    path === "/api/health" ||
    // Sentry browser-error tunnel (configured as `tunnelRoute` in
    // next.config.ts). Anonymous users on the landing page must be
    // able to POST errors here — otherwise the tunnel just 307s to
    // /login and we lose every client-side error from public pages.
    path.startsWith("/monitoring");

  if (!user && !isPublicPath) {
    // For API routes, return 401 JSON instead of redirecting to /login.
    // NextResponse.redirect() defaults to 307, which preserves POST — so
    // fetch clients follow the redirect, hit /login (page-only, GET-only),
    // and get back 405 + empty body, causing res.json() to throw
    // SyntaxError on the client. Route handlers and client code (e.g.
    // PricingButton on the landing page) already expect a 401 for
    // unauthenticated calls and handle it correctly (redirect to /signup
    // with the intended action preserved).
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login/signup, but NOT away from
  // /reset-password — that page is reached via a recovery link and the user
  // is technically signed in via the recovery session, so we need to let
  // them through to actually update their password.
  if (
    user &&
    (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
