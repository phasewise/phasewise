export default function TeamLoading() {
  return (
    <div className="p-6 sm:p-8 max-w-5xl animate-pulse">
      <div className="mb-6">
        <div className="h-4 w-16 bg-[#E8EDE9] rounded mb-3" />
        <div className="h-9 w-32 bg-[#E2EBE4] rounded-lg" />
        <div className="h-4 w-40 bg-[#E8EDE9] rounded mt-2" />
      </div>

      <div className="rounded-2xl border border-[#E2EBE4] bg-white overflow-hidden">
        <div className="px-6 py-4 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-6">
              <div className="h-4 w-32 bg-[#E8EDE9] rounded" />
              <div className="h-4 w-44 bg-[#E8EDE9] rounded" />
              <div className="h-4 w-20 bg-[#E8EDE9] rounded-full" />
              <div className="h-4 w-16 bg-[#E8EDE9] rounded" />
              <div className="h-4 w-16 bg-[#E8EDE9] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
