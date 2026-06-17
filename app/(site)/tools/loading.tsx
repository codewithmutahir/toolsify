import ToolSkeletonGrid from "@/components/tools/ToolSkeletonGrid";

export default function ToolsLoading() {
  return (
    <div className="max-w-container-max mx-auto px-gutter py-xl">
      <div className="animate-pulse space-y-md mb-xl">
        <div className="h-10 w-64 mx-auto rounded-lg bg-surface-container-low" />
        <div className="h-5 w-96 max-w-full mx-auto rounded bg-surface-container-low" />
      </div>
      <ToolSkeletonGrid />
    </div>
  );
}
