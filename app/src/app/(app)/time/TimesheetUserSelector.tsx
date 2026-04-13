"use client";

import { useRouter } from "next/navigation";

type Props = {
  teamMembers: Array<{ id: string; fullName: string }>;
  currentUserId: string;
  selectedUserId: string;
};

export default function TimesheetUserSelector({
  teamMembers,
  currentUserId,
  selectedUserId,
}: Props) {
  const router = useRouter();

  function handleChange(userId: string) {
    if (userId === currentUserId) {
      router.push("/time");
    } else {
      router.push(`/time?userId=${userId}`);
    }
    router.refresh();
  }

  return (
    <select
      value={selectedUserId}
      onChange={(e) => handleChange(e.target.value)}
      className="bg-[#F7F9F7] border border-[#E2EBE4] rounded-lg px-3 py-2 text-sm text-[#1A2E22] focus:outline-none focus:border-[#52B788] transition-colors"
    >
      {teamMembers.map((member) => (
        <option key={member.id} value={member.id}>
          {member.id === currentUserId ? `${member.fullName} (you)` : member.fullName}
        </option>
      ))}
    </select>
  );
}
