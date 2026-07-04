"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { StarRating } from "@/components/shared/star-rating";
import { Skeleton } from "@/components/ui/skeleton";
import { marketplaceApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/types";

interface PublicReviewsSectionProps {
  carId?: string;
  agencyId?: string;
  title?: string;
}

export function PublicReviewsSection({
  carId,
  agencyId,
  title,
}: PublicReviewsSectionProps) {
  const locale = useLocale() as "fr" | "ar";
  const sectionTitle =
    title ?? (locale === "ar" ? "آراء العملاء" : "Avis clients");

  const { data, isLoading } = useQuery({
    queryKey: ["marketplace-reviews", carId, agencyId],
    queryFn: async () => {
      const res = await marketplaceApi.getReviews({
        carId,
        agencyId,
        limit: 10,
      });
      return res.data;
    },
    enabled: !!(carId || agencyId),
  });

  const reviews = data?.data ?? [];

  if (isLoading) {
    return <Skeleton className="h-40 w-full rounded-xl" />;
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-xl font-semibold">{sectionTitle}</h2>
      <div className="space-y-4">
        {reviews.map((review: Review) => (
          <article
            key={review.id}
            className="rounded-xl border bg-card p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">{review.clientName}</p>
              <StarRating rating={review.ratingOverall} size="sm" showValue />
            </div>
            {review.comment && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {review.comment}
              </p>
            )}
            {review.agencyReply && (
              <div className="mt-4 rounded-lg bg-muted/50 p-3 text-sm">
                <p className="font-medium text-foreground">
                  {locale === "ar" ? "رد الوكالة" : "Réponse de l'agence"}
                </p>
                <p className="mt-1 text-muted-foreground">{review.agencyReply}</p>
              </div>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              {formatDate(review.createdAt)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
