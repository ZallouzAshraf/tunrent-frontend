"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { format, parseISO, isBefore, startOfDay } from "date-fns";
import { fr, ar } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  SearchToolbarFieldLabel,
  searchToolbarTriggerClass,
} from "@/components/marketplace/search-toolbar-field";
import "react-day-picker/style.css";

export interface DateRangePickerFieldProps {
  label: string;
  startDate?: string;
  endDate?: string;
  onChange: (startDate: string, endDate: string) => void;
  min?: string;
  disabled?: boolean;
  className?: string;
}

export function DateRangePickerField({
  label,
  startDate,
  endDate,
  onChange,
  min,
  disabled,
  className,
}: DateRangePickerFieldProps) {
  const tCommon = useTranslations("common");
  const locale = useLocale() as "fr" | "ar";
  const dateLocale = locale === "ar" ? ar : fr;

  const [open, setOpen] = useState(false);
  const [draftRange, setDraftRange] = useState<DateRange | undefined>();

  const minDate = min ? startOfDay(parseISO(min)) : startOfDay(new Date());

  useEffect(() => {
    if (!open) return;
    setDraftRange({
      from: startDate ? parseISO(startDate) : undefined,
      to: endDate ? parseISO(endDate) : undefined,
    });
  }, [open, startDate, endDate]);

  const display = useMemo(() => {
    if (!startDate && !endDate) return "—";
    const fmt = (d: string) => format(parseISO(d), "d MMM yyyy", { locale: dateLocale });
    if (startDate && endDate) return `${fmt(startDate)} → ${fmt(endDate)}`;
    if (startDate) return fmt(startDate);
    return fmt(endDate!);
  }, [startDate, endDate, dateLocale]);

  const handleConfirm = () => {
    if (!draftRange?.from || !draftRange?.to) return;
    onChange(
      format(draftRange.from, "yyyy-MM-dd"),
      format(draftRange.to, "yyyy-MM-dd"),
    );
    setOpen(false);
  };

  const isDisabledDay = (date: Date) => isBefore(startOfDay(date), minDate);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={searchToolbarTriggerClass(open, cn("disabled:cursor-not-allowed disabled:opacity-50", className))}
        >
          <SearchToolbarFieldLabel label={label} />
          <span
            className={cn(
              "truncate pt-0.5 text-sm font-medium",
              !startDate && !endDate && "text-muted-foreground",
            )}
          >
            {display}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-4" align="start">
        <DayPicker
          mode="range"
          selected={draftRange}
          onSelect={setDraftRange}
          locale={dateLocale}
          disabled={isDisabledDay}
          numberOfMonths={1}
          showOutsideDays
          className="tunrent-day-picker"
          components={{
            Chevron: ({ orientation }) =>
              orientation === "left" ? (
                <ChevronLeft className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              ),
          }}
        />

        <div className="mt-4 flex justify-end border-t pt-4">
          <Button
            type="button"
            className="min-w-[120px] font-semibold"
            disabled={!draftRange?.from || !draftRange?.to}
            onClick={handleConfirm}
          >
            {tCommon("confirm")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
