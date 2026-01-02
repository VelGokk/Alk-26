export default function DashboardLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-1/3 animate-pulse rounded-xl bg-black/10" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-2xl bg-black/10"
          />
        ))}
      </div>
    </div>
  );
}
