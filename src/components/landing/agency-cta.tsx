import { getTranslations } from "next-intl/server";
import { Building2, BarChart3, Clock, Globe } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

const benefits = [
  { key: "benefit1" as const, icon: BarChart3 },
  { key: "benefit2" as const, icon: Clock },
  { key: "benefit3" as const, icon: Globe },
] as const;

export async function AgencyCta() {
  const t = await getTranslations("landing.agencyCta");

  return (
    <section className="relative overflow-hidden bg-primary py-16 sm:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />
      <div className="absolute -end-20 top-0 size-72 rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
          <div className="max-w-xl text-center lg:text-start">
            <div className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-white/10">
              <Building2 className="size-7 text-white" aria-hidden />
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-primary-foreground/80">{t("subtitle")}</p>

            <ul className="mt-6 space-y-3">
              {benefits.map(({ key, icon: Icon }) => (
                <li
                  key={key}
                  className="flex items-center gap-3 text-sm text-primary-foreground/90"
                >
                  <div className="flex size-8 items-center justify-center rounded-lg bg-white/10">
                    <Icon className="size-4" aria-hidden />
                  </div>
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>

          <div className="shrink-0">
            <Button
              size="lg"
              className="bg-accent px-8 text-base hover:bg-accent/90"
              asChild
            >
              <Link href="/devenir-partenaire">{t("cta")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
