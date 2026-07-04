"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useTranslations, useLocale } from "next-intl";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageSquareQuote,
  ShieldCheck,
} from "lucide-react";
import { StarRating } from "@/components/shared/star-rating";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FeaturedReview } from "@/lib/api";

const FALLBACK_REVIEWS: FeaturedReview[] = [
  {
    id: "fallback-1",
    clientName: "Amine B.",
    agencyName: "Auto Prestige Tunis",
    rating: 5,
    comment:
      "Service impeccable ! La voiture était en parfait état et l'agence très professionnelle. Je recommande vivement TunRent.",
    governorate: "Tunis",
    createdAt: new Date().toISOString(),
  },
  {
    id: "fallback-2",
    clientName: "Sarah M.",
    agencyName: "Sousse Location",
    rating: 4.5,
    comment:
      "Réservation facile en ligne, récupération rapide à l'aéroport. Prix transparent, sans surprise.",
    governorate: "Sousse",
    createdAt: new Date().toISOString(),
  },
  {
    id: "fallback-3",
    clientName: "Karim T.",
    agencyName: "Sfax Auto Rent",
    rating: 5,
    comment:
      "Troisième location via TunRent et toujours aussi satisfait. Le support répond rapidement.",
    governorate: "Sfax",
    createdAt: new Date().toISOString(),
  },
  {
    id: "fallback-4",
    clientName: "Leila H.",
    agencyName: "Nabeul Cars",
    rating: 4,
    comment:
      "Parfait pour nos vacances à Hammamet. Large choix de véhicules et agences sérieuses.",
    governorate: "Nabeul",
    createdAt: new Date().toISOString(),
  },
  {
    id: "fallback-5",
    clientName: "Mohamed A.",
    agencyName: "Djerba Mobility",
    rating: 5,
    comment:
      "Location d'un SUV pour explorer le sud tunisien. Processus simple, agence flexible.",
    governorate: "Médenine",
    createdAt: new Date().toISOString(),
  },
];

const AVATAR_GRADIENTS = [
  "from-[#1e3a5f] to-[#3b82f6]",
  "from-[#0f766e] to-[#2dd4bf]",
  "from-[#7c3aed] to-[#a78bfa]",
  "from-[#b45309] to-[#fbbf24]",
  "from-[#be123c] to-[#fb7185]",
] as const;

function avatarGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

function clientInitials(name: string) {
  const parts = name.replace(/\./g, "").trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function ReviewCard({ review }: { review: FeaturedReview }) {
  const t = useTranslations("landing.reviews");
  const gradient = avatarGradient(review.id);

  return (
    <article className="group relative flex h-full w-full min-h-[210px] flex-col rounded-xl border border-black/[0.06] bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:min-h-[220px] sm:p-5">
      <MessageSquareQuote
        className="pointer-events-none absolute end-3 top-3 size-8 text-primary/[0.06]"
        aria-hidden
      />

      <div className="flex flex-wrap items-center gap-2">
        <StarRating rating={review.rating} size="sm" showValue />
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          <ShieldCheck className="size-3 text-emerald-600" />
          {t("verifiedClient")}
        </span>
      </div>

      <blockquote className="mt-3 h-[4.5rem] overflow-hidden text-sm leading-6 text-foreground/80 line-clamp-3">
        &ldquo;{review.comment}&rdquo;
      </blockquote>

      <footer className="mt-auto flex items-center gap-3 border-t border-black/[0.05] pt-3.5">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-bold text-white",
            gradient,
          )}
          aria-hidden
        >
          {clientInitials(review.clientName)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{review.clientName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {review.agencyName}
          </p>
        </div>
        {review.governorate && (
          <p className="hidden shrink-0 items-center gap-1 text-[11px] text-muted-foreground sm:flex">
            <MapPin className="size-3 text-primary/50" />
            {review.governorate}
          </p>
        )}
      </footer>
    </article>
  );
}

interface ReviewsCarouselProps {
  reviews?: FeaturedReview[];
}

export function ReviewsCarousel({ reviews: initialReviews }: ReviewsCarouselProps) {
  const t = useTranslations("landing.reviews");
  const locale = useLocale() as "fr" | "ar";
  const [selectedIndex, setSelectedIndex] = useState(0);

  const reviews = useMemo(
    () =>
      initialReviews && initialReviews.length > 0
        ? initialReviews
        : FALLBACK_REVIEWS,
    [initialReviews],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
      direction: locale === "ar" ? "rtl" : "ltr",
    },
    [Autoplay({ delay: 6000, stopOnInteraction: true })],
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section className="border-y bg-muted/20 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
              <ShieldCheck className="size-3 text-emerald-600" />
              {t("badge")}
            </span>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-x-5 sm:gap-y-2">
              <div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {t("title")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("subtitle")}
                </p>
              </div>

              <div className="inline-flex items-center gap-2.5 rounded-xl border border-black/[0.06] bg-white px-3.5 py-2 shadow-sm">
                <span className="text-2xl font-bold tabular-nums leading-none">
                  {avgRating.toFixed(1)}
                </span>
                <div>
                  <StarRating rating={avgRating} size="sm" />
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {t("statsLabel", { count: reviews.length })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="icon"
              className="size-9 rounded-full"
              onClick={scrollPrev}
              aria-label={t("prev")}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-9 rounded-full"
              onClick={scrollNext}
              aria-label={t("next")}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="mt-8 min-w-0 overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y items-stretch gap-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex min-w-0 shrink-0 grow-0 basis-full sm:basis-[calc(50%-0.5rem)] lg:basis-[calc(33.333%-0.667rem)]"
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex justify-center gap-1.5">
          {reviews.map((review, index) => (
            <button
              key={review.id}
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === selectedIndex
                  ? "w-5 bg-primary"
                  : "w-1.5 bg-primary/25 hover:bg-primary/40",
              )}
              aria-label={`${t("goToReview")} ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
