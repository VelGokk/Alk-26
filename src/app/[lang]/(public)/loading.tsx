export default function PublicLoading() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-2/3 animate-pulse rounded-xl bg-alkaya/10" />
      <div className="h-6 w-1/2 animate-pulse rounded-xl bg-alkaya/10" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl bg-alkaya/10"
          />
        ))}
      </div>
    </div>
  );
}
