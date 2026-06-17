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
  enableShortcut?: boolean;
}

function KeyboardShortcutBadge({ isMac }: { isMac: boolean }) {
  return (
    <div className="relative group hidden md:flex items-center gap-xs mr-sm flex-shrink-0">
      <kbd className="inline-flex items-center justify-center h-5 px-1.5 bg-surface-container border border-outline-variant rounded text-[10px] font-label text-on-surface-variant font-medium leading-none">
        {isMac ? "⌘" : "Ctrl"}
      </kbd>
      <kbd className="inline-flex items-center justify-center h-5 px-1.5 bg-surface-container border border-outline-variant rounded text-[10px] font-label text-on-surface-variant font-medium leading-none">
        K
      </kbd>
      <div className="absolute top-full right-0 mt-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible z-[60] pointer-events-none transition-opacity duration-150">
        <div className="bg-inverse-surface text-inverse-on-surface font-label text-label px-sm py-xs rounded-lg whitespace-nowrap shadow-lg">
          Quick search
        </div>
      </div>
    </div>
  );
}

export default function ToolSearch({
  variant = "header",
  className,
  inputClassName,
  placeholder,
  onNavigate,
  enableShortcut = false,
}: ToolSearchProps) {
  const router = useRouter();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isMac, setIsMac] = useState(false);

  const results = useMemo(
    () => searchTools(query, { limit: MAX_RESULTS, implementedOnly: true }),
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
    setIsMac(navigator.platform.toUpperCase().includes("MAC"));
  }, []);

  useEffect(() => {
    if (!enableShortcut) return;

    function handleGlobalKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        const active = document.activeElement;
        const isTypingElsewhere =
          active &&
          active !== inputRef.current &&
          (active instanceof HTMLInputElement ||
            active instanceof HTMLTextAreaElement ||
            (active instanceof HTMLElement && active.isContentEditable));
        if (isTypingElsewhere) return;

        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setIsOpen(true);
        setIsHighlighted(true);
        setTimeout(() => setIsHighlighted(false), 600);
      }
    }

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [enableShortcut]);

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
    <div ref={containerRef} className={cn("relative overflow-visible", className)}>
      <div
        className={cn(
          "flex items-center w-full bg-surface-bright border rounded-lg transition-all overflow-visible",
          isHighlighted
            ? "border-primary-container ring-2 ring-primary-container/30 scale-[1.01]"
            : isFocused
              ? "border-primary-container ring-2 ring-primary-container/20"
              : "border-outline-variant"
        )}
      >
        <span className="material-symbols-outlined pl-3 text-on-surface-variant pointer-events-none shrink-0">
          search
        </span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            setIsOpen(true);
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? defaultPlaceholder}
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          className={cn(
            "flex-1 min-w-0 bg-transparent border-none py-2 px-2 font-body text-small outline-none focus:ring-0",
            inputClassName
          )}
        />
        {enableShortcut && !query && !isFocused && (
          <KeyboardShortcutBadge isMac={isMac} />
        )}
      </div>

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
