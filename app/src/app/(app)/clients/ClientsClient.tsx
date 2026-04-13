"use client";

import { useState } from "react";
import { Building2, Mail, MapPin, Phone, Plus } from "lucide-react";

type Client = {
  id: string;
  name: string;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  notes: string | null;
};

type Props = {
  clients: Client[];
};

export default function ClientsClient({ clients: initialClients }: Props) {
  const [clients, setClients] = useState(initialClients);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formContact, setFormContact] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formState, setFormState] = useState("");
  const [formZip, setFormZip] = useState("");
  const [formNotes, setFormNotes] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formName,
        contactPerson: formContact || undefined,
        email: formEmail || undefined,
        phone: formPhone || undefined,
        address: formAddress || undefined,
        city: formCity || undefined,
        state: formState || undefined,
        zip: formZip || undefined,
        notes: formNotes || undefined,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to create client.");
      return;
    }

    setClients((prev) => [...prev, data.client].sort((a, b) => a.name.localeCompare(b.name)));
    setFormName("");
    setFormContact("");
    setFormEmail("");
    setFormPhone("");
    setFormAddress("");
    setFormCity("");
    setFormState("");
    setFormZip("");
    setFormNotes("");
    setShowForm(false);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl text-[#1A2E22]">Clients</h1>
          <p className="mt-1 text-sm text-[#6B8C74]">{clients.length} client{clients.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add client
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-700">{error}</div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 bg-[#F0FAF4] border border-[#52B788]/30 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 text-[#2D6A4F]">
            <Building2 className="w-5 h-5" />
            <h3 className="text-sm font-semibold">Add new client</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Company / Client name *</label>
              <input value={formName} onChange={(e) => setFormName(e.target.value)} required placeholder="Clearwater Development LLC" className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
            </div>
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Contact person</label>
              <input value={formContact} onChange={(e) => setFormContact(e.target.value)} placeholder="Sarah Chen" className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Email</label>
              <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="sarah@clearwater.dev" className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
            </div>
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Phone</label>
              <input value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="(559) 555-0100" className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
            </div>
          </div>
          <div className="grid sm:grid-cols-4 gap-4 mb-4">
            <div className="sm:col-span-2">
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Address</label>
              <input value={formAddress} onChange={(e) => setFormAddress(e.target.value)} placeholder="123 Main Street" className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
            </div>
            <div>
              <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">City</label>
              <input value={formCity} onChange={(e) => setFormCity(e.target.value)} placeholder="Fresno" className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">State</label>
                <input value={formState} onChange={(e) => setFormState(e.target.value)} placeholder="CA" maxLength={2} className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] uppercase focus:outline-none focus:border-[#52B788]" />
              </div>
              <div>
                <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">ZIP</label>
                <input value={formZip} onChange={(e) => setFormZip(e.target.value)} placeholder="93720" className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]" />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm text-[#3D5C48] block mb-1.5 font-medium">Notes</label>
            <textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} rows={2} placeholder="Referred by Mesa Associates. Prefers email communication." className="w-full bg-white border border-[#E2EBE4] rounded-lg px-3.5 py-2.5 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788] resize-y" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] transition-colors disabled:opacity-50">
              {saving ? "Adding..." : "Add client"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm text-[#6B8C74] hover:text-[#1A2E22]">Cancel</button>
          </div>
        </form>
      )}

      {/* Clients grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {clients.map((client) => (
          <div
            key={client.id}
            className="rounded-2xl border border-[#E2EBE4] bg-white p-5 hover:border-[#52B788] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(45,106,79,0.06)] transition-all"
          >
            <h3 className="font-semibold text-[#1A2E22] mb-1">{client.name}</h3>
            {client.contactPerson && (
              <p className="text-sm text-[#6B8C74] mb-3">{client.contactPerson}</p>
            )}
            <div className="space-y-1.5 text-xs text-[#6B8C74]">
              {client.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-[#A3BEA9]" />
                  <a href={`mailto:${client.email}`} className="hover:text-[#2D6A4F] transition-colors">{client.email}</a>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-[#A3BEA9]" />
                  <span>{client.phone}</span>
                </div>
              )}
              {(client.city || client.state) && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-[#A3BEA9]" />
                  <span>{[client.city, client.state].filter(Boolean).join(", ")} {client.zip}</span>
                </div>
              )}
            </div>
            {client.notes && (
              <p className="mt-3 text-xs text-[#A3BEA9] italic">{client.notes}</p>
            )}
          </div>
        ))}
      </div>

      {clients.length === 0 && !showForm && (
        <div className="rounded-2xl border border-[#E2EBE4] bg-white p-10 text-center">
          <Building2 className="w-10 h-10 text-[#A3BEA9] mx-auto mb-3" />
          <h3 className="font-semibold text-[#1A2E22] mb-1">No clients yet</h3>
          <p className="text-sm text-[#6B8C74]">Add your first client to start tracking contacts and project relationships.</p>
        </div>
      )}
    </div>
  );
}
