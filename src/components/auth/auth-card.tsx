"use client";

import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

export function AuthCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-md", className)}>
      <div className="mb-8 text-center">
        <div className="mb-6 flex justify-center">
          <Logo size="md" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="rounded-xl border bg-card p-6 shadow-sm">{children}</div>
    </div>
  );
}
