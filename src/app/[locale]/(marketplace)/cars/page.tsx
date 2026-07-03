import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Skeleton } from "@/components/ui/skeleton";
import { CarsPageContent } from "@/components/marketplace/cars-page-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "marketplace.cars" });
  return { title: t("title"), description: t("metaDescription") };
}

function ToolbarFallback() {
  return <Skeleton className="h-28 w-full rounded-none" />;
}

export default async function CarsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<ToolbarFallback />}>
      <CarsPageContent />
    </Suspense>
  );
}
