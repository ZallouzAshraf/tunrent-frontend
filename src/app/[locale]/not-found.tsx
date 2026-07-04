import { getTranslations } from "next-intl/server";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default async function NotFound() {
  const t = await getTranslations("common.notFound");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <FileQuestion className="h-8 w-8 text-primary" />
      </div>
      <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        404
      </p>
      <h1 className="mt-2 text-2xl font-bold">{t("title")}</h1>
      <p className="mt-2 max-w-md text-muted-foreground">{t("description")}</p>
      <Button className="mt-8" asChild>
        <Link href="/">{t("home")}</Link>
      </Button>
    </div>
  );
}
