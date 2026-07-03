import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

const sizeClasses = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
};

export function StarRating({
  rating,
  maxStars = 5,
  size = "md",
  showValue = false,
  reviewCount,
  className,
}: StarRatingProps) {
  const clampedRating = Math.min(Math.max(rating, 0), maxStars);
  const iconSize = sizeClasses[size];

  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      role="img"
      aria-label={`${clampedRating} sur ${maxStars} étoiles`}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }, (_, i) => {
          const filled = i < Math.floor(clampedRating);
          const partial =
            !filled && i < clampedRating && clampedRating % 1 !== 0;

          return (
            <Star
              key={i}
              className={cn(
                iconSize,
                filled || partial
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-muted-foreground/30",
                partial && "opacity-60",
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-muted-foreground">
          {clampedRating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  );
}
