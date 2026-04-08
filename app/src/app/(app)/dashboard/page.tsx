import {
  AlertTriangle,
  ArrowUpRight,
  Clock,
  DollarSign,
  FolderKanban,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { PHASE_SHORT_LABELS, STATUS_COLORS } from "@/lib/constants";

// Demo data — will be replaced with Prisma queries once DB is connected
const demoProjects = [
  {
    id: "1",
    name: "Riverside Park Renovation",
    projectNumber: "2026-001",
    clientName: "City of Sacramento",
    status: "ACTIVE",
    currentPhase: "CONSTRUCTION_DOCUMENTS",
    budgetedFee: 185000,
    hoursUsed: 820,
    hoursBudgeted: 1100,
    burnPercent: 74.5,
  },
  {
    id: "2",
    name: "Tech Campus Courtyard",
    projectNumber: "2026-002",
    clientName: "Rivian HQ",
    status: "ACTIVE",
    currentPhase: "DESIGN_DEVELOPMENT",
    budgetedFee: 95000,
    hoursUsed: 510,
    hoursBudgeted: 520,
    burnPercent: 98.1,
  },
  {
    id: "3",
    name: "Residential Estate - Granite Bay",
    projectNumber: "2026-003",
    clientName: "Martinez Family",
    status: "ACTIVE",
    currentPhase: "SCHEMATIC_DESIGN",
    budgetedFee: 42000,
    hoursUsed: 85,
    hoursBudgeted: 240,
    burnPercent: 35.4,
  },
  {
    id: "4",
    name: "I-80 Corridor Landscape",
    projectNumber: "2025-018",
    clientName: "Caltrans District 3",
    status: "ACTIVE",
    currentPhase: "CONSTRUCTION_ADMIN",
    budgetedFee: 320000,
    hoursUsed: 1850,
    hoursBudgeted: 2000,
    burnPercent: 92.5,
  },
  {
    id: "5",
    name: "Mixed-Use Plaza - Midtown",
    projectNumber: "2026-004",
    clientName: "Midtown Development LLC",
    status: "ON_HOLD",
    currentPhase: "PRE_DESIGN",
    budgetedFee: 68000,
    hoursUsed: 30,
    hoursBudgeted: 400,
    burnPercent: 7.5,
  },
];

function getBurnColor(pct: number) {
  if (pct >= 95) return "bg-red-500";
  if (pct >= 80) return "bg-yellow-500";
  return "bg-emerald-500";
}

function getBurnBadge(pct: number) {
  if (pct >= 95) return "text-red-700 bg-red-50";
  if (pct >= 80) return "text-yellow-700 bg-yellow-50";
  return "text-emerald-700 bg-emerald-50";
}

export default function DashboardPage() {
  const activeProjects = demoProjects.filter((p) => p.status === "ACTIVE");
  const atRiskProjects = activeProjects.filter((p) => p.burnPercent >= 90);
  const totalFee = demoProjects.reduce((acc, p) => acc + p.budgetedFee, 0);
  const avgBurn =
    activeProjects.reduce((acc, p) => acc + p.burnPercent, 0) /
    activeProjects.length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Your firm at a glance
          </p>
        </div>
        <Link
          href="/projects/new"
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <FolderKanban className="h-4 w-4" />
          New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Active Projects",
            value: activeProjects.length,
            icon: FolderKanban,
            color: "text-blue-600 bg-blue-50",
          },
          {
            label: "At Risk",
            value: atRiskProjects.length,
            icon: AlertTriangle,
            color: "text-red-600 bg-red-50",
          },
          {
            label: "Total Fee (Active)",
            value: `$${(totalFee / 1000).toFixed(0)}K`,
            icon: DollarSign,
            color: "text-emerald-600 bg-emerald-50",
          },
          {
            label: "Avg Burn Rate",
            value: `${avgBurn.toFixed(0)}%`,
            icon: TrendingUp,
            color: "text-purple-600 bg-purple-50",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {stat.label}
              </span>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Project Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Projects</h2>
          <Link
            href="/projects"
            className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                <th className="text-left px-6 py-3 font-medium">Project</th>
                <th className="text-left px-6 py-3 font-medium">Client</th>
                <th className="text-left px-6 py-3 font-medium">Phase</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-left px-6 py-3 font-medium">Budget</th>
                <th className="text-left px-6 py-3 font-medium">Burn Rate</th>
              </tr>
            </thead>
            <tbody>
              {demoProjects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-sm font-medium text-gray-900 hover:text-emerald-600 transition"
                    >
                      {project.name}
                    </Link>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {project.projectNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {project.clientName}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded">
                      {PHASE_SHORT_LABELS[project.currentPhase]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        STATUS_COLORS[project.status]
                      }`}
                    >
                      {project.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                    ${project.budgetedFee.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getBurnColor(
                            project.burnPercent
                          )}`}
                          style={{
                            width: `${Math.min(project.burnPercent, 100)}%`,
                          }}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${getBurnBadge(
                          project.burnPercent
                        )}`}
                      >
                        {project.burnPercent.toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">
                      {project.hoursUsed}h / {project.hoursBudgeted}h
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
