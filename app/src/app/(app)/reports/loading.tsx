export default function ReportsLoading() {
  return (
    <div className="p-6 sm:p-8 max-w-5xl animate-pulse">
      <div className="mb-8">
        <div className="h-9 w-36 bg-[#E2EBE4] rounded-lg" />
        <div className="h-4 w-64 bg-[#E8EDE9] rounded mt-3" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-[#E2EBE4] bg-white p-6">
            <div className="w-10 h-10 rounded-lg bg-[#E8EDE9] mb-4" />
            <div className="h-5 w-32 bg-[#E2EBE4] rounded mb-3" />
            <div className="h-3 w-full bg-[#E8EDE9] rounded mb-1.5" />
            <div className="h-3 w-3/4 bg-[#E8EDE9] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
