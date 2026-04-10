import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
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
