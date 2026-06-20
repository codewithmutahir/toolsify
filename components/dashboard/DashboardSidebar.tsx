"use client";

import { Link, usePathname } from "@/i18n/navigation";
import {
  dashboardNav,
  isDashboardNavActive,
} from "@/constants/dashboard-nav";
import { cn } from "@/lib/utils";
import MaterialIcon from "@/components/ui/MaterialIcon";

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <>
      <nav
        aria-label="Dashboard"
        className="hidden lg:flex flex-col gap-xs w-60 shrink-0"
      >
        {dashboardNav.map((item) => {
          const active = isDashboardNavActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-sm rounded-xl px-md py-sm font-body text-body transition-colors",
                active
                  ? "bg-primary-fixed text-primary font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
              )}
            >
              <MaterialIcon name={item.icon} className="text-[20px]" filled={active} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <nav
        aria-label="Dashboard"
        className="lg:hidden flex gap-sm overflow-x-auto pb-sm -mx-gutter px-gutter scrollbar-hide"
      >
        {dashboardNav.map((item) => {
          const active = isDashboardNavActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-xs rounded-full px-md py-sm font-small text-small whitespace-nowrap shrink-0 transition-colors border",
                active
                  ? "bg-primary-container text-on-primary border-primary-container"
                  : "bg-surface-container-lowest text-on-surface-variant border-outline-variant"
              )}
            >
              <MaterialIcon name={item.icon} className="text-[16px]" filled={active} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
