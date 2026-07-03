import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapPin } from "lucide-react";
import { Link } from "@/i18n/routing";
import { HowItWorksSteps } from "@/components/landing/how-it-works-steps";
import { FaqAccordion } from "@/components/landing/faq-accordion";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.howItWorks" });
  return { title: t("title"), description: t("metaDescription") };
}

const faqs = ["faq1", "faq2", "faq3", "faq4", "faq5"] as const;

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.howItWorks");
  const tCommon = await getTranslations("common");

  const faqItems = faqs.map((faq) => ({
    id: faq,
    question: t(`${faq}Q`),
    answer: t(`${faq}A`),
  }));

  return (
    <>
      <HowItWorksSteps
        namespace="pages.howItWorks"
        className="py-12 sm:py-16"
      />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            {t("faqTitle")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("faqSubtitle")}</p>
        </div>
        <div className="mt-10">
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      <section className="relative overflow-hidden bg-primary py-16 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,168,83,0.15)_0%,transparent_50%)]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <MapPin className="mx-auto size-10 text-[var(--tunrent-gold)]" aria-hidden />
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
              <Link href="/cars">{tCommon("search")}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full border-white/30 bg-transparent text-white hover:bg-white/10 sm:w-auto"
              asChild
            >
              <Link href="/booking/track">{t("trackBooking")}</Link>
            </Button>
          </div>
          <p className="mt-8 text-sm text-white/60">
            {t("agencyCtaPrefix")}{" "}
            <Link
              href="/devenir-partenaire"
              className="font-medium text-[var(--tunrent-gold)] hover:underline"
            >
              {t("agencyCtaLink")}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
