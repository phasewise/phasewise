import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import ClientsClient from "./ClientsClient";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="p-6 sm:p-8">
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-8 text-[#1A2E22]">
          <h1 className="font-serif text-2xl">Clients</h1>
          <p className="mt-3 text-sm text-[#6B8C74]">Please sign in to manage clients.</p>
        </div>
      </div>
    );
  }

  const clients = await prisma.client.findMany({
    where: { organizationId: currentUser.organizationId },
    orderBy: { name: "asc" },
  });

  const clientsForClient = clients.map((c) => ({
    id: c.id,
    name: c.name,
    contactPerson: c.contactPerson,
    email: c.email,
    phone: c.phone,
    address: c.address,
    city: c.city,
    state: c.state,
    zip: c.zip,
    notes: c.notes,
  }));

  return (
    <div className="p-6 sm:p-8 max-w-6xl">
      <ClientsClient clients={clientsForClient} />
    </div>
  );
}
