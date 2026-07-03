"use client";

import { use, useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { authApi, getErrorMessage } from "@/lib/api";

export default function VerifyEmailPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    authApi
      .verifyEmail(token)
      .then((res) => {
        const data = res.data as { message?: string };
        setMessage(data.message ?? "Email vérifié avec succès");
        setStatus("success");
      })
      .catch((err) => {
        setMessage(getErrorMessage(err));
        setStatus("error");
      });
  }, [token]);

  return (
    <AuthCard title="Vérification email">
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Vérification en cours...
            </p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 className="h-12 w-12 text-green-600" />
            <p className="text-sm text-muted-foreground">{message}</p>
            <Link href="/login">
              <Button>Se connecter</Button>
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="h-12 w-12 text-destructive" />
            <p className="text-sm text-destructive">{message}</p>
            <Link href="/login">
              <Button variant="outline">Retour à la connexion</Button>
            </Link>
          </>
        )}
      </div>
    </AuthCard>
  );
}
