"use client";

import { useState, useEffect } from "react";
import { useForm, type UseFormRegister, type FieldValues, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Phone,
  UserPlus,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useRouter } from "@/i18n/routing";
import { authApi, getErrorMessage } from "@/lib/api";
import { registerSchema, type RegisterForm } from "@/lib/schemas/auth";

function FormField({
  id,
  label,
  error,
  icon: Icon,
  children,
  optional,
}: {
  id: string;
  label: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs font-medium">
        {label}
        {optional && (
          <span className="ms-1 font-normal text-muted-foreground">(opt.)</span>
        )}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute start-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
        )}
        {children}
      </div>
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

function PasswordInput<T extends FieldValues>({
  id,
  name,
  register,
}: {
  id: string;
  name: Path<T>;
  register: UseFormRegister<T>;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Lock
        className="pointer-events-none absolute start-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        id={id}
        type={visible ? "text" : "password"}
        className="h-9 ps-9 pe-9 text-sm"
        {...register(name)}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        aria-label={visible ? "Masquer" : "Afficher"}
      >
        {visible ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
      </button>
    </div>
  );
}

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { acceptTerms: false },
  });

  const acceptTerms = watch("acceptTerms");

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

  const onSubmit = async (data: RegisterForm) => {
    try {
      await authApi.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });
      toast.success(t("registerSuccess"));
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-teal-500/8 via-background to-background lg:hidden" />

      <div className="relative flex h-full flex-col justify-center overflow-hidden px-5 py-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="mb-3 shrink-0 lg:hidden">
          <Logo size="sm" />
        </div>

        <div className="mx-auto w-full max-w-lg">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-400">
              <UserPlus className="size-5" aria-hidden />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                {t("registerWelcome")}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {t("registerSubtitle")}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                id="firstName"
                label={t("firstName")}
                icon={User}
                error={errors.firstName?.message}
              >
                <Input
                  id="firstName"
                  className="h-9 ps-9 text-sm"
                  {...register("firstName")}
                />
              </FormField>
              <FormField
                id="lastName"
                label={t("lastName")}
                error={errors.lastName?.message}
              >
                <Input id="lastName" className="h-9 text-sm" {...register("lastName")} />
              </FormField>
            </div>

            <FormField
              id="email"
              label={t("email")}
              icon={Mail}
              error={errors.email?.message}
            >
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.tn"
                className="h-9 ps-9 text-sm"
                {...register("email")}
              />
            </FormField>

            <FormField
              id="phone"
              label={t("phoneOptional")}
              icon={Phone}
              optional
            >
              <Input
                id="phone"
                type="tel"
                placeholder="+216 XX XXX XXX"
                className="h-9 ps-9 text-sm"
                {...register("phone")}
              />
            </FormField>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                id="password"
                label={t("password")}
                error={errors.password?.message}
              >
                <PasswordInput id="password" name="password" register={register} />
              </FormField>
              <FormField
                id="confirmPassword"
                label={t("confirmPassword")}
                error={errors.confirmPassword?.message}
              >
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  register={register}
                />
              </FormField>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <Checkbox
                id="acceptTerms"
                checked={acceptTerms}
                onCheckedChange={(v) => setValue("acceptTerms", v === true)}
                className="mt-0.5"
              />
              <Label
                htmlFor="acceptTerms"
                className="text-xs font-normal leading-snug text-muted-foreground"
              >
                {t("acceptTermsPrefix")}{" "}
                <Link href="/cgu" className="font-medium text-primary hover:underline">
                  {t("termsLink")}
                </Link>
              </Label>
            </div>
            {errors.acceptTerms && (
              <p className="text-[11px] text-destructive">{errors.acceptTerms.message}</p>
            )}

            <Button
              type="submit"
              className="h-10 w-full gap-2 bg-teal-600 text-sm text-white hover:bg-teal-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  {t("createAccount")}
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              {t("hasAccount")}{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                {t("loginTitle")}
              </Link>
            </p>
          </form>

          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            <Link href="/" className="hover:text-primary hover:underline">
              ← {t("backToHome")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
