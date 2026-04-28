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
  ]);

  // Path-prefix matches
  const path = request.nextUrl.pathname;
  const isPublicPath =
    publicExact.has(path) ||
    path.startsWith("/blog/") ||
    path.startsWith("/invite/") ||
    path.startsWith("/api/auth/") ||
    path.startsWith("/api/invitations/");

  if (!user && !isPublicPath) {
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
