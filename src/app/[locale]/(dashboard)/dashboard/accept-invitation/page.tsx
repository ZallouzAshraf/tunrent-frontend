"use client";

import { use, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Building2, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Link, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getErrorMessage, teamApi } from "@/lib/api";
import { useAuth } from "@/lib/auth/use-auth";

export default function AcceptInvitationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      const redirect = `/dashboard/accept-invitation?token=${encodeURIComponent(token)}`;
      router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
    }
  }, [isLoading, isAuthenticated, router, token]);

  const acceptMutation = useMutation({
    mutationFn: () => teamApi.acceptInvitation(token),
    onSuccess: () => {
      toast.success("Invitation acceptée ! Connectez-vous à l'espace agence.");
      router.replace("/login?redirect=/dashboard");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!token) {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            Lien invalide
          </CardTitle>
          <CardDescription>
            Ce lien d&apos;invitation est incomplet ou a expiré.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/login">Se connecter</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-6 py-8">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Building2 className="h-7 w-7" />
          </div>
          <CardTitle>Invitation équipe</CardTitle>
          <CardDescription>
            Vous avez été invité à rejoindre une agence sur TunRent. Acceptez
            pour accéder au tableau de bord.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full gap-2"
            disabled={acceptMutation.isPending || acceptMutation.isSuccess}
            onClick={() => acceptMutation.mutate()}
          >
            {acceptMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : acceptMutation.isSuccess ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : null}
            Accepter l&apos;invitation
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/">Retour à l&apos;accueil</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
