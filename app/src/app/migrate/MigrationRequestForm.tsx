"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "ok" | "error";

export default function MigrationRequestForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    const form = new FormData(e.currentTarget);
    const payload = {
      firmName: String(form.get("firmName") || "").trim(),
      contactName: String(form.get("contactName") || "").trim(),
      email: String(form.get("email") || "").trim(),
      currentTool: String(form.get("currentTool") || "").trim(),
      projectCount: String(form.get("projectCount") || "").trim(),
      staffCount: String(form.get("staffCount") || "").trim(),
      clientCount: String(form.get("clientCount") || "").trim(),
      formatNotes: String(form.get("formatNotes") || "").trim(),
    };
    if (!payload.firmName || !payload.email) {
      setErrorMessage("Firm name and email are required.");
      setStatus("error");
      return;
    }
    try {
      const res = await fetch("/api/migration-request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }
      setStatus("ok");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Submission failed. Try again or email hello@phasewise.io.");
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-lg border border-[#52B788] bg-[#F0FAF4] p-6">
        <h3 className="font-semibold text-[16px] text-[#1A2E22] mb-2">Got it. We&apos;ll be in touch within a business day.</h3>
        <p className="text-[14px] text-[#3D5C48] leading-relaxed">
          We&apos;ll reply with a secure upload link for your data files. Once you send them over,
          your projects, clients, and staff invitations will be loaded into your Phasewise account
          within 24 hours.
        </p>
        <p className="text-[13px] text-[#6B8C74] mt-4">
          Questions in the meantime? Email{" "}
          <a href="mailto:hello@phasewise.io" className="text-[#2D6A4F] underline hover:text-[#40916C]">
            hello@phasewise.io
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-[#E2EBE4] bg-white p-6 sm:p-8">
      <h3 className="font-serif text-2xl text-[#1A2E22] mb-2 leading-tight">Request your migration</h3>
      <p className="text-[14px] text-[#6B8C74] mb-6 leading-relaxed">
        Tell us a bit about your firm. We&apos;ll reply with the upload link and any format-specific
        questions.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="firmName" className="block text-[12px] font-medium text-[#3D5C48] mb-1.5">
            Firm name <span className="text-rose-500">*</span>
          </label>
          <input
            id="firmName"
            name="firmName"
            type="text"
            required
            className="w-full px-3 py-2.5 rounded-md border border-[#E2EBE4] text-[14px] focus:outline-none focus:border-[#2D6A4F]"
            placeholder="Example Landscape Architecture"
          />
        </div>
        <div>
          <label htmlFor="contactName" className="block text-[12px] font-medium text-[#3D5C48] mb-1.5">
            Your name
          </label>
          <input
            id="contactName"
            name="contactName"
            type="text"
            className="w-full px-3 py-2.5 rounded-md border border-[#E2EBE4] text-[14px] focus:outline-none focus:border-[#2D6A4F]"
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-[12px] font-medium text-[#3D5C48] mb-1.5">
          Email <span className="text-rose-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-3 py-2.5 rounded-md border border-[#E2EBE4] text-[14px] focus:outline-none focus:border-[#2D6A4F]"
          placeholder="you@yourfirm.com"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="currentTool" className="block text-[12px] font-medium text-[#3D5C48] mb-1.5">
          What are you using today?
        </label>
        <select
          id="currentTool"
          name="currentTool"
          defaultValue=""
          className="w-full px-3 py-2.5 rounded-md border border-[#E2EBE4] text-[14px] bg-white focus:outline-none focus:border-[#2D6A4F]"
        >
          <option value="">Pick one (optional)</option>
          <option value="monograph">Monograph</option>
          <option value="bqe">BQE Core</option>
          <option value="deltek">Deltek</option>
          <option value="harvest">Harvest + spreadsheets</option>
          <option value="toggl">Toggl + spreadsheets</option>
          <option value="excel">Excel / Google Sheets only</option>
          <option value="quickbooks">QuickBooks only (no PM tool)</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="projectCount" className="block text-[12px] font-medium text-[#3D5C48] mb-1.5">
            # active projects
          </label>
          <input
            id="projectCount"
            name="projectCount"
            type="text"
            inputMode="numeric"
            className="w-full px-3 py-2.5 rounded-md border border-[#E2EBE4] text-[14px] focus:outline-none focus:border-[#2D6A4F]"
            placeholder="e.g. 15"
          />
        </div>
        <div>
          <label htmlFor="staffCount" className="block text-[12px] font-medium text-[#3D5C48] mb-1.5">
            # staff
          </label>
          <input
            id="staffCount"
            name="staffCount"
            type="text"
            inputMode="numeric"
            className="w-full px-3 py-2.5 rounded-md border border-[#E2EBE4] text-[14px] focus:outline-none focus:border-[#2D6A4F]"
            placeholder="e.g. 6"
          />
        </div>
        <div>
          <label htmlFor="clientCount" className="block text-[12px] font-medium text-[#3D5C48] mb-1.5">
            # clients
          </label>
          <input
            id="clientCount"
            name="clientCount"
            type="text"
            inputMode="numeric"
            className="w-full px-3 py-2.5 rounded-md border border-[#E2EBE4] text-[14px] focus:outline-none focus:border-[#2D6A4F]"
            placeholder="e.g. 25"
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="formatNotes" className="block text-[12px] font-medium text-[#3D5C48] mb-1.5">
          What format is your data in? Anything we should know about it?
        </label>
        <textarea
          id="formatNotes"
          name="formatNotes"
          rows={4}
          className="w-full px-3 py-2.5 rounded-md border border-[#E2EBE4] text-[14px] focus:outline-none focus:border-[#2D6A4F]"
          placeholder="e.g. Projects + budgets in one Excel file, time logs in Harvest, client list in QuickBooks. Some legacy projects from 2018 we don't need imported."
        />
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-md border border-rose-300 bg-rose-50 text-rose-700 px-3 py-2 text-[13px]">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-[#2D6A4F] text-white text-sm font-semibold hover:bg-[#40916C] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending…" : "Request migration"}
      </button>
      <p className="text-[11px] text-[#6B8C74] mt-3">
        We&apos;ll reply within one business day with the next step. No spam.
      </p>
    </form>
  );
}
