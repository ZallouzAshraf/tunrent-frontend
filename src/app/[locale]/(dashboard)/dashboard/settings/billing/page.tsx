"use client";

import { CreditCard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { agencyApi } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "99 TND/mois",
    features: ["Jusqu'à 10 voitures", "2 utilisateurs", "Support email"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "249 TND/mois",
    features: [
      "Voitures illimitées",
      "10 utilisateurs",
      "Statistiques avancées",
      "Support prioritaire",
    ],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Sur devis",
    features: [
      "Multi-agences",
      "API dédiée",
      "Account manager",
      "SLA garanti",
    ],
  },
];

export default function DashboardBillingPage() {
  const { data: agency, isLoading } = useQuery({
    queryKey: ["dashboard", "agency"],
    queryFn: async () => (await agencyApi.get()).data,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Facturation</h1>
        <p className="text-muted-foreground">Plan actuel et upgrade</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Plan actuel
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <div className="flex items-center gap-3">
              <Badge variant="default" className="text-sm capitalize">
                {agency?.plan ?? "starter"}
              </Badge>
              <span className="text-muted-foreground text-sm">
                Agence : {agency?.name}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
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
                  <Sparkles className="h-5 w-5 text-[var(--tunrent-gold)]" />
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
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.highlighted ? "default" : "outline"}
                disabled={agency?.plan === plan.id}
              >
                {agency?.plan === plan.id ? "Plan actuel" : "Choisir"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
