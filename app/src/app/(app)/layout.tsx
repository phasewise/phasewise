import Link from "next/link";
import {
  BarChart3,
  Clock,
  FolderKanban,
  Home,
  Leaf,
  Settings,
  Users,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Time", href: "/time", icon: Clock },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Team", href: "/settings/team", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 text-white flex flex-col border-r border-slate-800">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-800">
          <Leaf className="h-5 w-5 text-emerald-400" />
          <span className="font-semibold text-sm tracking-tight">PowerKG</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-slate-800">
          <p className="text-xs text-slate-600">PowerKG v0.1.0</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
