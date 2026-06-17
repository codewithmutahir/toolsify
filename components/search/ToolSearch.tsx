"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import ToolSearchDropdown from "@/components/search/ToolSearchDropdown";
import { searchTools } from "@/lib/search-tools";
import { cn } from "@/lib/utils";
import { Tool } from "@/types/tool";

const MAX_RESULTS = 6;

type ToolSearchVariant = "header" | "hero";

interface ToolSearchProps {
  variant?: ToolSearchVariant;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  onNavigate?: () => void;
}

export default function ToolSearch({
  variant = "header",
  className,
  inputClassName,
  placeholder,
  onNavigate,
}: ToolSearchProps) {
  const router = useRouter();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const results = useMemo(
    () => searchTools(query, MAX_RESULTS),
    [query]
  );

  const showDropdown = isOpen && query.trim().length >= 2;

  const navigateToTool = useCallback(
    (tool: Tool) => {
      setIsOpen(false);
      setQuery("");
      setActiveIndex(-1);
      onNavigate?.();
      router.push(`/${tool.slug}`);
    },
    [onNavigate, router]
  );

  const navigateToFullSearch = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsOpen(false);
    setActiveIndex(-1);
    onNavigate?.();
    router.push(`/tools?q=${encodeURIComponent(trimmed)}`);
  }, [onNavigate, query, router]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown && event.key === "Enter" && query.trim()) {
      event.preventDefault();
      navigateToFullSearch();
      return;
    }

    if (!showDropdown) {
      if (event.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        event.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          navigateToTool(results[activeIndex]);
        } else {
          navigateToFullSearch();
        }
        break;
      case "Escape":
        event.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const defaultPlaceholder =
    variant === "hero"
      ? "What do you want to do? (e.g. Merge PDF, Word Counter)"
      : "Search 50+ tools...";

  if (variant === "hero") {
    return (
      <div ref={containerRef} className={cn("relative z-30", className)}>
        <div className="flex flex-col sm:flex-row shadow-lg rounded-xl overflow-hidden border border-outline-variant search-glow">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder ?? defaultPlaceholder}
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls={listboxId}
            aria-autocomplete="list"
            className={cn(
              "w-full min-w-0 flex-grow p-md sm:p-xl border-none focus:ring-0 text-body font-body bg-surface-container-lowest outline-none",
              inputClassName
            )}
          />
          <button
            type="button"
            onClick={navigateToFullSearch}
            className="bg-primary-container text-on-primary px-lg sm:px-xl py-md sm:py-0 flex items-center justify-center gap-sm font-bold text-body sm:text-h3 hover:brightness-110 transition-all shrink-0"
          >
            <span className="material-symbols-outlined">search</span>
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {showDropdown && (
          <ToolSearchDropdown
            listboxId={listboxId}
            results={results}
            activeIndex={activeIndex}
            query={query.trim()}
            onSelect={navigateToTool}
            onViewAll={navigateToFullSearch}
            className="rounded-xl z-[100]"
          />
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
        search
      </span>
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? defaultPlaceholder}
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={listboxId}
        aria-autocomplete="list"
        className={cn(
          "w-full bg-surface-bright border border-outline-variant rounded-lg pl-10 py-2 font-body text-small focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all",
          inputClassName
        )}
      />

      {showDropdown && (
        <ToolSearchDropdown
          listboxId={listboxId}
          results={results}
          activeIndex={activeIndex}
          query={query.trim()}
          onSelect={navigateToTool}
          onViewAll={navigateToFullSearch}
        />
      )}
    </div>
  );
}
