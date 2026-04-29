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
      contractFee,
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

    // Auto-numbering needs to be atomic — two simultaneous create requests
    // could otherwise both read counter=N and both write project number
    // PW-N. Increment the counter inside a transaction and use the
    // pre-increment value for the project's number. The Prisma update
    // returns the post-increment value so we subtract 1 for ours.
    //
    // Inside the same transaction, upsert a Client row when a clientName
    // is provided so the firm has a persistent client list and the project
    // points at it via clientId. Existing Client (case-insensitive name
    // match within the org) gets re-linked rather than duplicated; new
    // names create a new Client and inherit the project's email if any.
    const project = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.findUnique({
        where: { id: currentUser.organizationId },
        select: {
          autoNumberProjects: true,
          projectNumberPrefix: true,
        },
      });

      let resolvedClientId: string | undefined = undefined;
      const trimmedClientName = clientName?.trim();
      if (trimmedClientName) {
        const existingClient = await tx.client.findFirst({
          where: {
            organizationId: currentUser.organizationId,
            name: { equals: trimmedClientName, mode: "insensitive" },
          },
          select: { id: true },
        });
        if (existingClient) {
          resolvedClientId = existingClient.id;
        } else {
          const newClient = await tx.client.create({
            data: {
              organizationId: currentUser.organizationId,
              name: trimmedClientName,
              email: clientEmail?.trim() || null,
            },
            select: { id: true },
          });
          resolvedClientId = newClient.id;
        }
      }

      let resolvedNumber = projectNumber || undefined;
      if (org?.autoNumberProjects && !projectNumber) {
        const updated = await tx.organization.update({
          where: { id: currentUser.organizationId },
          data: { projectNumberNext: { increment: 1 } },
          select: { projectNumberNext: true, projectNumberPrefix: true },
        });
        const used = updated.projectNumberNext - 1;
        resolvedNumber = `${updated.projectNumberPrefix}-${String(used).padStart(3, "0")}`;
      } else if (org?.autoNumberProjects && projectNumber) {
        // Client passed a value — only consume a counter slot if the value
        // matches what the counter would have produced. This preserves
        // the existing UX where the form pre-fills the number.
        const updated = await tx.organization.update({
          where: { id: currentUser.organizationId },
          data: { projectNumberNext: { increment: 1 } },
          select: { projectNumberNext: true, projectNumberPrefix: true },
        });
        const used = updated.projectNumberNext - 1;
        const expected = `${updated.projectNumberPrefix}-${String(used).padStart(3, "0")}`;
        if (projectNumber !== expected) {
          // User edited the auto-suggested number — roll the counter back
          // so we don't burn a slot we didn't use.
          await tx.organization.update({
            where: { id: currentUser.organizationId },
            data: { projectNumberNext: { decrement: 1 } },
          });
        }
      }

      return tx.project.create({
        data: {
          organizationId: currentUser.organizationId,
          createdById: currentUser.id,
          name,
          projectNumber: resolvedNumber,
          clientId: resolvedClientId,
          clientName: clientName || undefined,
          clientEmail: clientEmail || undefined,
          status: status || "ACTIVE",
          startDate: startDate ? new Date(startDate) : undefined,
          targetCompletion: targetCompletion ? new Date(targetCompletion) : undefined,
          contractFee:
            contractFee !== undefined && contractFee !== ""
              ? new Prisma.Decimal(contractFee)
              : undefined,
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
        include: { phases: true },
      });
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
