"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { addDays, format } from "date-fns";
import { Check, ChevronDown, ChevronRight, MessageSquareWarning, X } from "lucide-react";
import { useConfirm } from "@/components/confirm-provider";

export type ApprovalRow = {
  id: string;
  weekStart: string;
  weekEnd: string;
  submittedAt: string | null;
  user: { id: string; fullName: string; email: string };
  totalHours: number;
  billableHours: number;
  entryGroups: Array<{
    label: string;
    isBillable: boolean;
    totalHours: number;
    // dayHours keyed by yyyy-MM-dd
    dayHours: Record<string, number>;
  }>;
};

export type HistoryRow = {
  id: string;
  weekStart: string;
  weekEnd: string;
  user: { id: string; fullName: string };
  totalHours: number;
  decision: {
    kind: "APPROVED" | "SENT_BACK";
    by: string;
    at: string | null;
    comment: string | null;
  };
};

type Props = {
  rows: ApprovalRow[];
  history: HistoryRow[];
};

export default function TimeApprovalClient({ rows: initialRows, history }: Props) {
  const confirm = useConfirm();
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [rejectDialogFor, setRejectDialogFor] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState("");
  const [tab, setTab] = useState<"pending" | "history">("pending");

  function toggle(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function approve(id: string) {
    setError(null);
    setSavingId(id);
    const response = await fetch("/api/timesheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve", timesheetId: id }),
    });
    const result = await response.json();
    setSavingId(null);
    if (!response.ok) {
      setError(result.error || "Unable to approve timesheet.");
      return;
    }
    setRows((current) => current.filter((r) => r.id !== id));
  }

  async function submitReject() {
    if (!rejectDialogFor) return;
    if (!rejectComment.trim()) {
      setError("A comment is required when sending a timesheet back.");
      return;
    }
    setError(null);
    setSavingId(rejectDialogFor);
    const response = await fetch("/api/timesheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "reject",
        timesheetId: rejectDialogFor,
        reviewComment: rejectComment.trim(),
      }),
    });
    const result = await response.json();
    setSavingId(null);
    if (!response.ok) {
      setError(result.error || "Unable to send timesheet back.");
      return;
    }
    setRows((current) => current.filter((r) => r.id !== rejectDialogFor));
    setRejectDialogFor(null);
    setRejectComment("");
  }

  function openReject(id: string) {
    setError(null);
    setRejectComment("");
    setRejectDialogFor(id);
  }

  function closeReject() {
    setRejectDialogFor(null);
    setRejectComment("");
  }

  // Treat the weekStart as a calendar date, not a UTC instant. Parsing
  // an ISO with `new Date(...)` shifts the day by your timezone offset
  // (Pacific renders Mon UTC midnight as Sun 5pm), which made the day
  // grid render one day earlier than the period label. Since weekStart
  // is stored as `@db.Date`, only the date portion is meaningful.
  function parseLocalDate(iso: string): Date {
    const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function weekDays(weekStartIso: string): string[] {
    const start = parseLocalDate(weekStartIso);
    return Array.from({ length: 7 }).map((_, i) => format(addDays(start, i), "yyyy-MM-dd"));
  }

  const dayHeaderLabel = (iso: string) => {
    const d = parseLocalDate(iso);
    return `${format(d, "EEE")} ${format(d, "M/d")}`;
  };

  async function reopenFromHistory(weekStartIso: string, userId: string) {
    const ok = await confirm({
      title: "Reopen this approved timesheet?",
      message:
        "It will move back to draft and need to be re-submitted and re-approved.",
      confirmText: "Reopen",
    });
    if (!ok) return;
    setError(null);
    const response = await fetch("/api/timesheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "reopen",
        weekStart: weekStartIso.slice(0, 10),
        userId,
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Unable to reopen timesheet.");
      return;
    }
    // Refetch the page so the timesheet leaves history (now DRAFT) and
    // the staff member sees the reopened cells next time they look.
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 border border-rose-200">
          {error}
        </p>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setTab("pending")}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            tab === "pending"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Pending
          {rows.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {rows.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setTab("history")}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            tab === "history"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          History
          {history.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {history.length}
            </span>
          )}
        </button>
      </div>

      {tab === "history" ? (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {history.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-slate-500">
              No approval history yet. Past Approve and Send-back decisions will appear here.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {history.map((h) => {
                const weekRange = `${format(parseLocalDate(h.weekStart), "MMM d")} – ${format(parseLocalDate(h.weekEnd), "MMM d, yyyy")}`;
                return (
                  <div key={h.id} className="px-6 py-4 flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 truncate">{h.user.fullName}</div>
                      <div className="text-xs text-slate-500 truncate">
                        {weekRange} · {h.totalHours.toFixed(1)} hrs
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {h.decision.kind === "APPROVED" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-medium">
                          <Check size={12} /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-0.5 text-xs font-medium">
                          <MessageSquareWarning size={12} /> Sent back
                        </span>
                      )}
                      <span className="text-xs text-slate-500">
                        by {h.decision.by}
                        {h.decision.at && (
                          <> · {new Date(h.decision.at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</>
                        )}
                      </span>
                    </div>
                    {h.decision.kind === "APPROVED" && (
                      <button
                        type="button"
                        onClick={() => reopenFromHistory(h.weekStart, h.user.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors"
                      >
                        Reopen
                      </button>
                    )}
                    {h.decision.kind === "SENT_BACK" && h.decision.comment && (
                      <div className="basis-full text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-1">
                        &ldquo;{h.decision.comment}&rdquo;
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {rows.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-slate-500">
            No submitted timesheets to approve. When team members submit their week, it appears here.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {rows.map((row) => {
              const isOpen = expanded[row.id];
              const days = weekDays(row.weekStart);
              const weekRange = `${format(parseLocalDate(row.weekStart), "MMM d")} – ${format(parseLocalDate(row.weekEnd), "MMM d, yyyy")}`;
              return (
                <div key={row.id}>
                  {/* Summary row — click to expand */}
                  <button
                    type="button"
                    onClick={() => toggle(row.id)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50/80 transition-colors text-left"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">{row.user.fullName}</div>
                        <div className="text-xs text-slate-500 truncate">
                          {weekRange} · Submitted{" "}
                          {row.submittedAt ? new Date(row.submittedAt).toLocaleString() : "—"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-sm font-semibold text-slate-900">
                          {row.totalHours.toFixed(1)}h total
                        </div>
                        <div className="text-xs text-emerald-700">
                          {row.billableHours.toFixed(1)}h billable
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">
                        {isOpen ? "Hide details" : "Review"}
                      </span>
                    </div>
                  </button>

                  {/* Expanded body — entry breakdown + actions */}
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 bg-slate-50/40">
                      {row.entryGroups.length === 0 ? (
                        <p className="text-sm text-slate-500 py-4 italic">
                          No time entries logged for this week. Submitting an empty timesheet is unusual — consider sending it back with a question.
                        </p>
                      ) : (
                        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                          <table className="min-w-full text-sm">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                              <tr>
                                <th className="px-4 py-3 text-left font-medium">Project / Phase</th>
                                {days.map((d) => (
                                  <th key={d} className="px-2 py-3 text-center font-medium">
                                    {dayHeaderLabel(d)}
                                  </th>
                                ))}
                                <th className="px-4 py-3 text-right font-medium">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {row.entryGroups.map((group, i) => (
                                <tr key={i} className="border-t border-slate-100">
                                  <td className="px-4 py-2.5">
                                    <div className="font-medium text-slate-900">{group.label}</div>
                                    {!group.isBillable && (
                                      <span className="inline-block mt-0.5 text-[10px] uppercase tracking-wide text-amber-700">
                                        Non-billable
                                      </span>
                                    )}
                                  </td>
                                  {days.map((d) => {
                                    const hrs = group.dayHours[d] ?? 0;
                                    return (
                                      <td key={d} className="px-2 py-2.5 text-center text-slate-700">
                                        {hrs > 0 ? hrs.toFixed(1) : <span className="text-slate-300">—</span>}
                                      </td>
                                    );
                                  })}
                                  <td className="px-4 py-2.5 text-right font-semibold text-slate-900">
                                    {group.totalHours.toFixed(1)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-slate-50 border-t border-slate-200">
                              <tr>
                                <td className="px-4 py-2.5 text-xs uppercase tracking-wide text-slate-500 font-medium">
                                  Daily totals
                                </td>
                                {days.map((d) => {
                                  const total = row.entryGroups.reduce(
                                    (sum, g) => sum + (g.dayHours[d] ?? 0),
                                    0
                                  );
                                  return (
                                    <td key={d} className="px-2 py-2.5 text-center text-sm font-semibold text-slate-900">
                                      {total > 0 ? total.toFixed(1) : "—"}
                                    </td>
                                  );
                                })}
                                <td className="px-4 py-2.5 text-right text-sm font-bold text-slate-900">
                                  {row.totalHours.toFixed(1)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => approve(row.id)}
                          disabled={savingId === row.id}
                          className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60"
                        >
                          <Check className="w-4 h-4" />
                          {savingId === row.id ? "Approving..." : "Approve"}
                        </button>
                        <button
                          type="button"
                          onClick={() => openReject(row.id)}
                          disabled={savingId === row.id}
                          className="inline-flex items-center gap-1.5 rounded-2xl bg-amber-50 border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 disabled:opacity-60"
                          title="Send back with a comment — staff member can fix and resubmit"
                        >
                          <MessageSquareWarning className="w-4 h-4" />
                          Send back / request changes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}

      {/* Reject / send-back modal */}
      {rejectDialogFor && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeReject}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 pb-2">
              <h2 className="font-serif text-xl text-slate-900">Send timesheet back</h2>
              <button
                type="button"
                onClick={closeReject}
                aria-label="Close dialog"
                className="text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-6 pb-6 space-y-3">
              <p className="text-sm text-slate-600">
                The timesheet will return to draft. The staff member will see your comment on their timesheet page until they re-submit.
              </p>
              <div>
                <label htmlFor="reject-comment" className="text-sm font-medium text-slate-700 block mb-1.5">
                  What needs to change? <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="reject-comment"
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  rows={4}
                  required
                  placeholder="e.g. Tuesday's hours look high — please verify and add a description."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:bg-white resize-y"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={submitReject}
                  disabled={savingId === rejectDialogFor || !rejectComment.trim()}
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:opacity-60"
                >
                  {savingId === rejectDialogFor ? "Sending back..." : "Send back"}
                </button>
                <button
                  type="button"
                  onClick={closeReject}
                  className="px-4 py-2.5 rounded-2xl text-sm text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
