"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  weekStart: string;
  status: string;
  // Whether the current user has approver privileges (OWNER/ADMIN/SUPERVISOR).
  // APPROVED timesheets can only be reopened by approvers — for everyone
  // else it's a "ask your manager" situation.
  canApprove: boolean;
  // True when this is a future week and the current week hasn't been
  // submitted yet. Cells stay editable but the Submit button is gated;
  // matches the server-side rule on /api/timesheets submit.
  submitBlocked?: boolean;
};

export default function TimesheetSubmitClient({ weekStart, status, canApprove, submitBlocked = false }: Props) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(status);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function postAction(action: "submit" | "reopen", confirmText?: string) {
    if (confirmText && !confirm(confirmText)) return;
    setMessage(null);
    setSaving(true);

    const response = await fetch("/api/timesheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, weekStart }),
    });

    const result = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(result.error || "Action failed.");
      return;
    }

    if (action === "submit") {
      setCurrentStatus("SUBMITTED");
      setMessage("Timesheet submitted for approval.");
    } else {
      setCurrentStatus("DRAFT");
      setMessage("Timesheet reopened — you can edit again.");
      // Reload server state so the read-only flag clears and the cells
      // become editable without a manual page refresh.
      router.refresh();
    }
  }

  // Reopen path is shown for SUBMITTED (any user — recall their own) and
  // for APPROVED only when the user can approve (otherwise the API would
  // reject anyway). Single-person firms see both paths because the user
  // is the OWNER.
  const canReopenSubmitted = currentStatus === "SUBMITTED";
  const canReopenApproved = currentStatus === "APPROVED" && canApprove;
  const showReopen = canReopenSubmitted || canReopenApproved;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Week status</h2>
          <p className="mt-1 text-sm text-slate-500">
            {currentStatus === "DRAFT"
              ? "Your timesheet is in draft."
              : currentStatus === "SUBMITTED"
              ? "Your timesheet has been submitted."
              : "Your timesheet has been approved."}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
          {currentStatus}
        </div>
      </div>

      {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {currentStatus === "DRAFT" ? (
          <button
            type="button"
            onClick={() => postAction("submit")}
            disabled={saving || submitBlocked}
            title={
              submitBlocked
                ? "Submit the current week's timesheet first — future weeks can't be submitted ahead of the current one."
                : undefined
            }
            className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white transition disabled:opacity-60 ${
              submitBlocked
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-500"
            }`}
          >
            {saving
              ? "Submitting..."
              : submitBlocked
              ? "Submit blocked — current week not submitted"
              : "Submit timesheet"}
          </button>
        ) : null}

        {showReopen ? (
          <button
            type="button"
            onClick={() =>
              postAction(
                "reopen",
                currentStatus === "APPROVED"
                  ? "Reopen this approved timesheet for editing? It will move back to draft and need to be re-submitted and re-approved."
                  : undefined
              )
            }
            disabled={saving}
            className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:opacity-60 ${
              currentStatus === "APPROVED"
                ? "border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
            title={
              currentStatus === "APPROVED"
                ? "Reopen for editing — moves status back to draft"
                : "Recall this submission so you can edit again"
            }
          >
            {saving
              ? "Reopening..."
              : currentStatus === "APPROVED"
              ? "Reopen for editing"
              : "Recall submission"}
          </button>
        ) : null}

        {/* Friendly hint for non-approvers stuck on an APPROVED week, so
            they don't think the app is broken. */}
        {currentStatus === "APPROVED" && !canApprove ? (
          <p className="text-xs text-slate-500">
            Approved timesheets are read-only. Ask an admin to reopen this
            week if you need to make changes.
          </p>
        ) : null}
      </div>
    </div>
  );
}
