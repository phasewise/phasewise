import { NextResponse, type NextRequest } from "next/server";

// Next.js 16 renamed Middleware to Proxy. The file lives at src/proxy.ts
// and exports a function named `proxy`. See:
// node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md
export async function proxy(request: NextRequest) {
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
