import { cn } from "@/lib/utils";

interface ToolSkeletonGridProps {
  count?: number;
  className?: string;
}

export default function ToolSkeletonGrid({
  count = 8,
  className,
}: ToolSkeletonGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-lg",
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col h-full"
        >
          <div className="w-12 h-12 rounded-lg bg-surface-container-low mb-md" />
          <div className="h-5 w-3/4 rounded bg-surface-container-low mb-xs" />
          <div className="h-4 w-full rounded bg-surface-container-low mb-sm" />
          <div className="h-4 w-5/6 rounded bg-surface-container-low mb-lg flex-grow" />
          <div className="h-4 w-1/3 rounded bg-surface-container-low" />
        </div>
      ))}
    </div>
  );
}
