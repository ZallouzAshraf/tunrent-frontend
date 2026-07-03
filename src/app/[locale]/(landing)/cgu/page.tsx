import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.cgu" });
  return { title: t("title"), description: t("metaDescription") };
}

const sections = ["section1", "section2", "section3"] as const;

export default async function CguPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.cgu");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("lastUpdated")}</p>

      <div className="prose prose-slate mt-10 max-w-none space-y-8">
        {sections.map((section) => (
          <section key={section}>
            <h2 className="text-xl font-semibold text-foreground">
              {t(`${section}Title`)}
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {t(`${section}Content`)}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
