"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dashboardApi, getErrorMessage } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";
import { PaymentMethod } from "@/types";

export default function DashboardPaymentsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CASH);

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "payments"],
    queryFn: async () => (await dashboardApi.getPayments()).data,
  });

  const createPayment = useMutation({
    mutationFn: () =>
      dashboardApi.createPayment({
        bookingId,
        amount: Number(amount),
        method,
        type: "rental",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "payments"] });
      toast.success("Paiement enregistré");
      setShowForm(false);
      setBookingId("");
      setAmount("");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const payments = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Paiements</h1>
          <p className="text-muted-foreground">
            Suivi et enregistrement des paiements
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          Paiement manuel
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Enregistrer un paiement cash</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>ID Réservation</Label>
              <Input
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Montant (TND)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Méthode</Label>
              <Select
                value={method}
                onValueChange={(v) => setMethod(v as PaymentMethod)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PaymentMethod).map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-fit"
              disabled={!bookingId || !amount || createPayment.isPending}
              onClick={() => createPayment.mutate()}
            >
              {createPayment.isPending && (
                <Loader2 className="animate-spin" />
              )}
              Enregistrer
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{data?.meta.total ?? 0} paiement(s)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-48" />
          ) : payments.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Aucun paiement
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Réservation</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{formatDate(p.createdAt)}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {p.booking?.bookingReference ?? p.bookingId.slice(0, 8)}
                    </TableCell>
                    <TableCell>{formatPrice(p.amount)}</TableCell>
                    <TableCell className="capitalize">{p.method}</TableCell>
                    <TableCell className="capitalize">{p.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
