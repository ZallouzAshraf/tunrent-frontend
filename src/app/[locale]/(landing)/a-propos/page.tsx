import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Target, Eye, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.about" });
  return { title: t("title"), description: t("metaDescription") };
}

const values = ["value1", "value2", "value3", "value4"] as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.about");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          {t("intro")}
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Target className="size-6" aria-hidden />
            </div>
            <h2 className="text-lg font-semibold">{t("missionTitle")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("missionDesc")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Eye className="size-6" aria-hidden />
            </div>
            <h2 className="text-lg font-semibold">{t("visionTitle")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("visionDesc")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <div className="flex items-center gap-3">
          <Heart className="size-6 text-accent" />
          <h2 className="text-2xl font-bold text-foreground">
            {t("valuesTitle")}
          </h2>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {values.map((value) => (
            <div
              key={value}
              className="flex items-center gap-3 rounded-lg border bg-card p-4"
            >
              <div className="size-2 rounded-full bg-primary" />
              <span className="text-sm font-medium">{t(value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
