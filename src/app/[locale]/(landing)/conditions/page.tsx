import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalDocument } from "@/components/legal/legal-document";
import { getLegalDocument } from "@/content/legal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const doc = getLegalDocument("terms", locale);
  return { title: doc.title, description: doc.metaDescription };
}

export default async function ConditionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const document = getLegalDocument("terms", locale);

  return <LegalDocument document={document} />;
}
