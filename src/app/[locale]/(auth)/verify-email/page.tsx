"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useRouter } from "@/i18n/routing";
import { authApi, getErrorMessage } from "@/lib/api";

function VerifyEmailForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || code.length !== 6) return;

    setIsSubmitting(true);
    try {
      await authApi.verifyEmail(email, code);
      setVerified(true);
      toast.success(t("verifySuccess"));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error(t("verifyEmailRequired"));
      return;
    }

    setIsResending(true);
    try {
      await authApi.resendVerification(email);
      toast.success(t("verifyResent"));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsResending(false);
    }
  };

  if (verified) {
    return (
      <AuthCard title={t("verifyTitle")}>
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
          <p className="text-sm text-muted-foreground">{t("verifySuccess")}</p>
          <Button onClick={() => router.push("/login")}>{t("loginTitle")}</Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title={t("verifyTitle")} description={t("verifySubtitle")}>
      <form onSubmit={handleVerify} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ps-9"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">{t("verifyCodeLabel")}</Label>
          <Input
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            className="text-center text-2xl tracking-[0.4em] font-mono"
            required
          />
          <p className="text-xs text-muted-foreground">{t("verifyCodeHint")}</p>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || code.length !== 6 || !email}
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : t("verifySubmit")}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          {t("verifyNoCode")}{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || !email}
            className="font-semibold text-primary hover:underline disabled:opacity-50"
          >
            {isResending ? "…" : t("verifyResend")}
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          <Link href="/login" className="hover:text-primary hover:underline">
            {t("backToLogin")}
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <AuthCard title="…">
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </AuthCard>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
