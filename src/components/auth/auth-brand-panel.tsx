import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ShieldCheck, Car, Star, Quote } from "lucide-react";
import { Logo } from "@/components/shared/logo";

export async function AuthBrandPanel() {
  const t = await getTranslations("auth.brandPanel");

  const features = [
    { icon: Car, key: "feature1" as const },
    { icon: ShieldCheck, key: "feature2" as const },
    { icon: Star, key: "feature3" as const },
  ] as const;

  return (
    <div className="relative hidden h-full overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between">
      <Image
        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
        alt=""
        fill
        className="object-cover"
        sizes="50vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-[#0f2744]/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(212,168,83,0.2)_0%,transparent_55%)]" />

      <div className="relative z-10 flex flex-1 flex-col justify-center px-10 py-8 xl:px-12">
        <Logo className="[&_span]:text-white [&_.text-primary]:text-white [&_.text-accent]:text-[var(--tunrent-gold)]" />

        <div className="mt-8 max-w-md">
          <h2 className="text-2xl font-bold leading-tight text-white xl:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/75 xl:text-base">
            {t("subtitle")}
          </p>
        </div>

        <ul className="mt-6 space-y-2.5">
          {features.map(({ icon: Icon, key }) => (
            <li key={key} className="flex items-center gap-2.5 text-white/90">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                <Icon className="size-4 text-[var(--tunrent-gold)]" aria-hidden />
              </div>
              <span className="text-xs font-medium xl:text-sm">{t(key)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 mx-8 mb-8 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md xl:mx-10">
        <Quote className="size-5 text-[var(--tunrent-gold)]/80" aria-hidden />
        <p className="mt-2 text-xs leading-relaxed text-white/85 xl:text-sm">
          &ldquo;{t("testimonial")}&rdquo;
        </p>
        <p className="mt-2 text-[10px] font-semibold text-white/60 xl:text-xs">
          {t("testimonialAuthor")}
        </p>
      </div>
    </div>
  );
}
