import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth";
import MobileSidebar from "./_components/MobileSidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const user = {
    fullName: currentUser.fullName,
    email: currentUser.email,
    organization: currentUser.organization
      ? { name: currentUser.organization.name }
      : null,
  };

  return (
    <div className="flex h-screen bg-[#F7F9F7]">
      {/* MobileSidebar handles both the mobile hamburger + drawer AND
          the desktop always-visible sidebar, using lg: breakpoint. */}
      <MobileSidebar user={user} />

      {/* Main content — add top padding on mobile so content doesn't
          hide behind the fixed mobile top bar (h-14 = 56px). On
          desktop the sidebar is always visible so no top padding. */}
      <main className="flex-1 overflow-auto bg-[#F7F9F7] pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
