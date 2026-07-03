"use client";

import { useMemo, useState } from "react";
import { useForm, type UseFormRegister, type FieldValues, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authApi, clientApi, getErrorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth/use-auth";
import { useLogout } from "@/lib/auth/use-logout";
import { changePasswordSchema } from "@/lib/schemas/auth";
import { cn, formatDate } from "@/lib/utils";
import { z } from "zod";

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

function PasswordField<T extends FieldValues>({
  id,
  label,
  name,
  register,
  error,
  hint,
}: {
  id: string;
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
  hint?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        <Lock
          className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          id={id}
          type={visible ? "text" : "password"}
          className="h-10 ps-9 pe-10"
          autoComplete={
            name === "currentPassword" ? "current-password" : "new-password"
          }
          {...register(name)}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute end-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
          aria-label={visible ? "Masquer" : "Afficher"}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function StatusPill({
  ok,
  label,
  detail,
  icon: Icon,
}: {
  ok: boolean;
  label: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 transition-colors",
        ok
          ? "border-emerald-500/20 bg-emerald-500/5"
          : "border-amber-500/20 bg-amber-500/5",
      )}
    >
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg",
          ok ? "bg-emerald-500/15 text-emerald-700" : "bg-amber-500/15 text-amber-700",
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">{label}</p>
          {ok ? (
            <CheckCircle2 className="size-3.5 text-emerald-600" />
          ) : (
            <XCircle className="size-3.5 text-amber-600" />
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

function PasswordChecklist({ password }: { password: string }) {
  const rules = useMemo(
    () => [
      { ok: password.length >= 8, label: "Au moins 8 caractères" },
      { ok: /[A-Za-z]/.test(password), label: "Une lettre" },
      { ok: /\d/.test(password), label: "Un chiffre" },
    ],
    [password],
  );

  if (!password) return null;

  return (
    <ul className="space-y-1.5 rounded-lg bg-muted/50 p-3">
      {rules.map((rule) => (
        <li
          key={rule.label}
          className={cn(
            "flex items-center gap-2 text-xs",
            rule.ok ? "text-emerald-700" : "text-muted-foreground",
          )}
        >
          {rule.ok ? (
            <CheckCircle2 className="size-3.5 shrink-0" />
          ) : (
            <span className="size-3.5 shrink-0 rounded-full border border-muted-foreground/40" />
          )}
          {rule.label}
        </li>
      ))}
    </ul>
  );
}

export default function AccountSecurityPage() {
  const { user } = useAuth();
  const logout = useLogout();
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword") ?? "";

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      await clientApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Mot de passe mis à jour avec succès");
      reset();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleLogoutAll = async () => {
    setIsLoggingOutAll(true);
    try {
      await authApi.logoutAll();
      toast.success("Déconnecté de tous les appareils");
      logout();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoggingOutAll(false);
    }
  };

  const lastLoginLabel = user?.lastLoginAt
    ? formatDate(user.lastLoginAt)
    : "Première connexion";

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Shield className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sécurité</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Protégez votre compte et gérez l&apos;accès à vos données
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatusPill
          ok={!!user?.isEmailVerified}
          label="Email vérifié"
          detail={
            user?.isEmailVerified
              ? (user.email ?? "Adresse confirmée")
              : "Confirmez votre adresse pour sécuriser le compte"
          }
          icon={Mail}
        />
        <StatusPill
          ok={user?.isActive !== false}
          label="Compte actif"
          detail="Votre compte est en bon état"
          icon={ShieldCheck}
        />
        <StatusPill
          ok
          label="Dernière connexion"
          detail={lastLoginLabel}
          icon={KeyRound}
        />
      </div>

      {!user?.isEmailVerified && user?.email && (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-amber-900 dark:text-amber-100">
            Votre email n&apos;est pas encore vérifié — activez votre compte pour
            plus de sécurité.
          </p>
          <Button variant="outline" size="sm" asChild className="shrink-0 border-amber-500/30">
            <Link href={`/verify-email?email=${encodeURIComponent(user.email)}`}>
              Vérifier mon email
            </Link>
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="border-b bg-muted/30 pb-6">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="size-5 text-primary" />
              Changer le mot de passe
            </CardTitle>
            <CardDescription>
              Choisissez un mot de passe unique, différent de vos autres services
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <PasswordField
                id="currentPassword"
                label="Mot de passe actuel"
                name="currentPassword"
                register={register}
                error={errors.currentPassword?.message}
              />

              <Separator />

              <div className="grid gap-5 sm:grid-cols-2">
                <PasswordField
                  id="newPassword"
                  label="Nouveau mot de passe"
                  name="newPassword"
                  register={register}
                  error={errors.newPassword?.message}
                  hint="Minimum 8 caractères"
                />
                <PasswordField
                  id="confirmPassword"
                  label="Confirmer le mot de passe"
                  name="confirmPassword"
                  register={register}
                  error={errors.confirmPassword?.message}
                />
              </div>

              <PasswordChecklist password={newPassword} />

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className="sm:min-w-[160px]"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Mettre à jour"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Sessions & accès</CardTitle>
              <CardDescription>
                Gérez les appareils connectés à votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-medium">Appareil actuel</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Vous êtes connecté sur cette session. Pour couper l&apos;accès
                  partout ailleurs, déconnectez tous les appareils.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLogoutAll}
                disabled={isLoggingOutAll}
              >
                {isLoggingOutAll ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Déconnecter tous les appareils"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Bonnes pratiques</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  Ne partagez jamais votre mot de passe, même avec le support
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  Utilisez un mot de passe différent pour chaque service
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  Déconnectez-vous sur les appareils publics ou partagés
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
