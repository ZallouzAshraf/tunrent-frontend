"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useTranslations, useLocale } from "next-intl";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { StarRating } from "@/components/shared/star-rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FeaturedReview {
  id: string;
  clientName: string;
  agencyName: string;
  rating: number;
  comment: string;
  governorate: string;
}

const FEATURED_REVIEWS: FeaturedReview[] = [
  {
    id: "1",
    clientName: "Amine B.",
    agencyName: "Auto Prestige Tunis",
    rating: 5,
    comment:
      "Service impeccable ! La voiture était en parfait état et l'agence très professionnelle. Je recommande vivement TunRent.",
    governorate: "Tunis",
  },
  {
    id: "2",
    clientName: "Sarah M.",
    agencyName: "Sousse Location",
    rating: 4.5,
    comment:
      "Réservation facile en ligne, récupération rapide à l'aéroport. Prix transparent, sans surprise. Excellent rapport qualité-prix.",
    governorate: "Sousse",
  },
  {
    id: "3",
    clientName: "Karim T.",
    agencyName: "Sfax Auto Rent",
    rating: 5,
    comment:
      "Troisième location via TunRent et toujours aussi satisfait. Le support client répond rapidement en cas de question.",
    governorate: "Sfax",
  },
  {
    id: "4",
    clientName: "Leila H.",
    agencyName: "Nabeul Cars",
    rating: 4,
    comment:
      "Parfait pour nos vacances à Hammamet. Large choix de véhicules et agences sérieuses. Je réutiliserai sans hésiter.",
    governorate: "Nabeul",
  },
  {
    id: "5",
    clientName: "Mohamed A.",
    agencyName: "Djerba Mobility",
    rating: 5,
    comment:
      "Location d'un SUV pour explorer le sud tunisien. Processus simple, agence flexible sur les horaires de retour.",
    governorate: "Médenine",
  },
];

export function ReviewsCarousel() {
  const t = useTranslations("landing.reviews");
  const locale = useLocale() as "fr" | "ar";

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
      direction: locale === "ar" ? "rtl" : "ltr",
    },
    [Autoplay({ delay: 5000, stopOnInteraction: true })],
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {t("title")}
            </h2>
            <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
          </div>
          <div className="hidden gap-2 sm:flex">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              aria-label={t("prev")}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              aria-label={t("next")}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="mt-8 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {FEATURED_REVIEWS.map((review) => (
              <div
                key={review.id}
                className="min-w-0 shrink-0 grow-0 basis-full sm:basis-[calc(50%-0.5rem)] lg:basis-[calc(33.333%-0.667rem)]"
              >
                <Card className="h-full border-primary/10">
                  <CardContent className="flex h-full flex-col p-6">
                    <Quote className="size-8 text-accent/40" aria-hidden />
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                    <div className="mt-6 border-t pt-4">
                      <StarRating rating={review.rating} size="sm" />
                      <p className="mt-2 font-semibold text-foreground">
                        {review.clientName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {review.agencyName} · {review.governorate}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
