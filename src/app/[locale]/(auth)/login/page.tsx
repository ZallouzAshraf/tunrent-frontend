"use client";

import { Suspense, useState, useEffect } from "react";
import { useForm, type UseFormRegister, type FieldValues, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  Lock,
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Briefcase,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/routing";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import {
  getErrorMessage,
  isEmailNotVerifiedError,
  setAgencyId,
} from "@/lib/api/client";
import { useAuthContext } from "@/lib/auth/auth-context";
import { storeAccessToken } from "@/lib/auth/session";
import { decodeJwtPayload } from "@/lib/auth/jwt";
import { resolvePostLoginPath } from "@/lib/auth/post-login-redirect";
import {
  dashboardLoginSchema,
  loginSchema,
  type DashboardLoginForm,
  type LoginForm,
} from "@/lib/schemas/auth";
import { isAgencySelectionResponse, type AgencyUserRole, type DashboardAgencyOption } from "@/types";

function FormField({
  id,
  label,
  error,
  icon: Icon,
  children,
  action,
}: {
  id: string;
  label: string;
  error?: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-xs font-medium">
          {label}
        </Label>
        {action}
      </div>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        {children}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
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
      <Input
        id={id}
        type={visible ? "text" : "password"}
        className="h-10 ps-10 pe-10"
        {...register(name)}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

function redirectAfterLogin(path: string) {
  window.location.assign(path);
}

function ClientLoginForm({ redirectTo }: { redirectTo: string }) {
  const t = useTranslations("auth");
  const queryClient = useQueryClient();
  const { setAccessToken } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await authApi.login(data);
      storeAccessToken(res.data.access_token, setAccessToken);
      setAgencyId(null);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success(t("loginSuccess"));
      redirectAfterLogin(
        resolvePostLoginPath({
          roleGlobal: res.data.user.roleGlobal,
          agencyId: res.data.agencyId,
          redirectTo,
        }),
      );
    } catch (err) {
      if (isEmailNotVerifiedError(err)) {
        toast.error(t("verifyRequired"));
        redirectAfterLogin(
          `/verify-email?email=${encodeURIComponent(data.email)}`,
        );
        return;
      }
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <FormField
        id="client-email"
        label={t("email")}
        icon={Mail}
        error={errors.email?.message}
      >
        <Input
          id="client-email"
          type="email"
          placeholder="vous@exemple.tn"
          className="h-10 ps-10"
          {...register("email")}
        />
      </FormField>

      <FormField
        id="client-password"
        label={t("password")}
        icon={Lock}
        error={errors.password?.message}
        action={
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-primary hover:underline"
          >
            {t("forgotPassword")}
          </Link>
        }
      >
        <PasswordInput id="client-password" name="password" register={register} />
      </FormField>

      <Button
        type="submit"
        className="mt-1 h-10 w-full gap-2 bg-primary text-sm hover:bg-primary/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            {t("loginTitle")}
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        {t("noAccount")}{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          {t("register")}
        </Link>
      </p>
    </form>
  );
}

function DashboardLoginForm({ redirectTo }: { redirectTo: string }) {
  const t = useTranslations("auth");
  const queryClient = useQueryClient();
  const { setAccessToken } = useAuthContext();
  const [agencies, setAgencies] = useState<DashboardAgencyOption[] | null>(null);
  const [credentials, setCredentials] = useState<DashboardLoginForm | null>(null);
  const [selectingAgencyId, setSelectingAgencyId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DashboardLoginForm>({
    resolver: zodResolver(dashboardLoginSchema),
  });

  const completeLogin = async (
    agencyId: string,
    payload: Exclude<
      Awaited<ReturnType<typeof authApi.dashboardLogin>>["data"],
      { requiresAgencySelection: true }
    >,
  ) => {
    const jwt = decodeJwtPayload(payload.access_token);
    const resolvedAgencyId = payload.agencyId ?? jwt.agencyId ?? agencyId;
    void (payload.agencyRole ?? jwt.agencyRole);

    if (!resolvedAgencyId) {
      toast.error(t("dashboardLoginError"));
      return;
    }

    storeAccessToken(payload.access_token, setAccessToken);
    setAgencyId(resolvedAgencyId);
    await queryClient.invalidateQueries({ queryKey: ["me"] });
    toast.success(t("dashboardLoginSuccess"));
    redirectAfterLogin(
      resolvePostLoginPath({
        roleGlobal: payload.user?.roleGlobal ?? decodeJwtPayload(payload.access_token).role,
        agencyId: resolvedAgencyId,
        redirectTo,
      }),
    );
  };

  const onSubmit = async (data: DashboardLoginForm) => {
    try {
      const res = await authApi.dashboardLogin(data);

      if (isAgencySelectionResponse(res.data)) {
        setCredentials(data);
        setAgencies(res.data.agencies);
        return;
      }

      const jwt = decodeJwtPayload(res.data.access_token);
      await completeLogin(jwt.agencyId ?? "", res.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onSelectAgency = async (agencyId: string) => {
    if (!credentials) return;

    setSelectingAgencyId(agencyId);
    try {
      const res = await authApi.dashboardLogin({ ...credentials, agencyId });
      if (isAgencySelectionResponse(res.data)) return;
      await completeLogin(agencyId, res.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSelectingAgencyId(null);
    }
  };

  if (agencies?.length) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border bg-muted/30 px-4 py-3 text-center">
          <p className="text-sm font-semibold text-foreground">{t("selectAgency")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("selectAgencyDesc")}</p>
        </div>

        <div className="space-y-2">
          {agencies.map((agency) => (
            <button
              key={agency.id}
              type="button"
              onClick={() => onSelectAgency(agency.id)}
              disabled={!!selectingAgencyId}
              className="flex w-full items-center gap-3 rounded-xl border bg-background px-4 py-3 text-start transition-colors hover:border-primary/30 hover:bg-muted/40 disabled:opacity-60"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-foreground">
                  {agency.name}
                </span>
                <span className="text-xs text-muted-foreground">{agency.role}</span>
              </span>
              {selectingAgencyId === agency.id ? (
                <Loader2 className="size-4 shrink-0 animate-spin text-primary" />
              ) : (
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
              )}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setAgencies(null);
            setCredentials(null);
          }}
          className="w-full text-center text-xs text-muted-foreground hover:text-primary hover:underline"
        >
          {t("backToLogin")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <FormField
        id="dash-email"
        label={t("email")}
        icon={Mail}
        error={errors.email?.message}
      >
        <Input
          id="dash-email"
          type="email"
          placeholder="agence@exemple.tn"
          className="h-10 ps-10"
          {...register("email")}
        />
      </FormField>

      <FormField
        id="dash-password"
        label={t("password")}
        icon={Lock}
        error={errors.password?.message}
        action={
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-primary hover:underline"
          >
            {t("forgotPassword")}
          </Link>
        }
      >
        <PasswordInput id="dash-password" name="password" register={register} />
      </FormField>

      <Button
        type="submit"
        className="mt-1 h-10 w-full gap-2 bg-accent text-sm hover:bg-accent/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            {t("accessDashboard")}
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>

      <p className="rounded-lg border border-dashed bg-muted/40 px-3 py-2 text-center text-[11px] text-muted-foreground">
        {t("agencyHint")}{" "}
        <Link href="/devenir-partenaire" className="font-medium text-primary hover:underline">
          {t("becomePartner")}
        </Link>
      </p>
    </form>
  );
}

function LoginFormPanel() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "";

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

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary/80 via-background to-background lg:hidden" />

      <div className="relative flex h-full flex-col justify-center overflow-hidden px-5 py-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="mb-4 shrink-0 lg:hidden">
          <Logo size="sm" />
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-4">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              {t("welcomeBack")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("loginSubtitle")}</p>
          </div>

          <Tabs defaultValue="client" className="w-full">
            <TabsList className="mb-4 grid h-10 w-full grid-cols-2 rounded-lg bg-muted/60 p-1">
              <TabsTrigger
                value="client"
                className="gap-1.5 rounded-md text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm sm:text-sm"
              >
                <User className="size-3.5 sm:size-4" />
                {t("clientLogin")}
              </TabsTrigger>
              <TabsTrigger
                value="dashboard"
                className="gap-1.5 rounded-md text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm sm:text-sm"
              >
                <Briefcase className="size-3.5 sm:size-4" />
                {t("dashboardLogin")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="client" className="mt-0">
              <ClientLoginForm redirectTo={redirectTo} />
            </TabsContent>
            <TabsContent value="dashboard" className="mt-0">
              <DashboardLoginForm redirectTo={redirectTo} />
            </TabsContent>
          </Tabs>

          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            <Link href="/" className="hover:text-primary hover:underline">
              ← {t("backToHome")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginSkeleton() {
  return (
    <div className="flex h-full items-center justify-center bg-background">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginFormPanel />
    </Suspense>
  );
}
