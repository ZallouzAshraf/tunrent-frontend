"use client";

import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";

export function MarketplacePromoCard() {
  const t = useTranslations("marketplace.cars");

  return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-[var(--tunrent-gold)]/5 p-6 text-center sm:min-h-[340px]">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-3xl">
        👍
      </div>
      <p className="mt-4 text-base font-bold text-foreground">{t("promoTitle")}</p>
      <p className="mt-2 max-w-[200px] text-sm leading-relaxed text-muted-foreground">
        {t("promoDesc")}
      </p>
      <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
        <ShieldCheck className="size-3.5" />
        {t("promoBadge")}
      </div>
    </div>
  );
}
