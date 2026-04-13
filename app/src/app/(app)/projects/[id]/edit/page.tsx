"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");
  const [projectNumber, setProjectNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [startDate, setStartDate] = useState("");
  const [targetCompletion, setTargetCompletion] = useState("");
  const [description, setDescription] = useState("");

  // Fetch existing project data
  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load project");
        return res.json();
      })
      .then((data) => {
        const p = data.project;
        setName(p.name || "");
        setProjectNumber(p.projectNumber || "");
        setClientName(p.clientName || "");
        setClientEmail(p.clientEmail || "");
        setStatus(p.status || "ACTIVE");
        setStartDate(p.startDate ? p.startDate.split("T")[0] : "");
        setTargetCompletion(p.targetCompletion ? p.targetCompletion.split("T")[0] : "");
        setDescription(p.description || "");
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load project data.");
        setLoading(false);
      });
  }, [projectId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    setSuccess(false);

    const res = await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        projectNumber,
        clientName,
        clientEmail,
        status,
        startDate: startDate || null,
        targetCompletion: targetCompletion || null,
        description,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to update project.");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push(`/projects/${projectId}`);
      router.refresh();
    }, 800);
  }

  if (loading) {
    return (
      <div className="p-6 sm:p-8">
        <p className="text-[#6B8C74] text-sm">Loading project...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8 text-[#1A2E22]">
        <Link
          href={`/projects/${projectId}`}
          className="inline-flex items-center gap-2 text-sm text-[#6B8C74] hover:text-[#1A2E22]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to project
        </Link>
      </div>

      <h1 className="font-serif text-3xl text-[#1A2E22] mb-6">Edit project</h1>

      <div className="rounded-2xl border border-[#E2EBE4] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(26,46,34,0.04)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-[#3D5C48]">Project name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-[#3D5C48]">Project number</label>
              <input
                value={projectNumber}
                onChange={(e) => setProjectNumber(e.target.value)}
                className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#3D5C48]">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
              >
                <option value="ACTIVE">Active</option>
                <option value="ON_HOLD">On hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-[#3D5C48]">Client name</label>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#3D5C48]">Client email</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-[#3D5C48]">Start date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#3D5C48]">Target completion</label>
              <input
                type="date"
                value={targetCompletion}
                onChange={(e) => setTargetCompletion(e.target.value)}
                className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[#3D5C48]">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-2 w-full rounded-lg border border-[#E2EBE4] bg-[#F7F9F7] px-4 py-3 text-sm text-[#1A2E22] outline-none focus:border-[#52B788] focus:bg-white resize-y"
            />
          </div>

          {error && <p className="text-sm text-[#B04030]">{error}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium bg-[#2D6A4F] text-white hover:bg-[#40916C] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(45,106,79,0.3)] transition-all disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : success ? "Saved ✓" : "Save changes"}
            </button>
            <Link
              href={`/projects/${projectId}`}
              className="px-6 py-3 rounded-lg text-sm text-[#6B8C74] hover:text-[#1A2E22] transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
