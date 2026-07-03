import { getTranslations } from "next-intl/server";
import { Car } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export async function CarsPageCta() {
  const t = await getTranslations("marketplace.cars");

  return (
    <section className="relative overflow-hidden bg-primary py-16 sm:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(212,168,83,0.15)_0%,transparent_50%)]" />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <Car className="mx-auto size-10 text-[var(--tunrent-gold)]" aria-hidden />
        <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
          {t("ctaTitle")}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-white/80">{t("ctaSubtitle")}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button
            size="lg"
            className="w-full bg-[var(--tunrent-gold)] text-primary hover:bg-[var(--tunrent-gold)]/90 sm:w-auto"
            asChild
          >
            <Link href="/agencies">{t("ctaAgencies")}</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full border-white/30 bg-transparent text-white hover:bg-white/10 sm:w-auto"
            asChild
          >
            <Link href="/comment-ca-marche">{t("ctaHowItWorks")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
