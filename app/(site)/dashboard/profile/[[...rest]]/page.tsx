import type { Metadata } from "next";
import DashboardProfile from "@/components/dashboard/DashboardProfile";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Profile | Toolsify Dashboard",
  description: "Manage your Toolsify account and security settings.",
};

export default function ProfilePage() {
  return (
    <DashboardShell
      title="Profile"
      description="Manage your account, email, password, and security settings."
    >
      <DashboardProfile />
    </DashboardShell>
  );
}
