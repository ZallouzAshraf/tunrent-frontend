import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  CalendarCheck,
  MapPin,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";

export async function AuthRegisterBrandPanel() {
  const t = await getTranslations("auth.registerBrandPanel");

  const benefits = [
    { icon: CalendarCheck, key: "benefit1" as const },
    { icon: MapPin, key: "benefit2" as const },
    { icon: Sparkles, key: "benefit3" as const },
  ] as const;

  return (
    <div className="relative hidden h-full overflow-hidden lg:flex lg:flex-col lg:justify-center">
      <Image
        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80"
        alt=""
        fill
        className="object-cover"
        sizes="50vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-bl from-[#0f766e]/88 via-[#1a5276]/92 to-[#0f2744]/96" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(212,168,83,0.18)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(45,212,191,0.08)_0%,transparent_45%)]" />

      <div className="relative z-10 flex flex-col justify-center px-10 py-8 xl:px-14">
        <Logo surface="dark" size="md" />

        <div className="mt-10 max-w-md">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
            <Sparkles className="size-3.5 text-[var(--tunrent-gold)]" />
            {t("badge")}
          </span>
          <h2 className="mt-4 text-2xl font-bold leading-tight text-white xl:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/80 xl:text-base">
            {t("subtitle")}
          </p>
        </div>

        <ul className="mt-8 space-y-3">
          {benefits.map(({ icon: Icon, key }) => (
            <li
              key={key}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--tunrent-gold)]/20">
                <Icon className="size-4 text-[var(--tunrent-gold)]" aria-hidden />
              </div>
              <span className="text-xs font-medium text-white/90 xl:text-sm">
                {t(key)}
              </span>
              <CheckCircle2
                className="ms-auto size-4 shrink-0 text-teal-300/70"
                aria-hidden
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
