"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { format, parseISO, isBefore, startOfDay } from "date-fns";
import { fr, ar } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  SearchToolbarFieldLabel,
  searchToolbarTriggerClass,
} from "@/components/marketplace/search-toolbar-field";
import "react-day-picker/style.css";

export interface DatePickerFieldProps {
  label: string;
  value?: string;
  time?: string;
  onChange: (date: string, time?: string) => void;
  min?: string;
  max?: string;
  showTime?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

function parseTime(time?: string) {
  if (!time) return { hour: 10, minute: 0 };
  const [h, m] = time.split(":").map(Number);
  return { hour: Number.isFinite(h) ? h : 10, minute: Number.isFinite(m) ? m : 0 };
}

function TimeColumn({
  values,
  selected,
  onSelect,
  formatValue,
}: {
  values: number[];
  selected: number;
  onSelect: (v: number) => void;
  formatValue: (v: number) => string;
}) {
  return (
    <div className="h-44 w-12 overflow-y-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex flex-col items-center gap-0.5 py-1">
        {values.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onSelect(v)}
            className={cn(
              "flex h-8 w-10 items-center justify-center rounded-lg text-sm transition-colors",
              selected === v
                ? "bg-muted font-semibold text-foreground"
                : "text-muted-foreground hover:bg-muted/60",
            )}
          >
            {formatValue(v)}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DatePickerField({
  label,
  value,
  time,
  onChange,
  min,
  max,
  showTime = false,
  disabled,
  className,
  id,
}: DatePickerFieldProps) {
  const tCommon = useTranslations("common");
  const locale = useLocale() as "fr" | "ar";
  const dateLocale = locale === "ar" ? ar : fr;

  const [open, setOpen] = useState(false);
  const [draftDate, setDraftDate] = useState<Date | undefined>();
  const [draftHour, setDraftHour] = useState(10);
  const [draftMinute, setDraftMinute] = useState(0);

  const minDate = min ? startOfDay(parseISO(min)) : startOfDay(new Date());
  const maxDate = max ? startOfDay(parseISO(max)) : undefined;

  useEffect(() => {
    if (!open) return;
    setDraftDate(value ? parseISO(value) : undefined);
    const { hour, minute } = parseTime(time);
    setDraftHour(hour);
    setDraftMinute(minute);
  }, [open, value, time]);

  const displayDate = useMemo(() => {
    if (!value) return "—";
    return format(parseISO(value), "d MMM yyyy", { locale: dateLocale });
  }, [value, dateLocale]);

  const displayTime = useMemo(() => {
    const { hour, minute } = parseTime(time);
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  }, [time]);

  const handleConfirm = () => {
    if (!draftDate) return;
    const dateStr = format(draftDate, "yyyy-MM-dd");
    if (showTime) {
      onChange(
        dateStr,
        `${String(draftHour).padStart(2, "0")}:${String(draftMinute).padStart(2, "0")}`,
      );
    } else {
      onChange(dateStr);
    }
    setOpen(false);
  };

  const isDisabledDay = (date: Date) => {
    const d = startOfDay(date);
    if (isBefore(d, minDate)) return true;
    if (maxDate && isBefore(maxDate, d)) return true;
    return false;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled}
          className={searchToolbarTriggerClass(open, cn("disabled:cursor-not-allowed disabled:opacity-50", className))}
        >
          <SearchToolbarFieldLabel label={label} />
          <span className="flex w-full items-center justify-between gap-3 pt-0.5 text-sm">
            <span className={cn("truncate font-medium", !value && "text-muted-foreground")}>
              {displayDate}
            </span>
            {showTime && (
              <span className="shrink-0 tabular-nums text-muted-foreground">{displayTime}</span>
            )}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-4" align="start">
        <div className={cn("flex gap-4", showTime ? "flex-row" : "flex-col")}>
          <DayPicker
            mode="single"
            selected={draftDate}
            onSelect={setDraftDate}
            locale={dateLocale}
            disabled={isDisabledDay}
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

          {showTime && (
            <div className="flex items-center gap-1 border-s ps-4">
              <TimeColumn
                values={HOURS}
                selected={draftHour}
                onSelect={setDraftHour}
                formatValue={(v) => String(v).padStart(2, "0")}
              />
              <span className="text-lg font-medium text-muted-foreground">:</span>
              <TimeColumn
                values={MINUTES}
                selected={draftMinute}
                onSelect={setDraftMinute}
                formatValue={(v) => String(v).padStart(2, "0")}
              />
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end border-t pt-4">
          <Button
            type="button"
            className="min-w-[120px] font-semibold"
            disabled={!draftDate}
            onClick={handleConfirm}
          >
            {tCommon("confirm")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
