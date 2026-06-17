"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import ToolCard from "@/components/tools/ToolCard";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { getToolBySlug } from "@/constants/tools";
import { getFavorites } from "@/lib/user-tool-data";
import type { Tool } from "@/types/tool";

export default function FavoritesPanel() {
  const { user, isLoaded } = useUser();
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoaded || !user) return;
    setFavoriteSlugs(getFavorites(user.id));
  }, [isLoaded, user]);

  if (!isLoaded) {
    return <DashboardPanelSkeleton />;
  }

  const favoriteTools = favoriteSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((tool): tool is Tool => tool !== undefined);

  if (favoriteTools.length === 0) {
    return (
      <EmptyDashboardState
        icon="bookmark"
        title="No favorites yet"
        description="Star any tool while browsing to save it here for quick access."
        actionLabel="Browse tools"
        actionHref="/tools"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
      {favoriteTools.map((tool) => (
        <ToolCard key={tool.slug} tool={tool} variant="listing" />
      ))}
    </div>
  );
}

function DashboardPanelSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="h-32 rounded-xl bg-surface-container-low animate-pulse"
        />
      ))}
    </div>
  );
}

type EmptyDashboardStateProps = {
  icon: string;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
};

export function EmptyDashboardState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyDashboardStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-2xl text-center">
      <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center mx-auto mb-md">
        <MaterialIcon name={icon} className="text-[28px] text-primary" filled />
      </div>
      <h2 className="font-h3 text-h3 text-on-surface mb-sm">{title}</h2>
      <p className="font-body text-body text-on-surface-variant mb-lg max-w-md mx-auto">
        {description}
      </p>
      <Link
        href={actionHref}
        className="inline-flex items-center justify-center min-h-11 px-lg rounded-lg bg-primary-container text-on-primary font-semibold hover:brightness-110 transition-all"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
