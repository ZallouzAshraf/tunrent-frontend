"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { agencyApi, getErrorMessage } from "@/lib/api";

export default function DashboardAgencySettingsPage() {
  const queryClient = useQueryClient();

  const { data: agency, isLoading } = useQuery({
    queryKey: ["dashboard", "agency"],
    queryFn: async () => (await agencyApi.get()).data,
  });

  const { register, handleSubmit, reset } = useForm({
    values: {
      name: agency?.name ?? "",
      description: agency?.description ?? "",
      email: agency?.email ?? "",
      phone: agency?.phone ?? "",
      phoneWhatsapp: agency?.phoneWhatsapp ?? "",
      address: agency?.address ?? "",
      city: agency?.city ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => agencyApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "agency"] });
      toast.success("Profil agence mis à jour");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  if (isLoading) return <Skeleton className="h-96" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Paramètres agence</h1>
        <p className="text-muted-foreground">
          Logo, description et coordonnées
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil public</CardTitle>
          <CardDescription>
            Informations visibles sur la marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((d) => mutation.mutate(d))}
            className="max-w-xl space-y-4"
          >
            <div className="space-y-2">
              <Label>Nom de l&apos;agence</Label>
              <Input {...register("name")} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea {...register("description")} rows={4} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" {...register("email")} />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input {...register("phone")} />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input {...register("phoneWhatsapp")} />
              </div>
              <div className="space-y-2">
                <Label>Ville</Label>
                <Input {...register("city")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Adresse</Label>
              <Input {...register("address")} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="animate-spin" />}
                Enregistrer
              </Button>
              <Button type="button" variant="outline" onClick={() => reset()}>
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
