import { createClient } from "./server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const dbUser = await prisma.user.findUnique({
    where: { authId: user.id },
    include: { organization: true },
  });

  // Treat deactivated users as logged-out so the layout redirects them
  // to /login on their next request. This closes the gap where toggling
  // isActive=false in the team page didn't actually revoke access until
  // the Supabase session naturally expired.
  if (!dbUser || !dbUser.isActive) {
    // Sign the user out of Supabase so they don't loop login → dashboard
    // → login. Best effort — don't throw if sign-out fails.
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    return null;
  }

  return dbUser;
}
