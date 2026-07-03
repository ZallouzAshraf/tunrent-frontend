"use client";

import { use } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useRouter } from "@/i18n/routing";
import { authApi, getErrorMessage } from "@/lib/api";
import { resetPasswordSchema } from "@/lib/schemas/auth";
import { z } from "zod";

type ResetForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ResetForm>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (data: ResetForm) => {
    try {
      await authApi.resetPassword(token, data.password);
      toast.success("Mot de passe mis à jour");
      router.push("/login");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <AuthCard
      title="Nouveau mot de passe"
      description="Choisissez un mot de passe sécurisé"
    >
      {isSubmitSuccessful ? (
        <div className="text-center space-y-4 py-4">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
          <p className="text-sm text-muted-foreground">
            Votre mot de passe a été mis à jour avec succès.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            Réinitialiser
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline">
              Retour à la connexion
            </Link>
          </p>
        </form>
      )}
    </AuthCard>
  );
}
