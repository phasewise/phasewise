"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  ClipboardList,
  Clock,
  FolderKanban,
  HelpCircle,
  Home,
  Leaf,
  Menu,
  Settings,
  Shield,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import LogoutButton from "./LogoutButton";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Clients", href: "/clients", icon: Building2 },
  { name: "Submittals", href: "/submittals", icon: ClipboardList },
  { name: "Plants", href: "/plants", icon: Leaf },
  { name: "Compliance", href: "/compliance", icon: ShieldCheck },
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
    photoUrl?: string | null;
    organization?: { name: string } | null;
  };
  notifications?: {
    pendingApprovals: number;
    draftInvoices: number;
    overdueSubmittals: number;
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

function Avatar({ name, photoUrl }: { name: string; photoUrl?: string | null }) {
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name}
        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
      />
    );
  }

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

function NavBadge({ count, tone = "alert" }: { count: number; tone?: "alert" | "info" }) {
  if (count <= 0) return null;
  const toneClasses =
    tone === "alert"
      ? "bg-rose-500/90 text-white"
      : "bg-[#52B788] text-[#0D2218]";
  return (
    <span
      className={`ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-[10px] font-semibold ${toneClasses}`}
      title={`${count} item${count === 1 ? "" : "s"} need attention`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

function SidebarContent({
  user,
  notifications,
  onNavigate,
}: Props & { onNavigate?: () => void }) {
  const pathname = usePathname();
  const isAdmin = user.role === "OWNER" || user.role === "ADMIN";
  const counts = notifications ?? {
    pendingApprovals: 0,
    draftInvoices: 0,
    overdueSubmittals: 0,
  };

  // Map nav hrefs to their relevant notification counts. Items with no
  // applicable count just render unchanged.
  const badgeFor = (href: string): number => {
    if (href === "/time") return counts.pendingApprovals;
    if (href === "/submittals") return counts.overdueSubmittals;
    return 0;
  };

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
          const badge = badgeFor(item.href);

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
              <NavBadge count={badge} />
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
                  <NavBadge count={counts.draftInvoices} tone="info" />
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* User identity widget */}
      <div className="border-t border-white/[0.06] px-3 py-4">
        <Link
          href="/settings/profile"
          onClick={onNavigate}
          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
          title="Edit profile"
        >
          <Avatar name={user.fullName} photoUrl={user.photoUrl} />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-white truncate">{user.fullName}</div>
            <div className="text-[11px] text-white/50 truncate">{user.email}</div>
          </div>
        </Link>
        {user.organization && (
          <div className="mt-2 px-2 text-[11px] text-white/40 truncate">
            {user.organization.name}
          </div>
        )}
        <Link
          href="/help"
          onClick={onNavigate}
          className="mt-3 flex items-center gap-2 px-2 py-1.5 text-[12px] text-white/50 hover:text-white/80 hover:bg-white/[0.06] rounded-lg transition-colors"
          title="Open the Phasewise Help Center"
        >
          <HelpCircle className="h-3.5 w-3.5" strokeWidth={1.75} />
          Help &amp; docs
        </Link>
        <div className="mt-2 px-2">
          <LogoutButton />
        </div>
      </div>
    </>
  );
}

export default function MobileSidebar({ user, notifications }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar — visible below lg breakpoint */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0D2218] border-b border-white/[0.06] h-14 flex items-center px-4 gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative text-white/70 hover:text-white transition-colors p-1"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" strokeWidth={1.75} />
          {/* Dot indicator when anything needs attention — nav badges
              live inside the drawer, but they're hidden when the menu
              is closed. */}
          {notifications &&
            (notifications.pendingApprovals > 0 ||
              notifications.draftInvoices > 0 ||
              notifications.overdueSubmittals > 0) && (
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"
                aria-hidden="true"
              />
            )}
        </button>
        <PhaseLogo />
        <span className="text-[16px] font-semibold tracking-[-0.3px] text-white">
          phase<em className="not-italic font-light text-[#52B788]">wise</em>
        </span>
      </div>

      {/* Desktop sidebar — always visible at lg+ */}
      <aside className="hidden lg:flex w-60 bg-[#0D2218] text-white flex-col border-r border-[#1A2E22]">
        <SidebarContent user={user} notifications={notifications} />
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
            <SidebarContent user={user} notifications={notifications} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
