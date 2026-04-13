"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  Clock,
  FolderKanban,
  Home,
  Menu,
  Settings,
  Shield,
  Users,
  X,
} from "lucide-react";
import LogoutButton from "./LogoutButton";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Submittals", href: "/submittals", icon: ClipboardList },
  { name: "Time Sheets", href: "/time", icon: Clock },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Team", href: "/settings/team", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

const adminNavigation = [
  { name: "Admin", href: "/admin", icon: Shield },
];

type Props = {
  user: {
    fullName: string;
    email: string;
    role: string;
    organization?: { name: string } | null;
  };
};

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

function SidebarContent({ user, onNavigate }: Props & { onNavigate?: () => void }) {
  const pathname = usePathname();
  const isAdmin = user.role === "OWNER" || user.role === "ADMIN";

  return (
    <>
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/[0.06]">
        <PhaseLogo />
        <span className="text-[17px] font-semibold tracking-[-0.3px] text-white">
          phase<em className="not-italic font-light text-[#52B788]">wise</em>
        </span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                isActive
                  ? "text-white bg-white/[0.08]"
                  : "text-white/55 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <item.icon className="h-4 w-4" strokeWidth={1.75} />
              {item.name}
            </Link>
          );
        })}

        {/* Admin section — owner/admin only */}
        {isAdmin && (
          <>
            <div className="pt-3 mt-3 border-t border-white/[0.06]">
              <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                Admin
              </div>
            </div>
            {adminNavigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                    isActive
                      ? "text-white bg-white/[0.08]"
                      : "text-white/55 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <item.icon className="h-4 w-4" strokeWidth={1.75} />
                  {item.name}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* User identity widget */}
      <div className="border-t border-white/[0.06] px-3 py-4">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <Avatar name={user.fullName} />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-white truncate">{user.fullName}</div>
            <div className="text-[11px] text-white/50 truncate">{user.email}</div>
          </div>
        </div>
        {user.organization && (
          <div className="mt-2 px-2 text-[11px] text-white/40 truncate">
            {user.organization.name}
          </div>
        )}
        <div className="mt-3 px-2">
          <LogoutButton />
        </div>
      </div>
    </>
  );
}

export default function MobileSidebar({ user }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar — visible below lg breakpoint */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0D2218] border-b border-white/[0.06] h-14 flex items-center px-4 gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-white/70 hover:text-white transition-colors p-1"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" strokeWidth={1.75} />
        </button>
        <PhaseLogo />
        <span className="text-[16px] font-semibold tracking-[-0.3px] text-white">
          phase<em className="not-italic font-light text-[#52B788]">wise</em>
        </span>
      </div>

      {/* Desktop sidebar — always visible at lg+ */}
      <aside className="hidden lg:flex w-60 bg-[#0D2218] text-white flex-col border-r border-[#1A2E22]">
        <SidebarContent user={user} />
      </aside>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <aside
            className="w-72 max-w-[85vw] h-full bg-[#0D2218] text-white flex flex-col shadow-2xl pw-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-1 z-10"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent user={user} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
