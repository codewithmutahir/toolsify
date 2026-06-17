import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard | Toolsify",
  description: "Your Toolsify dashboard — favorites, history, and tool requests.",
};

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();

  return (
    <DashboardShell
      title={`Welcome back, ${user?.firstName ?? "there"}!`}
      description="Your personal hub for saved tools, recent activity, and feature requests."
    >
      <DashboardOverview />
    </DashboardShell>
  );
}
