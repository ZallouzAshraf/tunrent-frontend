"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";

/** Ancien flux par lien — redirige vers la saisie du code. */
export default function VerifyEmailTokenRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/verify-email");
  }, [router]);

  return null;
}
