export default function TimeLoading() {
  return (
    <div className="p-6 sm:p-8 max-w-5xl animate-pulse">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <div className="h-9 w-40 bg-[#E2EBE4] rounded-lg" />
          <div className="h-4 w-48 bg-[#E8EDE9] rounded mt-2" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-10 bg-[#E8EDE9] rounded-lg" />
          <div className="h-10 w-32 bg-[#E8EDE9] rounded-lg" />
          <div className="h-10 w-10 bg-[#E8EDE9] rounded-lg" />
        </div>
      </div>

      <div className="rounded-2xl border border-[#E2EBE4] bg-white overflow-hidden">
        <div className="px-6 py-4 space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 w-12 bg-[#E8EDE9] rounded" />
              <div className="h-8 w-40 bg-[#E8EDE9] rounded" />
              <div className="h-8 w-32 bg-[#E8EDE9] rounded" />
              <div className="h-8 w-16 bg-[#E8EDE9] rounded" />
              <div className="h-8 w-48 bg-[#E8EDE9] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
