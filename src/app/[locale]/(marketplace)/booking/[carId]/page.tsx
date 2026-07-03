"use client";

import { Suspense, use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { User, UserCircle } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { marketplaceApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/api/client";
import { useBookingStore } from "@/stores/booking-store";
import { useAuth } from "@/lib/auth/use-auth";
import { BookingStepper } from "@/components/booking/booking-stepper";
import { BookingRecap } from "@/components/booking/booking-recap";
import { GuestForm, type GuestFormValues } from "@/components/booking/guest-form";
import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { daysBetween } from "@/lib/utils";
import { pickupLocationDisplay } from "@/lib/pickup-location";

interface BookingPageProps {
  params: Promise<{ carId: string }>;
}

export default function BookingPage({ params }: BookingPageProps) {
  return (
    <Suspense fallback={<Skeleton className="mx-auto mt-12 h-96 max-w-3xl rounded-xl" />}>
      <BookingPageContent params={params} />
    </Suspense>
  );
}

function BookingPageContent({ params }: BookingPageProps) {
  const { carId } = use(params);
  const t = useTranslations("booking");
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const router = useRouter();

  const { user, isAuthenticated } = useAuth();
  const { draft, step, setDraft, updateDraft, setStep, clearDraft } = useBookingStore();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [guestMode, setGuestMode] = useState(true);

  const startParam = searchParams.get("start") ?? searchParams.get("start_date");
  const endParam = searchParams.get("end") ?? searchParams.get("end_date");

  const { data: car, isLoading } = useQuery({
    queryKey: ["marketplace-car", carId],
    queryFn: async () => {
      const res = await marketplaceApi.getCar(carId);
      return res.data;
    },
  });

  useEffect(() => {
    if (!car) return;
    const startDate = draft?.startDate ?? startParam ?? "";
    const endDate = draft?.endDate ?? endParam ?? "";
    if (!startDate || !endDate) return;

    const totalDays = daysBetween(startDate, endDate);
    const totalPrice = totalDays * Number(car.pricePerDay);

    setDraft({
      carId: car.id,
      car,
      startDate,
      endDate,
      pickupLocation:
        draft?.pickupLocation ??
        (car.pickupLocations[0]
          ? pickupLocationDisplay(car.pickupLocations[0])
          : ""),
      dropoffLocation:
        draft?.dropoffLocation ??
        (car.pickupLocations[0]
          ? pickupLocationDisplay(car.pickupLocations[0])
          : ""),
      totalDays,
      totalPrice,
      depositAmount: car.depositAmount ? Number(car.depositAmount) : undefined,
      guestMode: !isAuthenticated,
      ...(isAuthenticated && user
        ? {
            clientFirstName: user.firstName,
            clientLastName: user.lastName,
            clientEmail: user.email,
            clientPhone: user.phone ?? "+216",
            clientCin: user.cin,
            clientDrivingLicense: user.drivingLicenseNumber,
          }
        : {}),
    });
  }, [car, startParam, endParam, isAuthenticated, user, setDraft, draft?.pickupLocation, draft?.startDate, draft?.endDate, draft?.dropoffLocation]);

  const bookingMutation = useMutation({
    mutationFn: async () => {
      if (!draft) throw new Error("No draft");
      return marketplaceApi.createBooking({
        carId: draft.carId,
        clientFirstName: draft.clientFirstName!,
        clientLastName: draft.clientLastName!,
        clientEmail: draft.clientEmail!,
        clientPhone: draft.clientPhone!,
        clientCin: draft.clientCin || undefined,
        clientDrivingLicense: draft.clientDrivingLicense || undefined,
        startDate: draft.startDate,
        endDate: draft.endDate,
        pickupLocation: draft.pickupLocation,
        dropoffLocation: draft.dropoffLocation ?? draft.pickupLocation,
        clientNotes: draft.clientNotes,
      });
    },
    onSuccess: (res) => {
      const reference = res.data.bookingReference;
      const email = draft?.clientEmail ?? res.data.clientEmail;
      clearDraft();
      router.push(
        `/booking/confirmation/${reference}?email=${encodeURIComponent(email)}`,
      );
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const steps = [
    { label: t("stepRecap") },
    { label: t("stepInfo") },
    { label: t("stepConfirm") },
  ];

  const handleGuestSubmit = (values: GuestFormValues) => {
    updateDraft({
      ...values,
      guestMode: true,
    });
    setStep(2);
  };

  const handleAuthSuccess = () => {
    if (!user) return;
    updateDraft({
      clientFirstName: user.firstName,
      clientLastName: user.lastName,
      clientEmail: user.email,
      clientPhone: user.phone ?? "+216",
      clientCin: user.cin,
      clientDrivingLicense: user.drivingLicenseNumber,
      guestMode: false,
    });
    setGuestMode(false);
    setStep(2);
  };

  const handleConnectedContinue = () => {
    if (!user) return;
    updateDraft({
      clientFirstName: user.firstName,
      clientLastName: user.lastName,
      clientEmail: user.email,
      clientPhone: user.phone ?? "+216",
      guestMode: false,
    });
    setStep(2);
  };

  useEffect(() => {
    if (isAuthenticated && user && step === 1) {
      handleConnectedContinue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, step]);

  if (isLoading || !draft || !car) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Skeleton className="mb-8 h-12 w-full" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold">{t("title")}</h1>

      <BookingStepper steps={steps} currentStep={step} className="mb-10" />

      {step === 0 && (
        <div className="space-y-6">
          <BookingRecap
            car={car}
            startDate={draft.startDate}
            endDate={draft.endDate}
            pickupLocation={draft.pickupLocation}
            dropoffLocation={draft.dropoffLocation}
            totalDays={draft.totalDays}
            totalPrice={draft.totalPrice}
            depositAmount={draft.depositAmount}
          />
          <Button className="w-full" size="lg" onClick={() => setStep(1)}>
            {tCommon("next")}
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          {!isAuthenticated && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Card
                className={guestMode ? "border-primary ring-1 ring-primary" : "cursor-pointer"}
                onClick={() => setGuestMode(true)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <UserCircle className="h-5 w-5 text-primary" />
                    {t("guestTitle")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{t("guestDesc")}</p>
                </CardContent>
              </Card>
              <Card
                className={!guestMode ? "border-primary ring-1 ring-primary" : "cursor-pointer"}
                onClick={() => {
                  setGuestMode(false);
                  setAuthModalOpen(true);
                }}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <User className="h-5 w-5 text-primary" />
                    {t("loginTitle")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{t("loginDesc")}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAuthModalOpen(true);
                    }}
                  >
                    {tCommon("login")}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {isAuthenticated && user ? (
            <Card>
              <CardContent className="pt-6">
                <p className="font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">{user.phone}</p>
                <Button className="mt-4 w-full" onClick={handleConnectedContinue}>
                  {tCommon("next")}
                </Button>
              </CardContent>
            </Card>
          ) : guestMode ? (
            <GuestForm
              defaultValues={{
                clientFirstName: draft.clientFirstName,
                clientLastName: draft.clientLastName,
                clientEmail: draft.clientEmail,
                clientPhone: draft.clientPhone,
                clientCin: draft.clientCin,
                clientDrivingLicense: draft.clientDrivingLicense,
                clientNotes: draft.clientNotes,
              }}
              onSubmit={handleGuestSubmit}
            />
          ) : null}

          <Button variant="ghost" onClick={() => setStep(0)}>
            {tCommon("back")}
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <BookingRecap
            car={car}
            startDate={draft.startDate}
            endDate={draft.endDate}
            pickupLocation={draft.pickupLocation}
            dropoffLocation={draft.dropoffLocation}
            totalDays={draft.totalDays}
            totalPrice={draft.totalPrice}
            depositAmount={draft.depositAmount}
            showClient
            clientInfo={{
              firstName: draft.clientFirstName,
              lastName: draft.clientLastName,
              email: draft.clientEmail,
              phone: draft.clientPhone,
            }}
          />

          <div className="flex items-start gap-3 rounded-lg border p-4">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(v) => setAcceptTerms(v === true)}
            />
            <Label htmlFor="terms" className="text-sm leading-relaxed">
              {t("acceptTerms")}
            </Label>
          </div>

          <p className="text-sm text-muted-foreground">{t("pendingMessage")}</p>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>
              {tCommon("back")}
            </Button>
            <Button
              className="flex-1"
              size="lg"
              disabled={!acceptTerms || bookingMutation.isPending}
              onClick={() => bookingMutation.mutate()}
            >
              {bookingMutation.isPending ? tCommon("loading") : t("submit")}
            </Button>
          </div>
        </div>
      )}

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        onSuccess={handleAuthSuccess}
        defaultEmail={draft.clientEmail}
        defaultFirstName={draft.clientFirstName}
        defaultLastName={draft.clientLastName}
      />
    </div>
  );
}
