import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PartnerHero } from "@/components/landing/partner-hero";
import { PartnerBenefits } from "@/components/landing/partner-benefits";
import { PartnerRegistrationForm } from "./partner-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.partner" });
  return { title: t("title"), description: t("metaDescription") };
}

export default async function BecomePartnerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

  return (
    <>
      <PartnerHero />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-14 xl:grid-cols-[minmax(0,380px)_1fr]">
          <PartnerBenefits />
          <PartnerRegistrationForm />
        </div>
      </div>
    </>
  );
}
