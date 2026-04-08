"use client";

import { useState } from "react";

type Props = {
  weekStart: string;
  status: string;
};

export default function TimesheetSubmitClient({ weekStart, status }: Props) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submitTimesheet() {
    setMessage(null);
    setSaving(true);

    const response = await fetch("/api/timesheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "submit", weekStart }),
    });

    const result = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(result.error || "Unable to submit timesheet.");
      return;
    }

    setCurrentStatus("SUBMITTED");
    setMessage("Timesheet submitted for approval.");
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Week status</h2>
          <p className="mt-1 text-sm text-slate-500">{currentStatus === "DRAFT" ? "Your timesheet is in draft." : currentStatus === "SUBMITTED" ? "Your timesheet has been submitted." : "Your timesheet has been approved."}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
          {currentStatus}
        </div>
      </div>

      {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}

      {currentStatus === "DRAFT" ? (
        <button
          type="button"
          onClick={submitTimesheet}
          disabled={saving}
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60"
        >
          {saving ? "Submitting..." : "Submit timesheet"}
        </button>
      ) : null}
    </div>
  );
}
