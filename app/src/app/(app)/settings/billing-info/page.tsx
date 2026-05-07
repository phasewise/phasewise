import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import BillingInfoForm from "./BillingInfoForm";

export const dynamic = "force-dynamic";

// Org-level billing info that prints on every invoice. Bank-sensitive
// data (routing/account numbers, Fed ID) — gated to OWNER/ADMIN both
// at this page entry AND on the GET API. Staff can't even read these
// fields if they bypass the page.
export default async function BillingInfoPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");
  if (currentUser.role !== "OWNER" && currentUser.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const org = await prisma.organization.findUnique({
    where: { id: currentUser.organizationId },
    select: {
      billingMailingAddress: true,
      billingFedId: true,
      billingAchRouting: true,
      billingAchAccount: true,
      billingWireRouting: true,
      billingWireAccount: true,
      billingInfoUpdatedAt: true,
      printPaymentDetailsOnInvoice: true,
    },
  });

  return (
    <BillingInfoForm
      initial={{
        billingMailingAddress: org?.billingMailingAddress ?? "",
        billingFedId: org?.billingFedId ?? "",
        billingAchRouting: org?.billingAchRouting ?? "",
        billingAchAccount: org?.billingAchAccount ?? "",
        billingWireRouting: org?.billingWireRouting ?? "",
        billingWireAccount: org?.billingWireAccount ?? "",
        billingInfoUpdatedAt: org?.billingInfoUpdatedAt?.toISOString() ?? null,
        printPaymentDetailsOnInvoice: org?.printPaymentDetailsOnInvoice ?? true,
      }}
    />
  );
}
