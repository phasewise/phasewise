import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/supabase/auth";
import { renderMweloPdf, MweloPdfInput } from "@/lib/mwelo-pdf";

export const dynamic = "force-dynamic";

type SavedCalc = {
  inputs?: {
    region?: string;
    eto?: number;
    specialLandscapeArea?: number;
    hydrozones?: Array<{
      name?: string;
      areaSqFt?: number;
      plantFactor?: string;
      irrigationEfficiency?: string;
    }>;
  };
  outputs?: {
    totalLandscapeArea?: number;
    mawa?: number;
    etwu?: number;
    passes?: boolean;
    hydrozoneResults?: Array<{
      name?: string;
      area?: number;
      pf?: number;
      ie?: number;
      etwu?: number;
    }>;
  };
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const item = await prisma.complianceItem.findUnique({
    where: { id },
    include: {
      project: {
        select: {
          name: true,
          projectNumber: true,
          organizationId: true,
          organization: { select: { name: true } },
        },
      },
    },
  });

  if (!item || item.project.organizationId !== currentUser.organizationId) {
    return NextResponse.json({ error: "Compliance item not found." }, { status: 404 });
  }

  if (item.category !== "MWELO" || !item.mweloCalculation) {
    return NextResponse.json(
      { error: "This compliance item has no MWELO calculation to render." },
      { status: 400 }
    );
  }

  const calc = item.mweloCalculation as SavedCalc;
  const inputs = calc.inputs ?? {};
  const outputs = calc.outputs ?? {};

  const hydrozonesIn = inputs.hydrozones ?? [];
  const hydrozonesOut = outputs.hydrozoneResults ?? [];
  // Merge: pull labels (PF, IE) from inputs and ETWU/area from outputs.
  // Same length and order in normal flow; defensively zip by index.
  const hydrozones = hydrozonesIn.map((zin, i) => {
    const zout = hydrozonesOut[i] ?? {};
    return {
      name: zin.name ?? `Zone ${i + 1}`,
      area: Number(zout.area ?? zin.areaSqFt ?? 0),
      plantFactor: zin.plantFactor ?? "—",
      irrigationEfficiency: zin.irrigationEfficiency ?? "—",
      etwu: Number(zout.etwu ?? 0),
    };
  });

  const pdfInput: MweloPdfInput = {
    itemName: item.name,
    projectName: item.project.name,
    projectNumber: item.project.projectNumber,
    organizationName: item.project.organization.name,
    region: inputs.region ?? "—",
    eto: Number(inputs.eto ?? 0),
    totalLandscapeArea: Number(outputs.totalLandscapeArea ?? 0),
    specialLandscapeArea: Number(inputs.specialLandscapeArea ?? 0),
    mawa: Number(outputs.mawa ?? 0),
    etwu: Number(outputs.etwu ?? 0),
    passes: Boolean(outputs.passes),
    hydrozones,
    generatedAt: new Date(),
  };

  const pdfBuffer = await renderMweloPdf(pdfInput);

  // Slugify for the filename so users get a sensible default save name.
  const slug = item.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "mwelo-calculation";

  return new Response(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${slug}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
