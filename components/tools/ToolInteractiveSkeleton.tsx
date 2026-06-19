export default function ToolInteractiveSkeleton() {
  return (
    <div
      className="animate-pulse space-y-lg"
      aria-busy="true"
      aria-label="Loading tool"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <div className="space-y-sm">
          <div className="h-4 w-24 rounded bg-surface-container-low" />
          <div className="h-14 w-full rounded-xl bg-surface-container-low" />
        </div>
        <div className="space-y-sm">
          <div className="h-4 w-24 rounded bg-surface-container-low" />
          <div className="h-14 w-full rounded-xl bg-surface-container-low" />
        </div>
      </div>
      <div className="h-32 w-full rounded-2xl bg-surface-container-low" />
    </div>
  );
}
