import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Building2, ShieldCheck, TrendingUp, Headphones } from "lucide-react";

export async function PartnerHero() {
  const t = await getTranslations("pages.partner");

  const badges = [
    { icon: ShieldCheck, key: "badge1" as const },
    { icon: TrendingUp, key: "badge2" as const },
    { icon: Headphones, key: "badge3" as const },
  ] as const;

  return (
    <section className="relative overflow-hidden bg-primary">
      <Image
        src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1920&q=80"
        alt=""
        fill
        className="object-cover opacity-25"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,168,83,0.15)_0%,transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm">
            <Building2 className="size-4 text-[var(--tunrent-gold)]" />
            {t("heroBadge")}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 sm:text-lg">
            {t("heroSubtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {badges.map(({ icon: Icon, key }) => (
              <span
                key={key}
                className="inline-flex items-center gap-2 text-sm text-white/85"
              >
                <Icon className="size-4 text-[var(--tunrent-gold)]" aria-hidden />
                {t(key)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
