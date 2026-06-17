import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard | Toolsify",
  description: "Your Toolsify dashboard — saved tools and history coming soon.",
};

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();

  return (
    <div className="max-w-container-max mx-auto px-gutter py-2xl">
      <h1 className="font-h1 text-h1 text-on-surface mb-md">
        Welcome back, {user?.firstName ?? "there"}!
      </h1>
      <p className="font-body text-body text-on-surface-variant">
        Your dashboard is coming soon. Tools history and favorites will appear
        here.
      </p>
    </div>
  );
}
