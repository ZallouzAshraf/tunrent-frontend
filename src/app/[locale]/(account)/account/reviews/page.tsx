"use client";

import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { clientApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-[var(--tunrent-gold)] text-[var(--tunrent-gold)]"
              : "text-muted"
          }`}
        />
      ))}
    </div>
  );
}

export default function AccountReviewsPage() {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["client", "reviews"],
    queryFn: async () => (await clientApi.getReviews()).data,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mes avis</h1>
        <p className="text-muted-foreground">
          Avis laissés après vos locations
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : !reviews?.length ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Vous n&apos;avez pas encore laissé d&apos;avis
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {review.car?.brand} {review.car?.model}
                    </CardTitle>
                    <CardDescription>
                      {formatDate(review.createdAt)}
                    </CardDescription>
                  </div>
                  <StarRow rating={review.ratingOverall} />
                </div>
              </CardHeader>
              {review.comment && (
                <CardContent>
                  <p className="text-sm">{review.comment}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
