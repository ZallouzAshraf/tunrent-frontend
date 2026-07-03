import { getTranslations } from "next-intl/server";
import {
  BarChart3,
  CalendarDays,
  Globe,
  Users,
  CheckCircle2,
} from "lucide-react";

export async function PartnerBenefits() {
  const t = await getTranslations("pages.partner");

  const benefits = [
    { icon: BarChart3, key: "benefit1" as const },
    { icon: CalendarDays, key: "benefit2" as const },
    { icon: Globe, key: "benefit3" as const },
    { icon: Users, key: "benefit4" as const },
  ] as const;

  const steps = [
    { num: "1", key: "howStep1" as const },
    { num: "2", key: "howStep2" as const },
    { num: "3", key: "howStep3" as const },
  ] as const;

  return (
    <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-bold text-foreground">{t("benefitsTitle")}</h2>
        <ul className="mt-5 space-y-4">
          {benefits.map(({ icon: Icon, key }) => (
            <li key={key} className="flex gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {t(`${key}Title`)}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t(`${key}Desc`)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border bg-muted/40 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          {t("howTitle")}
        </h3>
        <ol className="mt-4 space-y-4">
          {steps.map(({ num, key }) => (
            <li key={key} className="flex items-start gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {num}
              </span>
              <p className="pt-0.5 text-sm text-foreground">{t(key)}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <p className="text-sm text-muted-foreground">{t("freePlanNote")}</p>
        </div>
      </div>
    </aside>
  );
}
