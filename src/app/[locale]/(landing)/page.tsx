import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HeroSearch } from "@/components/landing/hero-search";
import { ReassuranceBadges } from "@/components/landing/reassurance-badges";
import { PopularCars } from "@/components/landing/popular-cars";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PartnerAgencies } from "@/components/landing/partner-agencies";
import { GovernoratesGrid } from "@/components/landing/governorates-grid";
import { ReviewsCarousel } from "@/components/landing/reviews-carousel";
import { AgencyCta } from "@/components/landing/agency-cta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSearch />
      <ReassuranceBadges />
      <PopularCars />
      <HowItWorks />
      <PartnerAgencies />
      <GovernoratesGrid />
      <ReviewsCarousel />
      <AgencyCta />
    </>
  );
}
