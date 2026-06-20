"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

interface StatItemProps {
  value: number;
  suffix?: string;
  label: string;
  className?: string;
}

function StatItem({ value, suffix = "", label, className }: StatItemProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const start = performance.now();

          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  const display =
    suffix === "K+" && count >= value
      ? `${count}K+`
      : suffix === "+" && count >= value
        ? `${count}+`
        : `${count}${suffix}`;

  return (
    <div ref={ref} className={className}>
      <span
        className="font-display text-display text-on-primary"
        data-target={value}
      >
        {display}
      </span>
      <p className="font-h3 text-h3 text-on-primary/80">{label}</p>
    </div>
  );
}

export default function StatsBar() {
  const t = useTranslations("home.stats");

  return (
    <section className="bg-primary-container py-xl">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-xl text-center">
          <StatItem
            value={50}
            suffix="+"
            label={t("proTools")}
            className="flex flex-col items-center"
          />
          <StatItem
            value={100}
            suffix="K+"
            label={t("activeUsers")}
            className="flex flex-col items-center border-y md:border-y-0 md:border-x border-on-primary/20 py-lg md:py-0"
          />
          <StatItem
            value={0}
            label={t("signupRequired")}
            className="flex flex-col items-center"
          />
        </div>
      </div>
    </section>
  );
}
