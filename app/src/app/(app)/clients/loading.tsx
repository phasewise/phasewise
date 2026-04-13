export default function ClientsLoading() {
  return (
    <div className="p-6 sm:p-8 max-w-5xl animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <div className="h-9 w-32 bg-[#E2EBE4] rounded-lg" />
          <div className="h-4 w-20 bg-[#E8EDE9] rounded mt-2" />
        </div>
        <div className="h-10 w-28 bg-[#E2EBE4] rounded-lg" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-[#E2EBE4] bg-white p-5">
            <div className="h-5 w-40 bg-[#E2EBE4] rounded mb-2" />
            <div className="h-3 w-28 bg-[#E8EDE9] rounded mb-4" />
            <div className="space-y-2">
              <div className="h-3 w-44 bg-[#E8EDE9] rounded" />
              <div className="h-3 w-28 bg-[#E8EDE9] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
