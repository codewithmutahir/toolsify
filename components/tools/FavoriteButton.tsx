"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import MaterialIcon from "@/components/ui/MaterialIcon";
import { isFavorite, toggleFavorite } from "@/lib/user-tool-data";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  slug: string;
  className?: string;
};

export default function FavoriteButton({ slug, className }: FavoriteButtonProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    setActive(isFavorite(user.id, slug));
  }, [isLoaded, isSignedIn, slug, user]);

  if (!isLoaded || !isSignedIn) return null;

  function handleToggle() {
    if (!user) return;
    setActive(toggleFavorite(user.id, slug));
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-xs rounded-full px-md py-sm font-small text-small font-semibold transition-colors",
        active
          ? "bg-primary-fixed text-primary"
          : "bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-primary-fixed/60",
        className
      )}
    >
      <MaterialIcon
        name="bookmark"
        className="text-[18px]"
        filled={active}
      />
      {active ? "Saved" : "Save"}
    </button>
  );
}
