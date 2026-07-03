"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/api/client";
import { setAgencyId } from "@/lib/api/client";
import {
  setGlobalAccessToken,
  useAuthContext,
} from "@/lib/auth/auth-context";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  defaultEmail?: string;
  defaultFirstName?: string;
  defaultLastName?: string;
}

export function AuthModal({
  open,
  onOpenChange,
  onSuccess,
  defaultEmail,
  defaultFirstName,
  defaultLastName,
}: AuthModalProps) {
  const t = useTranslations("auth");
  const [mode, setMode] = useState<"login" | "register">("login");
  const { setAccessToken } = useAuthContext();
  const queryClient = useQueryClient();

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: defaultEmail ?? "", password: "" },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: defaultFirstName ?? "",
      lastName: defaultLastName ?? "",
      email: defaultEmail ?? "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const finishAuth = async (accessToken: string) => {
    setAccessToken(accessToken);
    setGlobalAccessToken(accessToken);
    setAgencyId(null);
    await queryClient.invalidateQueries({ queryKey: ["me"] });
    toast.success(mode === "login" ? "Connexion réussie" : "Compte créé avec succès");
    onOpenChange(false);
    onSuccess?.();
  };

  const handleLogin = async (values: LoginValues) => {
    try {
      const res = await authApi.login(values);
      await finishAuth(res.data.access_token);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleRegister = async (values: RegisterValues) => {
    try {
      await authApi.register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phone: values.phone,
      });
      const res = await authApi.login({
        email: values.email,
        password: values.password,
      });
      await finishAuth(res.data.access_token);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "login" ? t("loginTitle") : t("registerTitle")}
          </DialogTitle>
        </DialogHeader>

        {mode === "login" ? (
          <form
            onSubmit={loginForm.handleSubmit(handleLogin)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="modal-email">{t("email")}</Label>
              <Input id="modal-email" type="email" {...loginForm.register("email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-password">{t("password")}</Label>
              <Input
                id="modal-password"
                type="password"
                {...loginForm.register("password")}
              />
            </div>
            <Button type="submit" className="w-full">
              {t("loginTitle")}
            </Button>
          </form>
        ) : (
          <form
            onSubmit={registerForm.handleSubmit(handleRegister)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="modal-firstName">Prénom</Label>
                <Input id="modal-firstName" {...registerForm.register("firstName")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-lastName">Nom</Label>
                <Input id="modal-lastName" {...registerForm.register("lastName")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-reg-email">{t("email")}</Label>
              <Input id="modal-reg-email" type="email" {...registerForm.register("email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-reg-password">{t("password")}</Label>
              <Input
                id="modal-reg-password"
                type="password"
                {...registerForm.register("password")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-confirm">Confirmer</Label>
              <Input
                id="modal-confirm"
                type="password"
                {...registerForm.register("confirmPassword")}
              />
            </div>
            <Button type="submit" className="w-full">
              {t("register")}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-muted-foreground">
          {mode === "login" ? t("noAccount") : t("hasAccount")}{" "}
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? t("register") : t("loginTitle")}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
