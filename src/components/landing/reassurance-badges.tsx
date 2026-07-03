import { getTranslations } from "next-intl/server";
import { ShieldCheck, CreditCard, BadgeCheck, Headphones } from "lucide-react";

const badges = [
  { key: "noCommitment" as const, icon: ShieldCheck, color: "text-blue-600 bg-blue-50" },
  { key: "securePayment" as const, icon: CreditCard, color: "text-emerald-600 bg-emerald-50" },
  { key: "verifiedAgencies" as const, icon: BadgeCheck, color: "text-primary bg-secondary" },
  { key: "support" as const, icon: Headphones, color: "text-accent bg-red-50" },
] as const;

export async function ReassuranceBadges() {
  const t = await getTranslations("landing.reassurance");

  return (
    <section className="border-b bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="sr-only">{t("title")}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map(({ key, icon: Icon, color }) => (
            <div
              key={key}
              className="flex items-start gap-4 rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${color}`}
              >
                <Icon className="size-6" aria-hidden />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{t(key)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t(`${key}Desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
