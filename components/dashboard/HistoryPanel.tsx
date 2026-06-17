"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { EmptyDashboardState } from "@/components/dashboard/FavoritesPanel";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { getToolBySlug } from "@/constants/tools";
import { getCategoryTitle } from "@/lib/category-colors";
import { getToolHistory, type ToolHistoryEntry } from "@/lib/user-tool-data";
import { cn } from "@/lib/utils";

function formatRelativeTime(timestamp: number) {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));
}

export default function HistoryPanel() {
  const { user, isLoaded } = useUser();
  const [history, setHistory] = useState<ToolHistoryEntry[]>([]);

  useEffect(() => {
    if (!isLoaded || !user) return;
    setHistory(getToolHistory(user.id));
  }, [isLoaded, user]);

  if (!isLoaded) {
    return (
      <div className="flex flex-col gap-sm">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-20 rounded-xl bg-surface-container-low animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <EmptyDashboardState
        icon="history"
        title="No history yet"
        description="Tools you actually use will show up here so you can jump back in quickly."
        actionLabel="Explore tools"
        actionHref="/tools"
      />
    );
  }

  return (
    <div className="flex flex-col gap-sm">
      {history.map((entry) => {
        const tool = getToolBySlug(entry.slug);
        if (!tool) return null;

        return (
          <Link
            key={`${entry.slug}-${entry.usedAt}`}
            href={`/${tool.slug}`}
            className={cn(
              "flex items-center gap-md rounded-xl border border-outline-variant",
              "bg-surface-container-lowest p-md hover:border-primary-container/40",
              "hover:bg-surface-container-low transition-colors group"
            )}
          >
            <div
              className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                "bg-surface-container-high group-hover:bg-primary-fixed transition-colors"
              )}
            >
              <MaterialIcon
                name={tool.icon}
                className="text-[22px] text-primary-container group-hover:text-primary"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-body text-body font-semibold text-on-surface truncate">
                {tool.title}
              </p>
              <p className="font-small text-small text-on-surface-variant">
                {getCategoryTitle(tool.category)} · {formatRelativeTime(entry.usedAt)}
              </p>
            </div>

            <MaterialIcon
              name="arrow_forward"
              className="text-[20px] text-on-surface-variant group-hover:text-primary shrink-0"
            />
          </Link>
        );
      })}
    </div>
  );
}
