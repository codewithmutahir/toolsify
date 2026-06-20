"use client";

import { UserButton } from "@clerk/nextjs";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { userButtonAppearance } from "@/lib/clerk-appearance";

function MenuIcon({ name }: { name: string }) {
  return <MaterialIcon name={name} className="text-[16px]" />;
}

export default function AppUserButton() {
  const homePath = useLocalizedPath("/");
  const profilePath = useLocalizedPath("/dashboard/profile");
  const dashboardPath = useLocalizedPath("/dashboard");
  const favoritesPath = useLocalizedPath("/dashboard/favorites");
  const historyPath = useLocalizedPath("/dashboard/history");
  const requestToolPath = useLocalizedPath("/dashboard/request-tool");

  return (
    <UserButton
      appearance={userButtonAppearance}
      afterSignOutUrl={homePath}
      userProfileMode="navigation"
      userProfileUrl={profilePath}
    >
      <UserButton.MenuItems>
        <UserButton.Link
          label="Dashboard"
          labelIcon={<MenuIcon name="dashboard" />}
          href={dashboardPath}
        />
        <UserButton.Link
          label="Favorites"
          labelIcon={<MenuIcon name="bookmark" />}
          href={favoritesPath}
        />
        <UserButton.Link
          label="History"
          labelIcon={<MenuIcon name="history" />}
          href={historyPath}
        />
        <UserButton.Link
          label="Request a tool"
          labelIcon={<MenuIcon name="lightbulb" />}
          href={requestToolPath}
        />
        <UserButton.Action label="manageAccount" />
        <UserButton.Action label="signOut" />
      </UserButton.MenuItems>
    </UserButton>
  );
}
