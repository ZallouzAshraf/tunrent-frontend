import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { KeyRound, ShieldCheck, Clock } from "lucide-react";
import { Logo } from "@/components/shared/logo";

export async function AuthForgotBrandPanel() {
  const t = await getTranslations("auth.forgotBrandPanel");

  const tips = [
    { icon: ShieldCheck, key: "tip1" as const },
    { icon: Clock, key: "tip2" as const },
    { icon: KeyRound, key: "tip3" as const },
  ] as const;

  return (
    <div className="relative hidden h-full overflow-hidden lg:flex lg:flex-col lg:justify-center">
      <Image
        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80"
        alt=""
        fill
        className="object-cover"
        sizes="50vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b]/95 via-[#1e3a5f]/92 to-[#0f2744]/96" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(212,168,83,0.12)_0%,transparent_50%)]" />

      <div className="relative z-10 flex flex-col justify-center px-10 py-8 xl:px-14">
        <Logo className="[&_span]:text-white [&_.text-primary]:text-white [&_.text-accent]:text-[var(--tunrent-gold)]" />

        <div className="mt-10 max-w-md">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <KeyRound className="size-7 text-[var(--tunrent-gold)]" aria-hidden />
          </div>
          <h2 className="text-2xl font-bold leading-tight text-white xl:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/75 xl:text-base">
            {t("subtitle")}
          </p>
        </div>

        <ul className="mt-8 space-y-3">
          {tips.map(({ icon: Icon, key }) => (
            <li
              key={key}
              className="flex items-center gap-3 text-sm text-white/85"
            >
              <Icon className="size-4 shrink-0 text-[var(--tunrent-gold)]" aria-hidden />
              {t(key)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
