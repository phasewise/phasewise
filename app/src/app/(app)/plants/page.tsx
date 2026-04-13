import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import PlantsClient from "./PlantsClient";

export const dynamic = "force-dynamic";

export default async function PlantsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="p-6 sm:p-8">
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-8 text-[#1A2E22]">
          <h1 className="font-serif text-2xl">Plant Schedule</h1>
          <p className="mt-3 text-sm text-[#6B8C74]">Please sign in to manage plant entries.</p>
        </div>
      </div>
    );
  }

  const plantEntries = await prisma.plantEntry.findMany({
    where: { organizationId: currentUser.organizationId },
    include: { project: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const projects = await prisma.project.findMany({
    where: { organizationId: currentUser.organizationId, status: { not: "ARCHIVED" } },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const plantsForClient = plantEntries.map((p) => ({
    id: p.id,
    botanicalName: p.botanicalName,
    commonName: p.commonName,
    size: p.size,
    quantity: p.quantity,
    spacing: p.spacing,
    waterUse: p.waterUse,
    unitCost: p.unitCost ? Number(p.unitCost) : null,
    notes: p.notes,
    substitution: p.substitution,
    approvalStatus: p.approvalStatus,
    projectId: p.projectId,
    projectName: p.project.name,
  }));

  return (
    <div className="p-6 sm:p-8 max-w-6xl">
      <PlantsClient plants={plantsForClient} projects={projects} />
    </div>
  );
}
