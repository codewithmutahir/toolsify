import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  centered = false,
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        centered && "text-center",
        className
      )}
    >
      <h2 className="font-h2 text-h2 text-on-surface">{title}</h2>
      {subtitle && (
        <p
          className={cn(
            "mt-sm font-body text-body text-on-surface-variant max-w-2xl",
            centered && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
