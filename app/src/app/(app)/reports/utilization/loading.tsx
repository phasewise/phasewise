export default function UtilizationLoading() {
  return (
    <div className="p-6 sm:p-8 max-w-7xl animate-pulse">
      <div className="mb-8">
        <div className="h-4 w-28 bg-[#E8EDE9] rounded mb-3" />
        <div className="h-9 w-44 bg-[#E2EBE4] rounded-lg" />
        <div className="h-4 w-56 bg-[#E8EDE9] rounded mt-2" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-[#E2EBE4] bg-white p-5">
            <div className="h-3 w-24 bg-[#E8EDE9] rounded mb-3" />
            <div className="h-7 w-16 bg-[#E2EBE4] rounded" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#E2EBE4] bg-white overflow-hidden">
        <div className="px-6 py-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 w-32 bg-[#E8EDE9] rounded" />
              <div className="h-4 w-16 bg-[#E8EDE9] rounded" />
              <div className="h-4 w-14 bg-[#E8EDE9] rounded" />
              <div className="h-4 w-14 bg-[#E8EDE9] rounded" />
              <div className="h-4 w-14 bg-[#E8EDE9] rounded-full" />
              <div className="h-4 w-20 bg-[#E8EDE9] rounded" />
              <div className="h-4 w-20 bg-[#E8EDE9] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
