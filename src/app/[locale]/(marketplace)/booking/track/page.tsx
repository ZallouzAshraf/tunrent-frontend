"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";
import { Search } from "lucide-react";
import { marketplaceApi } from "@/lib/api";
import { BookingRecap } from "@/components/booking/booking-recap";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BOOKING_STATUS_LABELS } from "@/lib/constants/governorates";

export default function BookingTrackPage() {
  return (
    <Suspense fallback={<Skeleton className="mx-auto mt-12 h-64 max-w-2xl rounded-xl" />}>
      <BookingTrackContent />
    </Suspense>
  );
}

function BookingTrackContent() {
  const t = useTranslations("booking");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [reference, setReference] = useState(searchParams.get("ref") ?? "");
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [submitted, setSubmitted] = useState(
    !!(searchParams.get("ref") && searchParams.get("email")),
  );

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["booking-track", reference, email],
    queryFn: async () => {
      const res = await marketplaceApi.trackBooking(reference, email);
      return res.data;
    },
    enabled: submitted && !!reference && !!email,
    retry: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    refetch();
  };

  const statusInfo = data ? BOOKING_STATUS_LABELS[data.status] : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">{t("trackTitle")}</h1>
        <p className="mt-2 text-muted-foreground">{t("trackDesc")}</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4 rounded-xl border bg-card p-6">
        <div>
          <Label htmlFor="reference">{t("reference")}</Label>
          <Input
            id="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="LOC-2026-00042"
            required
          />
        </div>
        <div>
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          <Search className="h-4 w-4" />
          {t("track")}
        </Button>
      </form>

      {isLoading && <Skeleton className="h-64 rounded-xl" />}

      {submitted && isError && (
        <EmptyState
          title={tCommon("noResults")}
          description={
            locale === "ar"
              ? "تحقق من المرجع والبريد الإلكتروني."
              : "Vérifiez la référence et l'email saisis."
          }
        />
      )}

      {data && statusInfo && (
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <Badge className={statusInfo.color + " px-4 py-1.5 text-sm"}>
              {statusInfo.fr}
            </Badge>
          </div>

          {(data.rejectionReason || data.cancellationReason) && (
            <p className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
              {data.rejectionReason ?? data.cancellationReason}
            </p>
          )}

          <BookingRecap
            car={{
              brand: data.car.brand,
              model: data.car.model,
              year: data.car.year,
              thumbnailUrl: data.car.thumbnailUrl,
              agency: { name: data.agency.name },
            }}
            startDate={data.startDate}
            endDate={data.endDate}
            pickupLocation={data.pickupLocation}
            dropoffLocation={data.dropoffLocation}
            totalDays={data.totalDays}
            totalPrice={Number(data.totalPrice)}
            showClient
            clientInfo={{
              firstName: data.clientFirstName,
              lastName: data.clientLastName,
            }}
          />

          {data.agency.phone && (
            <p className="text-center text-sm text-muted-foreground">
              {locale === "ar" ? "اتصل بالوكالة:" : "Contact agence:"}{" "}
              <a href={`tel:${data.agency.phone}`} className="font-medium text-primary">
                {data.agency.phone}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
