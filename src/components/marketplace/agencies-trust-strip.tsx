import { getTranslations } from "next-intl/server";
import { ShieldCheck, BadgeCheck, Headphones, MapPinned } from "lucide-react";

const trustItems = [
  { icon: ShieldCheck, key: "trust1" as const },
  { icon: BadgeCheck, key: "trust2" as const },
  { icon: MapPinned, key: "trust3" as const },
  { icon: Headphones, key: "trust4" as const },
] as const;

export async function AgenciesTrustStrip() {
  const t = await getTranslations("marketplace.agencies");

  return (
    <section className="border-b bg-muted/30 py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map(({ icon: Icon, key }) => (
            <div key={key} className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {t(`${key}Title`)}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t(`${key}Desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
