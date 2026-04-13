export default function DashboardLoading() {
  return (
    <div className="p-6 sm:p-8 max-w-7xl animate-pulse">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <div className="h-9 w-48 bg-[#E2EBE4] rounded-lg" />
          <div className="h-4 w-32 bg-[#E8EDE9] rounded mt-2" />
        </div>
        <div className="h-10 w-36 bg-[#E2EBE4] rounded-lg" />
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-[#E2EBE4] bg-white p-5">
            <div className="h-3 w-20 bg-[#E8EDE9] rounded mb-3" />
            <div className="h-8 w-16 bg-[#E2EBE4] rounded" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#E2EBE4] bg-white overflow-hidden">
        <div className="border-b border-[#E2EBE4] px-6 py-5">
          <div className="h-5 w-24 bg-[#E2EBE4] rounded" />
          <div className="h-3 w-48 bg-[#E8EDE9] rounded mt-2" />
        </div>
        <div className="px-6 py-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-6">
              <div className="h-4 w-40 bg-[#E8EDE9] rounded" />
              <div className="h-4 w-24 bg-[#E8EDE9] rounded" />
              <div className="h-4 w-16 bg-[#E8EDE9] rounded" />
              <div className="h-4 w-20 bg-[#E8EDE9] rounded" />
              <div className="h-4 w-20 bg-[#E8EDE9] rounded" />
              <div className="h-2 w-24 bg-[#E8EDE9] rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
