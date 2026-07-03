"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, MapPin, Search, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const SEARCH_TOOLBAR_FIELD_HEIGHT = "h-12";

const shellBase = cn(
  SEARCH_TOOLBAR_FIELD_HEIGHT,
  "relative w-full rounded-xl border border-border bg-background text-start transition-colors",
  "hover:border-primary/35",
);

export function SearchToolbarFieldLabel({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute -top-2.5 start-3 z-10 bg-background px-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
      {label}
    </span>
  );
}

export function searchToolbarTriggerClass(open?: boolean, className?: string) {
  return cn(
    shellBase,
    "flex w-full cursor-pointer items-center px-3.5",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30",
    open && "border-primary ring-1 ring-primary/25",
    className,
  );
}

interface SearchToolbarLocationFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  searchPlaceholder?: string;
  noResultsLabel?: string;
  className?: string;
  id?: string;
}

export function SearchToolbarLocationField({
  label,
  value,
  onChange,
  options,
  searchPlaceholder,
  noResultsLabel,
  className,
  id,
}: SearchToolbarLocationFieldProps) {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const display =
    options.find((o) => o.value === value)?.label ?? options[0]?.label ?? "—";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const handleSelect = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          className={searchToolbarTriggerClass(open, className)}
        >
          <SearchToolbarFieldLabel label={label} />
          <span className="flex w-full items-center gap-2.5 pt-0.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="size-3.5" aria-hidden />
            </span>
            <span className="flex-1 truncate text-start text-sm font-medium text-foreground">
              {display}
            </span>
            <ChevronDown
              className={cn(
                "size-4 shrink-0 text-muted-foreground/60 transition-transform duration-200",
                open && "rotate-180",
              )}
              aria-hidden
            />
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[min(100vw-2rem,22rem)] overflow-hidden p-0"
        align="start"
        sideOffset={8}
      >
        <div className="border-b bg-gradient-to-r from-primary/5 via-background to-[var(--tunrent-gold)]/5 px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">{display}</p>
        </div>

        <div className="p-3">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder ?? t("locationSearchPlaceholder")}
              className="h-10 rounded-xl border-muted-foreground/20 bg-muted/30 ps-9 text-sm"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-56 overflow-y-auto px-2 pb-2 scrollbar-thin">
          {filtered.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              {noResultsLabel ?? t("locationNoResults")}
            </p>
          ) : (
            <ul className="space-y-0.5" role="listbox">
              {filtered.map((opt) => {
                const selected = value === opt.value;
                return (
                  <li key={opt.value || "__all"}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => handleSelect(opt.value)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm transition-colors",
                        selected
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-foreground hover:bg-muted/70",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {selected ? (
                          <Check className="size-4" aria-hidden />
                        ) : (
                          <MapPin className="size-3.5" aria-hidden />
                        )}
                      </span>
                      <span className="flex-1 truncate">{opt.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** @deprecated Use SearchToolbarLocationField */
export const SearchToolbarSelectField = SearchToolbarLocationField;
