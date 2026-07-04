import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import {
  BRAND_LOGO_FULL,
  BRAND_LOGO_FULL_HEIGHT,
  BRAND_LOGO_FULL_WIDTH,
  BRAND_LOGO_ICON,
  BRAND_NAME,
} from "@/lib/constants/brand";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${BRAND_NAME} — Location de voitures en Tunisie`,
    template: `%s | ${BRAND_NAME}`,
  },
  icons: {
    icon: BRAND_LOGO_ICON,
    apple: BRAND_LOGO_ICON,
  },
  openGraph: {
    type: "website",
    siteName: BRAND_NAME,
    images: [
      {
        url: BRAND_LOGO_FULL,
        width: BRAND_LOGO_FULL_WIDTH,
        height: BRAND_LOGO_FULL_HEIGHT,
        alt: BRAND_NAME,
      },
    ],
  },
  twitter: {
    card: "summary",
    images: [BRAND_LOGO_FULL],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${inter.variable} ${notoArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
