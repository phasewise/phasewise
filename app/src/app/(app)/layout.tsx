import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, Clock, FolderKanban, Home, Settings, Users } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/auth";
import LogoutButton from "./_components/LogoutButton";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Time", href: "/time", icon: Clock },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Team", href: "/settings/team", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

function PhaseLogo() {
  return (
    <div className="flex flex-col gap-[3px] justify-center">
      <span className="block h-1 rounded-sm" style={{ width: 22, background: "#52B788" }} />
      <span className="block h-1 rounded-sm" style={{ width: 16, background: "#40916C" }} />
      <span className="block h-1 rounded-sm" style={{ width: 20, background: "#2D6A4F" }} />
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  // Initials from full name — first letter of first word + first letter of last word
  const parts = name.trim().split(/\s+/);
  const initials =
    parts.length === 1
      ? parts[0].slice(0, 2).toUpperCase()
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();

  return (
    <div className="w-9 h-9 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
      {initials}
    </div>
  );
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-[#F7F9F7]">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0D2218] text-white flex flex-col border-r border-[#1A2E22]">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/[0.06]">
          <PhaseLogo />
          <span className="text-[17px] font-semibold tracking-[-0.3px] text-white">
            phase<em className="not-italic font-light text-[#52B788]">wise</em>
          </span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/55 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
            >
              <item.icon className="h-4 w-4" strokeWidth={1.75} />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User identity widget */}
        <div className="border-t border-white/[0.06] px-3 py-4">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
            <Avatar name={currentUser.fullName} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-white truncate">{currentUser.fullName}</div>
              <div className="text-[11px] text-white/50 truncate">{currentUser.email}</div>
            </div>
          </div>
          {currentUser.organization && (
            <div className="mt-2 px-2 text-[11px] text-white/40 truncate">
              {currentUser.organization.name}
            </div>
          )}
          <div className="mt-3 px-2">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-[#F7F9F7]">{children}</main>
    </div>
  );
}
