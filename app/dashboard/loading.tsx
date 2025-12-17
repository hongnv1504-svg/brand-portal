export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-[#111111]">
              Brand Assets
            </h1>
            <p className="mt-2 text-sm text-[#111111]/60">
              Manage brand assets for your clients
            </p>
          </div>
        </div>

        {/* Loading State */}
        <div className="flex items-center justify-center py-24">
          <p className="text-sm text-[#111111]/60">Loading...</p>
        </div>
      </div>
    </div>
  );
}

