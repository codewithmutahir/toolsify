import type { Metadata } from "next";
import FavoritesPanel from "@/components/dashboard/FavoritesPanel";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Favorites | Toolsify Dashboard",
  description: "Your saved tools on Toolsify.",
};

export default function FavoritesPage() {
  return (
    <DashboardShell
      title="Favorites"
      description="Tools you've saved for quick access."
    >
      <FavoritesPanel />
    </DashboardShell>
  );
}
