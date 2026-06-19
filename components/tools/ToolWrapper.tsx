import { ReactNode } from "react";

interface ToolWrapperProps {
  children: ReactNode;
  /** @deprecated Handled by ToolPageShell */
  title?: string;
  description?: string;
  category?: string;
  slug?: string;
  seoContent?: ReactNode;
}

/** @deprecated Layout lives in ToolPageShell. This component renders children only. */
export default function ToolWrapper({ children }: ToolWrapperProps) {
  return <>{children}</>;
}
