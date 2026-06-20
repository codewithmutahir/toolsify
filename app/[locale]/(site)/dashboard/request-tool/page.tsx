import type { Metadata } from "next";
import RequestToolForm from "@/components/dashboard/RequestToolForm";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Request a Tool | Toolsify Dashboard",
  description: "Suggest a new tool for Toolsify to build.",
};

export default function RequestToolPage() {
  return (
    <DashboardShell
      title="Request a Tool"
      description="Tell us what to build next. Member requests help shape our roadmap."
    >
      <RequestToolForm />
    </DashboardShell>
  );
}
