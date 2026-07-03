"use client";

import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";
import { CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { Link } from "@/i18n/routing";
import { marketplaceApi } from "@/lib/api";
import { useAuth } from "@/lib/auth/use-auth";
import { BookingRecap } from "@/components/booking/booking-recap";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface ConfirmationPageProps {
  params: Promise<{ reference: string }>;
}

export default function BookingConfirmationPage({ params }: ConfirmationPageProps) {
  const { reference } = use(params);
  const t = useTranslations("booking");
  const locale = useLocale();
  const { isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);

  const email =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("email") ?? ""
      : "";

  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking-confirmation", reference, email],
    queryFn: async () => {
      if (!email) return null;
      const res = await marketplaceApi.trackBooking(reference, email);
      return res.data;
    },
    enabled: !!email,
  });

  const copyReference = async () => {
    await navigator.clipboard.writeText(reference);
    setCopied(true);
    toast.success(locale === "ar" ? "تم النسخ!" : "Copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold">
          {locale === "ar" ? "تم إرسال طلبك!" : "Demande envoyée !"}
        </h1>
        <p className="mt-2 text-muted-foreground">{t("pendingMessage")}</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-muted-foreground">{t("reference")}</p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="text-2xl font-bold tracking-wider text-primary">{reference}</span>
            <Button variant="ghost" size="icon" onClick={copyReference}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          {copied && (
            <p className="mt-1 text-xs text-green-600">
              {locale === "ar" ? "تم النسخ!" : "Copié !"}
            </p>
          )}
        </CardContent>
      </Card>

      {isLoading && <Skeleton className="h-64 rounded-xl" />}

      {booking && (
        <BookingRecap
          car={{
            brand: booking.car.brand,
            model: booking.car.model,
            year: booking.car.year,
            thumbnailUrl: booking.car.thumbnailUrl,
            agency: { name: booking.agency.name },
          }}
          startDate={booking.startDate}
          endDate={booking.endDate}
          pickupLocation={booking.pickupLocation}
          dropoffLocation={booking.dropoffLocation}
          totalDays={booking.totalDays}
          totalPrice={Number(booking.totalPrice)}
          showClient
          clientInfo={{
            firstName: booking.clientFirstName,
            lastName: booking.clientLastName,
          }}
        />
      )}

      <div className="mt-8 space-y-4">
        {email && (
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/booking/track?ref=${reference}&email=${encodeURIComponent(email)}`}>
              <ExternalLink className="h-4 w-4" />
              {t("trackTitle")}
            </Link>
          </Button>
        )}

        {!isAuthenticated && (
          <p className="text-center text-sm text-muted-foreground">
            {t("createAccountHint")}
          </p>
        )}

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/cars">{locale === "ar" ? "السيارات" : "Voir les voitures"}</Link>
          </Button>
          {isAuthenticated ? (
            <Button className="flex-1" asChild>
              <Link href="/account/bookings">
                {locale === "ar" ? "حجوزاتي" : "Mes réservations"}
              </Link>
            </Button>
          ) : (
            <Button className="flex-1" asChild>
              <Link href="/register">
                {locale === "ar" ? "إنشاء حساب" : "Créer un compte"}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
