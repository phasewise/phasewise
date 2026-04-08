import { NextResponse } from "next/server";
import { Prisma, PhaseType, PhaseStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface PhaseInput {
  phaseType: string;
  selected?: boolean;
  budgetedFee?: string | number;
  budgetedHours?: string | number;
  sortOrder?: number;
  status?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      projectNumber,
      clientName,
      clientEmail,
      status,
      startDate,
      targetCompletion,
      phases,
    } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Project name is required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { authId: user.id },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unable to resolve current user." },
        { status: 401 }
      );
    }

    if (!Array.isArray(phases) || phases.length === 0) {
      return NextResponse.json(
        { error: "At least one phase is required." },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        organizationId: currentUser.organizationId,
        createdById: currentUser.id,
        name,
        projectNumber: projectNumber || undefined,
        clientName: clientName || undefined,
        clientEmail: clientEmail || undefined,
        status: status || "ACTIVE",
        startDate: startDate ? new Date(startDate) : undefined,
        targetCompletion: targetCompletion ? new Date(targetCompletion) : undefined,
        phases: {
          create: (phases as PhaseInput[])
            .filter(
              (phase) => phase.phaseType && phase.selected !== false
            )
            .map((phase, index) => {
              const fee =
                phase.budgetedFee !== undefined && phase.budgetedFee !== ""
                  ? new Prisma.Decimal(phase.budgetedFee)
                  : undefined;
              const hours =
                phase.budgetedHours !== undefined && phase.budgetedHours !== ""
                  ? new Prisma.Decimal(phase.budgetedHours)
                  : undefined;

              return {
                phaseType: phase.phaseType as PhaseType,
                status: (phase.status || "NOT_STARTED") as PhaseStatus,
                sortOrder: phase.sortOrder ?? index,
                budgetedFee: fee,
                budgetedHours: hours,
              };
            }),
        },
      },
      include: {
        phases: true,
      },
    });

    return NextResponse.json({ projectId: project.id });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json(
      { error: "Failed to create project." },
      { status: 500 }
    );
  }
}
