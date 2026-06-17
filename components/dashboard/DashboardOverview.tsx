"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { dashboardNav } from "@/constants/dashboard-nav";
import { getToolBySlug } from "@/constants/tools";
import {
  getFavorites,
  getToolHistory,
  getToolRequests,
} from "@/lib/user-tool-data";
import { cn } from "@/lib/utils";

export default function DashboardOverview() {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState({
    favorites: 0,
    history: 0,
    requests: 0,
  });

  useEffect(() => {
    if (!isLoaded || !user) return;

    setStats({
      favorites: getFavorites(user.id).length,
      history: getToolHistory(user.id).length,
      requests: getToolRequests(user.id).length,
    });
  }, [isLoaded, user]);

  const recentHistory = user ? getToolHistory(user.id).slice(0, 3) : [];

  return (
    <div className="flex flex-col gap-xl">
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-md">
        <StatCard
          icon="bookmark"
          label="Favorites"
          value={stats.favorites}
          href="/dashboard/favorites"
        />
        <StatCard
          icon="history"
          label="Recent tools"
          value={stats.history}
          href="/dashboard/history"
        />
        <StatCard
          icon="lightbulb"
          label="Requests sent"
          value={stats.requests}
          href="/dashboard/request-tool"
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {dashboardNav
          .filter((item) => item.href !== "/dashboard")
          .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-2xl border border-outline-variant bg-surface-container-lowest p-lg",
                "hover:border-primary-container/40 hover:bg-surface-container-low transition-colors group"
              )}
            >
              <div className="flex items-start gap-md">
                <div className="w-11 h-11 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0">
                  <MaterialIcon
                    name={item.icon}
                    className="text-[22px] text-primary"
                  />
                </div>
                <div>
                  <h2 className="font-h3 text-h3 text-on-surface mb-xs group-hover:text-primary transition-colors">
                    {item.label}
                  </h2>
                  <p className="font-small text-small text-on-surface-variant">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
      </section>

      {recentHistory.length > 0 && (
        <section>
          <div className="flex items-center justify-between gap-md mb-md">
            <h2 className="font-h3 text-h3 text-on-surface">Jump back in</h2>
            <Link
              href="/dashboard/history"
              className="font-small text-small text-primary font-semibold hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="flex flex-col gap-sm">
            {recentHistory.map((entry) => {
              const tool = getToolBySlug(entry.slug);
              if (!tool) return null;

              return (
                <Link
                  key={`${entry.slug}-${entry.usedAt}`}
                  href={`/${tool.slug}`}
                  className="flex items-center gap-md rounded-xl border border-outline-variant bg-surface-container-lowest p-md hover:bg-surface-container-low transition-colors"
                >
                  <MaterialIcon
                    name={tool.icon}
                    className="text-[22px] text-primary-container"
                  />
                  <span className="font-body text-body font-medium text-on-surface">
                    {tool.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  href,
}: {
  icon: string;
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-lg hover:border-primary-container/40 transition-colors"
    >
      <div className="flex items-center gap-sm mb-sm text-on-surface-variant">
        <MaterialIcon name={icon} className="text-[18px]" />
        <span className="font-label text-label uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="font-display text-display text-primary-container">{value}</p>
    </Link>
  );
}
