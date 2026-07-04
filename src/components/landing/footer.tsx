import { getTranslations } from "next-intl/server";
import { Globe, Share2, Mail, Phone } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/shared/logo";

const discoverLinks = [
  { href: "/cars" as const, labelKey: "cars" },
  { href: "/agencies" as const, labelKey: "agencies" },
  { href: "/comment-ca-marche" as const, labelKey: "howItWorks" },
  { href: "/devenir-partenaire" as const, labelKey: "becomePartner" },
  { href: "/a-propos" as const, labelKey: "about" },
] as const;

const legalLinks = [
  { href: "/conditions" as const, key: "termsOfUse" },
  { href: "/confidentialite" as const, key: "privacyPolicy" },
  { href: "/cookies" as const, key: "cookiePolicy" },
] as const;

export async function Footer() {
  const t = await getTranslations("landing.footer");
  const tHeader = await getTranslations("landing.header");

  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo className="[&_span]:text-white [&_.text-primary]:text-white [&_.text-accent]:text-accent" />
            <p className="text-sm text-primary-foreground/70">{t("tagline")}</p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-white/20"
                aria-label="Facebook"
              >
                <Globe className="size-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-white/20"
                aria-label="Instagram"
              >
                <Share2 className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">
              {t("discover")}
            </h3>
            <ul className="space-y-2.5">
              {discoverLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-white"
                  >
                    {tHeader(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">
              {t("legal")}
            </h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-white"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">
              {t("contact")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${t("email")}`}
                  className="flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-white"
                >
                  <Mail className="size-4 shrink-0" />
                  {t("email")}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${t("phone").replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-white"
                >
                  <Phone className="size-4 shrink-0" />
                  {t("phone")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-primary-foreground/60">
          © {new Date().getFullYear()} TunRent. {t("rights")}
        </div>
      </div>
    </footer>
  );
}
