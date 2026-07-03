"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingStepperProps {
  steps: { label: string }[];
  currentStep: number;
  className?: string;
}

export function BookingStepper({ steps, currentStep, className }: BookingStepperProps) {
  return (
    <nav aria-label="Progress" className={cn("w-full", className)}>
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <li key={step.label} className="relative flex flex-1 flex-col items-center">
              {index > 0 && (
                <div
                  className={cn(
                    "absolute right-1/2 top-4 h-0.5 w-full -translate-y-1/2",
                    isComplete ? "bg-primary" : "bg-border",
                  )}
                  style={{ width: "calc(100% - 2rem)", right: "50%" }}
                />
              )}
              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                  isComplete && "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-primary bg-background text-primary",
                  !isComplete && !isCurrent && "border-border bg-background text-muted-foreground",
                )}
              >
                {isComplete ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span
                className={cn(
                  "mt-2 hidden text-center text-xs font-medium sm:block",
                  isCurrent ? "text-primary" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
