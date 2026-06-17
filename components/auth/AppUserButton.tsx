"use client";

import { UserButton } from "@clerk/nextjs";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { userButtonAppearance } from "@/lib/clerk-appearance";

function MenuIcon({ name }: { name: string }) {
  return <MaterialIcon name={name} className="text-[16px]" />;
}

export default function AppUserButton() {
  return (
    <UserButton
      appearance={userButtonAppearance}
      afterSignOutUrl="/"
      userProfileMode="navigation"
      userProfileUrl="/dashboard/profile"
    >
      <UserButton.MenuItems>
        <UserButton.Link
          label="Dashboard"
          labelIcon={<MenuIcon name="dashboard" />}
          href="/dashboard"
        />
        <UserButton.Link
          label="Favorites"
          labelIcon={<MenuIcon name="bookmark" />}
          href="/dashboard/favorites"
        />
        <UserButton.Link
          label="History"
          labelIcon={<MenuIcon name="history" />}
          href="/dashboard/history"
        />
        <UserButton.Link
          label="Request a tool"
          labelIcon={<MenuIcon name="lightbulb" />}
          href="/dashboard/request-tool"
        />
        <UserButton.Action label="manageAccount" />
        <UserButton.Action label="signOut" />
      </UserButton.MenuItems>
    </UserButton>
  );
}
