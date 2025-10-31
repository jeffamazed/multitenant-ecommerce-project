import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { MAX_PRODUCT_RATING, MIN_PRODUCT_RATING } from "@/lib/constants";

interface Props {
  rating: number;
  totalRating: number;
  className?: string;
  iconClassName?: string;
  text?: string;
}

export const StarRating = ({
  rating,
  totalRating,
  className,
  iconClassName,
  text,
}: Props) => {
  const safeRating = Math.max(
    MIN_PRODUCT_RATING,
    Math.min(rating, MAX_PRODUCT_RATING)
  );

  return (
    <div className="flex items-center gap-1">
      <div className={cn("flex items-center gap-x-1", className)}>
        {Array.from({ length: MAX_PRODUCT_RATING }, (_, i) => (
          <StarIcon
            key={i}
            className={cn("size-4", iconClassName, {
              "fill-black": i < safeRating,
            })}
          />
        ))}
        {text && <span>{text}</span>}
        <span className="sr-only">{`This product has an overall rating of ${safeRating} out of ${MAX_PRODUCT_RATING}.`}</span>
      </div>

      <span className="text-base font-medium">
        <span className="sr-only">This product has a total of </span>
        {totalRating} ratings
      </span>
    </div>
  );
};
