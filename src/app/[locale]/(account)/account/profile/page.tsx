"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";
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
import { clientApi, getErrorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth/use-auth";

const profileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
  cin: z.string().optional(),
  drivingLicenseNumber: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function AccountProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      phone: user?.phone ?? "",
      cin: user?.cin ?? "",
      drivingLicenseNumber: user?.drivingLicenseNumber ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ProfileForm) => clientApi.updateProfile(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Profil mis à jour");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mon profil</h1>
        <p className="text-muted-foreground">
          Mettez à jour vos informations personnelles
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
          <CardDescription>Email : {user?.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((d) => mutation.mutate(d))}
            className="max-w-md space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" {...register("firstName")} />
                {errors.firstName && (
                  <p className="text-sm text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" {...register("lastName")} />
                {errors.lastName && (
                  <p className="text-sm text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" type="tel" {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cin">CIN</Label>
              <Input id="cin" {...register("cin")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="drivingLicenseNumber">N° permis</Label>
              <Input id="drivingLicenseNumber" {...register("drivingLicenseNumber")} />
            </div>
            <Button
              type="submit"
              disabled={!isDirty || mutation.isPending}
            >
              {mutation.isPending && <Loader2 className="animate-spin" />}
              Enregistrer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
