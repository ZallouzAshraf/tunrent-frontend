"use client";

import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterPillProps {
  label: string;
  active?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply?: () => void;
  onReset?: () => void;
  children: React.ReactNode;
  className?: string;
  panelClassName?: string;
}

export function FilterPill({
  label,
  active,
  open,
  onOpenChange,
  onApply,
  onReset,
  children,
  className,
  panelClassName,
}: FilterPillProps) {
  const tCommon = useTranslations("common");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onOpenChange]);

  return (
    <div ref={ref} className={cn("relative shrink-0", className)}>
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors",
          active
            ? "border-primary bg-primary/5 text-primary"
            : "border-border bg-background text-foreground hover:border-muted-foreground/40 hover:bg-muted/40",
        )}
      >
        {label}
        <ChevronDown
          className={cn("size-4 opacity-50 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div
          className={cn(
            "absolute start-0 top-full z-50 mt-2 min-w-[260px] rounded-2xl border bg-card p-4 shadow-xl",
            panelClassName,
          )}
        >
          {children}
          {onApply && onReset && (
            <div className="mt-4 flex gap-2 border-t pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={onReset}>
                {tCommon("reset")}
              </Button>
              <Button type="button" className="flex-1 font-semibold" onClick={onApply}>
                {tCommon("apply")}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface FilterRadioOptionProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export function FilterRadioOption({ label, checked, onChange }: FilterRadioOptionProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/60",
        checked && "bg-muted/40",
      )}
    >
      <span
        className={cn(
          "flex size-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          checked ? "border-primary" : "border-muted-foreground/35",
        )}
      >
        {checked && <span className="size-2 rounded-full bg-primary" />}
      </span>
      <input type="radio" className="sr-only" checked={checked} onChange={onChange} />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );
}

interface FilterCheckboxOptionProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function FilterCheckboxOption({
  label,
  checked,
  onChange,
}: FilterCheckboxOptionProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/60",
        checked && "bg-muted/40",
      )}
    >
      <span
        className={cn(
          "flex size-[18px] shrink-0 items-center justify-center rounded border-2 transition-colors",
          checked
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/35 bg-background",
        )}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="size-2.5 fill-current">
            <path d="M10.28 2.28a1 1 0 0 1 0 1.42l-5 5a1 1 0 0 1-1.42 0l-2.5-2.5a1 1 0 1 1 1.42-1.42L4.5 6.79l4.28-4.28a1 1 0 0 1 1.5.07z" />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm capitalize text-foreground">{label}</span>
    </label>
  );
}
