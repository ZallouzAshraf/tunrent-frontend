import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { AuthProvider } from "@/components/providers/auth-provider";
import { SessionBootstrap } from "@/components/providers/session-bootstrap";
import { QueryProvider } from "@/components/providers/query-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { CookieConsentBanner } from "@/components/shared/cookie-consent-banner";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "fr" | "ar")) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <QueryProvider>
        <AuthProvider>
          <SessionBootstrap>
            {children}
          </SessionBootstrap>
          <ToastProvider />
          <CookieConsentBanner />
        </AuthProvider>
      </QueryProvider>
    </NextIntlClientProvider>
  );
}
