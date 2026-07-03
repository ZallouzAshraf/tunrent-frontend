import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Route, ShieldCheck, Clock } from "lucide-react";

export async function HowItWorksHero() {
  const t = await getTranslations("pages.howItWorks");

  const badges = [
    { icon: Route, key: "badge1" as const },
    { icon: ShieldCheck, key: "badge2" as const },
    { icon: Clock, key: "badge3" as const },
  ] as const;

  return (
    <section className="relative overflow-hidden bg-primary">
      <Image
        src="https://images.unsplash.com/photo-1493238792000-8113da0277de?auto=format&fit=crop&w=1920&q=80"
        alt=""
        fill
        className="object-cover opacity-30"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary/90 to-primary/85" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,168,83,0.12)_0%,transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm">
            {t("heroBadge")}
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 sm:text-lg">
            {t("heroSubtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 sm:gap-8">
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
