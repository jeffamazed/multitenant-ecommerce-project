"use client";

import { useState } from "react";
import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface Props {
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export const StarPicker = ({
  value = 0,
  onChange,
  disabled,
  className,
}: Props) => {
  const [hoverValue, setHoverValue] = useState<number>(0);

  return (
    <div className={cn("flex items-center", className)} aria-hidden={disabled}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          disabled={disabled}
          type="button"
          key={star}
          aria-pressed={value >= star}
          aria-label={`${star} star`}
          className={cn(
            "p-0.5 hover:scale-110 focus-visible:scale-110 duration-75 transition-transform active:scale-none focus-visible:ring-ring focus-visible:ring-[2px] outline-none",
            {
              "cursor-pointer": !disabled,
              "pointer-events-none select-none": disabled,
            }
          )}
          onClick={() => onChange?.(star)}
          onPointerEnter={() => !disabled && setHoverValue(star)}
          onPointerLeave={() => !disabled && setHoverValue(0)}
          onFocus={() => !disabled && setHoverValue(star)}
          onBlur={() => !disabled && setHoverValue(0)}
        >
          <StarIcon
            className={cn(
              "size-5",
              (hoverValue || value) >= star
                ? "fill-black stroke-black"
                : "stroke-black"
            )}
          />
        </button>
      ))}
    </div>
  );
};
