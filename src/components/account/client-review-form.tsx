"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { clientApi, getErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

function RatingPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const rating = i + 1;
          return (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(rating)}
              className="rounded p-0.5 transition-colors hover:bg-muted"
              aria-label={`${rating} étoiles`}
            >
              <Star
                className={cn(
                  "h-6 w-6",
                  rating <= value
                    ? "fill-[var(--tunrent-gold)] text-[var(--tunrent-gold)]"
                    : "text-muted",
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ClientReviewForm({
  bookingId,
  onSuccess,
}: {
  bookingId: string;
  onSuccess: () => void;
}) {
  const [ratingOverall, setRatingOverall] = useState(5);
  const [ratingCarCondition, setRatingCarCondition] = useState(5);
  const [ratingService, setRatingService] = useState(5);
  const [ratingValue, setRatingValue] = useState(5);
  const [comment, setComment] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      clientApi.createReview({
        bookingId,
        ratingOverall,
        ratingCarCondition,
        ratingService,
        ratingValue,
        comment: comment.trim() || undefined,
      }),
    onSuccess: () => {
      toast.success("Merci pour votre avis !");
      onSuccess();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
    >
      <RatingPicker
        label="Note globale"
        value={ratingOverall}
        onChange={setRatingOverall}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <RatingPicker
          label="État du véhicule"
          value={ratingCarCondition}
          onChange={setRatingCarCondition}
        />
        <RatingPicker
          label="Service"
          value={ratingService}
          onChange={setRatingService}
        />
        <RatingPicker
          label="Rapport qualité-prix"
          value={ratingValue}
          onChange={setRatingValue}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="review-comment">Commentaire (optionnel)</Label>
        <Textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Partagez votre expérience..."
          maxLength={2000}
        />
      </div>
      <Button type="submit" disabled={mutation.isPending} className="gap-2">
        {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Publier mon avis
      </Button>
    </form>
  );
}
