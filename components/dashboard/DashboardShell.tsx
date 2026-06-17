import { ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";

type DashboardShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function DashboardShell({
  title,
  description,
  children,
}: DashboardShellProps) {
  return (
    <div className="max-w-container-max mx-auto px-gutter py-xl md:py-2xl">
      <div className="flex flex-col lg:flex-row gap-xl">
        <DashboardSidebar />

        <div className="flex-1 min-w-0">
          <header className="mb-xl">
            <h1 className="font-h1 text-h1 text-on-surface mb-xs">{title}</h1>
            {description && (
              <p className="font-body text-body text-on-surface-variant max-w-2xl">
                {description}
              </p>
            )}
          </header>

          {children}
        </div>
      </div>
    </div>
  );
}
