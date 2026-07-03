"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { dashboardApi, getErrorMessage } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function DashboardReviewsPage() {
  const queryClient = useQueryClient();
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "reviews"],
    queryFn: async () => (await dashboardApi.getReviews()).data,
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) =>
      dashboardApi.replyReview(id, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "reviews"] });
      setReplyId(null);
      setReplyText("");
      toast.success("Réponse publiée");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const reviews = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Avis clients</h1>
        <p className="text-muted-foreground">
          Consultez et répondez aux avis reçus
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-48" />
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Aucun avis pour le moment
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
                      {review.clientName}
                    </CardTitle>
                    <CardDescription>
                      {review.car?.brand} {review.car?.model} ·{" "}
                      {formatDate(review.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-[var(--tunrent-gold)] text-[var(--tunrent-gold)]" />
                    <span className="font-semibold">
                      {review.ratingOverall}/5
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {review.comment && <p className="text-sm">{review.comment}</p>}
                {review.agencyReply ? (
                  <div className="rounded-lg bg-secondary p-3 text-sm">
                    <p className="font-medium text-primary mb-1">
                      Votre réponse
                    </p>
                    {review.agencyReply}
                  </div>
                ) : replyId === review.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Votre réponse..."
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={!replyText || replyMutation.isPending}
                        onClick={() =>
                          replyMutation.mutate({
                            id: review.id,
                            text: replyText,
                          })
                        }
                      >
                        {replyMutation.isPending && (
                          <Loader2 className="animate-spin" />
                        )}
                        Publier
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setReplyId(null)}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReplyId(review.id)}
                  >
                    Répondre
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
