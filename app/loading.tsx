export default function Loading() {
  return (
    <div className="min-h-[60vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 animate-pulse">
      <div className="h-8 w-56 bg-[#F4EFE5] rounded" />
      <div className="h-64 w-full bg-[#F4EFE5] rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-72 bg-[#F4EFE5] rounded-lg" />
        <div className="h-72 bg-[#F4EFE5] rounded-lg" />
        <div className="h-72 bg-[#F4EFE5] rounded-lg" />
      </div>
    </div>
  );
}
