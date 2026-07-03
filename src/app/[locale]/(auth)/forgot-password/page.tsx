"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/routing";
import { authApi, getErrorMessage } from "@/lib/api";
import { forgotPasswordSchema } from "@/lib/schemas/auth";
import { z } from "zod";

type ForgotForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ForgotForm>({ resolver: zodResolver(forgotPasswordSchema) });

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, []);

  const onSubmit = async (data: ForgotForm) => {
    try {
      await authApi.forgotPassword(data.email);
      toast.success(t("forgotSuccessToast"));
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background lg:hidden" />

      <div className="relative flex h-full flex-col justify-center overflow-hidden px-5 py-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="mb-4 shrink-0 lg:hidden">
          <Logo size="sm" />
        </div>

        <div className="mx-auto w-full max-w-md">
          {isSubmitSuccessful ? (
            <div className="text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-teal-500/10">
                <CheckCircle2 className="size-8 text-teal-600" aria-hidden />
              </div>
              <h1 className="mt-6 text-2xl font-bold tracking-tight">
                {t("forgotSuccessTitle")}
              </h1>
              <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
                {t("forgotSuccessDesc")}
              </p>
              <div className="mx-auto mt-6 max-w-sm rounded-xl border border-dashed bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
                {t("forgotSuccessNote")}
              </div>
              <Button variant="outline" className="mt-8 w-full gap-2" asChild>
                <Link href="/login">
                  <ArrowLeft className="size-4" />
                  {t("backToLogin")}
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <KeyRound className="size-5" aria-hidden />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                    {t("forgotPageTitle")}
                  </h1>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {t("forgotPageSubtitle")}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium">
                    {t("email")}
                  </Label>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      id="email"
                      type="email"
                      placeholder="vous@exemple.tn"
                      className="h-10 ps-10"
                      autoComplete="email"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="h-10 w-full gap-2 bg-primary text-sm hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      {t("sendResetLink")}
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                  >
                    <ArrowLeft className="size-3.5" />
                    {t("backToLogin")}
                  </Link>
                </p>
              </form>
            </>
          )}

          <p className="mt-8 text-center text-[11px] text-muted-foreground">
            <Link href="/" className="hover:text-primary hover:underline">
              ← {t("backToHome")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
