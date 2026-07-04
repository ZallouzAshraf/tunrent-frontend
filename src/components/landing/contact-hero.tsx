import { getTranslations } from "next-intl/server";
import { Headphones, MessageCircle, Shield, Clock } from "lucide-react";

export async function ContactHero() {
  const t = await getTranslations("pages.contact");

  const badges = [
    { icon: Clock, key: "badge1" as const },
    { icon: MessageCircle, key: "badge2" as const },
    { icon: Shield, key: "badge3" as const },
  ] as const;

  return (
    <section className="relative overflow-hidden bg-primary">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-[#152a45]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,168,83,0.18)_0%,transparent_55%)]" />
      <div className="absolute -end-24 -top-24 size-96 rounded-full bg-[var(--tunrent-gold)]/10 blur-3xl" />
      <div className="absolute -bottom-32 -start-16 size-80 rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm">
            <Headphones className="size-4 text-[var(--tunrent-gold)]" />
            {t("heroBadge")}
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t("title")}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            {t("intro")}
          </p>

          <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[var(--tunrent-gold)]">
            <Clock className="size-4" aria-hidden />
            {t("responseTime")}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {badges.map(({ icon: Icon, key }) => (
              <span
                key={key}
                className="inline-flex items-center gap-2 text-sm text-white/75"
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
