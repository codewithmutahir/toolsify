"use client";

import { UserProfile } from "@clerk/nextjs";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { clerkAuthAppearance } from "@/lib/clerk-appearance";

export default function DashboardProfile() {
  const profilePath = useLocalizedPath("/dashboard/profile");

  return (
    <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
      <UserProfile
        appearance={{
          ...clerkAuthAppearance,
          elements: {
            ...clerkAuthAppearance.elements,
            rootBox: "w-full",
            cardBox: "shadow-none w-full",
            card: "shadow-none border-0 rounded-none",
            navbar: "border-b border-outline-variant",
            navbarButton:
              "text-on-surface-variant hover:text-on-surface data-[active=true]:text-primary",
            pageScrollBox: "p-md md:p-lg",
          },
        }}
        routing="path"
        path={profilePath}
      />
    </div>
  );
}
