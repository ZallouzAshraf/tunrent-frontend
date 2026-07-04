"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

const CONSENT_KEY = "tunrent-cookie-consent";

export function CookieConsentBanner() {
  const t = useTranslations("common.cookies");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[100] border-t bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:bottom-4 sm:inset-x-4 sm:max-w-xl sm:rounded-xl sm:border"
    >
      <div className="flex gap-3">
        <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{t("title")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("description")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={accept}>
              {t("accept")}
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/confidentialite">{t("learnMore")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
