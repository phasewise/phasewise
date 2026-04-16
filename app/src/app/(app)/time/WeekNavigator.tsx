"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, CalendarCheck } from "lucide-react";

type Props = {
  weekStart: string; // yyyy-MM-dd (Monday)
  prevWeek: string;
  nextWeek: string;
  isCurrentWeek: boolean;
  selectedUserId: string | null; // non-null when admin is viewing someone else
};

export default function WeekNavigator({
  weekStart,
  prevWeek,
  nextWeek,
  isCurrentWeek,
  selectedUserId,
}: Props) {
  const router = useRouter();

  function go(week: string | null) {
    const params = new URLSearchParams();
    if (selectedUserId) params.set("userId", selectedUserId);
    if (week) params.set("week", week);
    const qs = params.toString();
    router.push(qs ? `/time?${qs}` : "/time");
    router.refresh();
  }

  function onPickDate(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.value) return;
    go(e.target.value);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        type="button"
        onClick={() => go(prevWeek)}
        className="inline-flex items-center gap-1 rounded-lg border border-[#E2EBE4] bg-white px-3 py-2 text-sm text-[#3D5C48] hover:border-[#52B788] hover:text-[#2D6A4F] transition-colors"
        title="Previous week"
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </button>

      <input
        type="date"
        value={weekStart}
        onChange={onPickDate}
        className="rounded-lg border border-[#E2EBE4] bg-white px-3 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788]"
        title="Jump to a week (picks the Monday of that week)"
      />

      <button
        type="button"
        onClick={() => go(nextWeek)}
        className="inline-flex items-center gap-1 rounded-lg border border-[#E2EBE4] bg-white px-3 py-2 text-sm text-[#3D5C48] hover:border-[#52B788] hover:text-[#2D6A4F] transition-colors"
        title="Next week"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>

      {!isCurrentWeek && (
        <button
          type="button"
          onClick={() => go(null)}
          className="inline-flex items-center gap-1 rounded-lg bg-[#F0FAF4] border border-[#52B788]/30 px-3 py-2 text-sm font-medium text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white transition-colors"
        >
          <CalendarCheck className="w-4 h-4" />
          This week
        </button>
      )}
    </div>
  );
}
