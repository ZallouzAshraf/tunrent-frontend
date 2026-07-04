import type { LegalDocumentContent, LegalDocumentType } from "./types";
import { termsAr } from "./terms-ar";
import { termsFr } from "./terms-fr";
import { privacyAr } from "./privacy-ar";
import { privacyFr } from "./privacy-fr";
import { cookiesAr } from "./cookies-ar";
import { cookiesFr } from "./cookies-fr";

const documents: Record<
  LegalDocumentType,
  Record<"fr" | "ar", LegalDocumentContent>
> = {
  terms: { fr: termsFr, ar: termsAr },
  privacy: { fr: privacyFr, ar: privacyAr },
  cookies: { fr: cookiesFr, ar: cookiesAr },
};

export function getLegalDocument(
  type: LegalDocumentType,
  locale: string,
): LegalDocumentContent {
  const lang = locale === "ar" ? "ar" : "fr";
  return documents[type][lang];
}
