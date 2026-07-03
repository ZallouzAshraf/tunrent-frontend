"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Clock, Loader2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { agencyApi, billingApi, getErrorMessage } from "@/lib/api";
import { AgencyPlan } from "@/types";

const PLANS: {
  id: AgencyPlan;
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}[] = [
  {
    id: AgencyPlan.STARTER,
    name: "Starter",
    price: "50 TND/mois",
    features: ["Jusqu'à 10 voitures", "2 utilisateurs", "Support email"],
  },
  {
    id: AgencyPlan.PRO,
    name: "Pro",
    price: "80 TND/mois",
    features: [
      "Voitures illimitées",
      "10 utilisateurs",
      "Statistiques avancées",
      "Support prioritaire",
    ],
    highlighted: true,
  },
  {
    id: AgencyPlan.ENTERPRISE,
    name: "Enterprise",
    price: "140 TND/mois",
    features: [
      "Multi-agences",
      "API dédiée",
      "Account manager",
      "SLA garanti",
    ],
  },
];

const PLAN_LABELS: Record<string, string> = {
  free: "Gratuit",
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
};

export default function DashboardBillingPage() {
  const queryClient = useQueryClient();

  const { data: agency, isLoading } = useQuery({
    queryKey: ["dashboard", "agency"],
    queryFn: async () => (await agencyApi.get()).data,
  });

  const { data: pendingRequest, isLoading: pendingLoading } = useQuery({
    queryKey: ["dashboard", "billing", "pending"],
    queryFn: async () => (await billingApi.getPendingPlanRequest()).data,
  });

  const requestMutation = useMutation({
    mutationFn: (planId: string) => billingApi.requestPlanChange(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "billing"] });
      toast.success(
        "Demande envoyée. Un administrateur la traitera sous peu.",
      );
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const cancelMutation = useMutation({
    mutationFn: () => billingApi.cancelPendingPlanRequest(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "billing"] });
      toast.success("Demande annulée. Vous pouvez choisir un autre plan.");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const currentPlan = agency?.plan ?? AgencyPlan.FREE;
  const hasPending = Boolean(pendingRequest);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Facturation</h1>
        <p className="text-muted-foreground">
          Choisissez un plan — paiement hors ligne, validation par l&apos;équipe
          TunRent
        </p>
      </div>

      {hasPending && pendingRequest && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 size-5 shrink-0 text-amber-700" />
              <div>
                <p className="font-medium text-amber-900">
                  Demande en attente de validation
                </p>
                <p className="mt-1 text-sm text-amber-800/90">
                  Passage vers le plan{" "}
                  <strong className="capitalize">
                    {PLAN_LABELS[pendingRequest.requestedPlan] ??
                      pendingRequest.requestedPlan}
                  </strong>{" "}
                  ({Number(pendingRequest.monthlyPrice)} TND/mois) — un
                  administrateur traitera votre demande manuellement.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
              disabled={cancelMutation.isPending}
              onClick={() => cancelMutation.mutate()}
            >
              {cancelMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <X className="size-4" />
              )}
              Annuler la demande
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="size-5" />
            Plan actuel
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="default" className="text-sm capitalize">
                {PLAN_LABELS[currentPlan] ?? currentPlan}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Agence : {agency?.name}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const isPendingTarget =
            hasPending && pendingRequest?.requestedPlan === plan.id;

          return (
            <Card
              key={plan.id}
              className={
                plan.highlighted
                  ? "border-primary shadow-md ring-1 ring-primary"
                  : ""
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.highlighted && (
                    <Sparkles className="size-5 text-[var(--tunrent-gold)]" />
                  )}
                </div>
                <CardDescription className="text-lg font-semibold text-foreground">
                  {plan.price}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  disabled={
                    isCurrent ||
                    isPendingTarget ||
                    hasPending ||
                    requestMutation.isPending ||
                    pendingLoading
                  }
                  onClick={() => requestMutation.mutate(plan.id)}
                >
                  {requestMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : isCurrent ? (
                    "Plan actuel"
                  ) : isPendingTarget ? (
                    "Demande en cours"
                  ) : hasPending ? (
                    "Demande déjà envoyée"
                  ) : (
                    "Choisir"
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Pas de paiement en ligne pour le moment. Votre demande sera enregistrée
        et validée par un administrateur TunRent (virement, espèces ou autre
        moyen convenu).
      </p>
    </div>
  );
}
