import Link from "next/link";
import { Droplets } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import ComplianceClient from "./ComplianceClient";

export const dynamic = "force-dynamic";

export default async function CompliancePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="p-6 sm:p-8">
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-8 text-[#1A2E22]">
          <h1 className="font-serif text-2xl">Compliance Tracker</h1>
          <p className="mt-3 text-sm text-[#6B8C74]">Please sign in to manage compliance items.</p>
        </div>
      </div>
    );
  }

  const complianceItems = await prisma.complianceItem.findMany({
    where: { organizationId: currentUser.organizationId },
    include: { project: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const projects = await prisma.project.findMany({
    where: { organizationId: currentUser.organizationId, status: { not: "ARCHIVED" } },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  // The compliance-docs bucket is private. item.documentUrl now holds the
  // storage path (not a public URL) so we mint a 1-hour signed URL on each
  // render. We send the signed URL (for display) and the path (which the
  // client echoes back to the API on save) as two separate fields.
  const supabase = await createClient();
  const itemsForClient = await Promise.all(
    complianceItems.map(async (item) => {
      let signedUrl: string | null = null;
      if (item.documentUrl) {
        const { data: signed } = await supabase.storage
          .from("compliance-docs")
          .createSignedUrl(item.documentUrl, 60 * 60);
        signedUrl = signed?.signedUrl ?? null;
      }
      return {
        id: item.id,
        category: item.category,
        name: item.name,
        description: item.description,
        status: item.status,
        dueDate: item.dueDate?.toISOString() ?? null,
        documentUrl: signedUrl,
        documentPath: item.documentUrl,
        notes: item.notes,
        projectId: item.projectId,
        projectName: item.project.name,
      };
    })
  );

  return (
    <div className="p-6 sm:p-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div />
        <Link
          href="/tools/mwelo-calculator"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200/30 hover:bg-blue-100 transition-colors"
        >
          <Droplets className="w-4 h-4" />
          MWELO Calculator
        </Link>
      </div>
      <ComplianceClient items={itemsForClient} projects={projects} />
    </div>
  );
}
