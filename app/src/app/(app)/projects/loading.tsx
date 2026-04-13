export default function ProjectsLoading() {
  return (
    <div className="p-8 animate-pulse">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <div className="h-9 w-40 bg-[#E2EBE4] rounded-lg" />
          <div className="h-4 w-56 bg-[#E8EDE9] rounded mt-2" />
        </div>
        <div className="h-10 w-36 bg-[#E2EBE4] rounded-full" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-[#E2EBE4] bg-white p-5">
            <div className="h-3 w-20 bg-[#E8EDE9] rounded mb-3" />
            <div className="h-8 w-16 bg-[#E2EBE4] rounded" />
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-[#E2EBE4] bg-white overflow-hidden">
        <div className="border-b border-[#E2EBE4] px-6 py-5">
          <div className="h-5 w-24 bg-[#E2EBE4] rounded" />
        </div>
        <div className="px-6 py-4 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-6">
              <div className="h-4 w-36 bg-[#E8EDE9] rounded" />
              <div className="h-4 w-24 bg-[#E8EDE9] rounded" />
              <div className="h-4 w-12 bg-[#E8EDE9] rounded-full" />
              <div className="h-4 w-16 bg-[#E8EDE9] rounded-full" />
              <div className="h-4 w-20 bg-[#E8EDE9] rounded" />
              <div className="h-2 w-24 bg-[#E8EDE9] rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
