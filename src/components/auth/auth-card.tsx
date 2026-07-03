"use client";

import { Car } from "lucide-react";
import { Link } from "@/i18n/routing";
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
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Car className="h-5 w-5" />
          </div>
          <span className="text-2xl font-bold text-primary">TunRent</span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="rounded-xl border bg-card p-6 shadow-sm">{children}</div>
    </div>
  );
}
