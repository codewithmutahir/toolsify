import type { Metadata } from "next";
import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Dashboard | Toolsify",
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) {
    const locale = await getLocale();
    redirect({ href: "/sign-in", locale });
  }

  return children;
}
