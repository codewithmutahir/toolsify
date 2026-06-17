export type DashboardNavItem = {
  href: string;
  label: string;
  icon: string;
  description: string;
};

export const dashboardNav: DashboardNavItem[] = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: "dashboard",
    description: "Your activity at a glance",
  },
  {
    href: "/dashboard/favorites",
    label: "Favorites",
    icon: "bookmark",
    description: "Tools you saved for quick access",
  },
  {
    href: "/dashboard/history",
    label: "History",
    icon: "history",
    description: "Recently used tools",
  },
  {
    href: "/dashboard/request-tool",
    label: "Request a Tool",
    icon: "lightbulb",
    description: "Suggest what we should build next",
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: "person",
    description: "Account and security settings",
  },
];

export function isDashboardNavActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}
