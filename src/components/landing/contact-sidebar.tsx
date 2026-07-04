import { getTranslations } from "next-intl/server";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  ArrowUpRight,
  Search,
  HelpCircle,
  Building2,
} from "lucide-react";
import { Link } from "@/i18n/routing";

export async function ContactSidebar() {
  const t = await getTranslations("pages.contact");
  const tFooter = await getTranslations("landing.footer");

  const channels = [
    {
      icon: Mail,
      label: t("emailDirect"),
      value: tFooter("email"),
      href: `mailto:${tFooter("email")}`,
    },
    {
      icon: Phone,
      label: t("phone"),
      value: tFooter("phone"),
      href: `tel:${tFooter("phone").replace(/\s/g, "")}`,
    },
    {
      icon: MapPin,
      label: t("addressLabel"),
      value: t("address"),
      href: undefined,
    },
    {
      icon: Clock,
      label: t("hoursLabel"),
      value: t("hours"),
      sub: t("hoursDetail"),
      href: undefined,
    },
  ] as const;

  const quickLinks = [
    { href: "/booking/track" as const, icon: Search, label: t("faqBooking") },
    { href: "/comment-ca-marche" as const, icon: HelpCircle, label: t("faqHowItWorks") },
    { href: "/devenir-partenaire" as const, icon: Building2, label: t("faqPartner") },
  ] as const;

  return (
    <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          {t("infoTitle")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("infoSubtitle")}</p>

        <ul className="mt-6 space-y-4">
          {channels.map((channel) => {
            const Icon = channel.icon;
            const content = (
              <div className="flex gap-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-4" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {channel.label}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    {channel.value}
                  </p>
                  {"sub" in channel && channel.sub && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {channel.sub}
                    </p>
                  )}
                </div>
              </div>
            );

            return (
              <li key={channel.label}>
                {channel.href ? (
                  <a
                    href={channel.href}
                    className="group block rounded-xl p-2 -m-2 transition-colors hover:bg-muted/50"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="p-2 -m-2">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-2xl border border-primary/15 bg-primary/[0.04] p-6">
        <h3 className="text-sm font-bold text-foreground">{t("faqTitle")}</h3>
        <ul className="mt-4 space-y-2">
          {quickLinks.map(({ href, icon: Icon, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-white/80"
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="size-4 text-primary" aria-hidden />
                  {label}
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
