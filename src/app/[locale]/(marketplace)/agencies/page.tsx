import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AgenciesPageContent } from "@/components/marketplace/agencies-page-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "marketplace.agencies" });
  return { title: t("title"), description: t("metaDescription") };
}

export default async function AgenciesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AgenciesPageContent />;
}
