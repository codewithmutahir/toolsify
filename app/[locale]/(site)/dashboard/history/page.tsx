import type { Metadata } from "next";
import HistoryPanel from "@/components/dashboard/HistoryPanel";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "History | Toolsify Dashboard",
  description: "Your recently used tools on Toolsify.",
};

export default function HistoryPage() {
  return (
    <DashboardShell
      title="History"
      description="Tools you've recently used — pick up where you left off."
    >
      <HistoryPanel />
    </DashboardShell>
  );
}
