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

  return prisma.user.findUnique({
    where: { authId: user.id },
    include: { organization: true },
  });
}
