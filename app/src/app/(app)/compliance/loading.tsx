export default function ComplianceLoading() {
  return (
    <div className="p-6 sm:p-8 max-w-7xl animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <div className="h-9 w-52 bg-[#E2EBE4] rounded-lg" />
          <div className="h-4 w-24 bg-[#E8EDE9] rounded mt-2" />
        </div>
        <div className="h-10 w-28 bg-[#E2EBE4] rounded-lg" />
      </div>

      <div className="rounded-2xl border border-[#E2EBE4] bg-white overflow-hidden">
        <div className="px-6 py-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-6">
              <div className="h-4 w-20 bg-[#E8EDE9] rounded-full" />
              <div className="h-4 w-44 bg-[#E8EDE9] rounded" />
              <div className="h-4 w-24 bg-[#E8EDE9] rounded-full" />
              <div className="h-4 w-20 bg-[#E8EDE9] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
