import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { NOINDEX_METADATA } from "@/lib/seo/noindex";

export const metadata: Metadata = {
  ...NOINDEX_METADATA,
  title: "Dashboard | Toolsify",
  description: "Your Toolsify dashboard — favorites, history, and tool requests.",
};

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    const locale = await getLocale();
    redirect({ href: "/sign-in", locale });
  }

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
