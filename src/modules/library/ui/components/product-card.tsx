"use client";

import Link from "next/link";
import React, { memo } from "react";
import Image from "next/image";
import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

import ProductPlaceholderMedium from "@/app/assets/img/product_placeholder_medium.png";
import AvatarPlaceholderSmall from "@/app/assets/img/avatar_placeholder_small.png";
import { MAX_PRODUCT_RATING } from "@/lib/constants";

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl?: string | null;
  tenantSlug: string;
  tenantImageUrl: string | null | undefined;
  reviewRating: number;
  reviewCount: number;
}

export const ProductCard = memo(function ProductCard({
  id,
  name,
  imageUrl,
  tenantSlug,
  tenantImageUrl,
  reviewRating,
  reviewCount,
}: ProductCardProps) {
  return (
    <Link
      href={`library/${id}`}
      className={cn(
        "border rounded-md bg-white overflow-hidden block",
        "custom-shadcn-button-product"
      )}
      aria-label={`Visit product page of ${name}`}
    >
      <article>
        <Card className="border-none p-0 gap-0">
          <CardHeader className="p-0 gap-0">
            <AspectRatio className="relative w-full border-b" ratio={1}>
              <Image
                alt={name}
                fill
                sizes="50vw"
                src={imageUrl || ProductPlaceholderMedium}
                placeholder="blur"
                className="object-cover"
              />
            </AspectRatio>
            <CardTitle className="flex py-2 px-4 h-16 overflow-ellipsis">
              <h3 className="text-lg font-medium line-clamp-2 leading-tight">
                {name}
              </h3>
            </CardTitle>
          </CardHeader>

          <CardContent className="px-4 border-b pb-2">
            <span className="flex items-center gap-2">
              <Image
                alt={`${tenantSlug}'s avatar`}
                src={tenantImageUrl || AvatarPlaceholderSmall}
                width={16}
                height={16}
                className="rounded-full border shrink-0 size-[16px]"
              />
              <span className="text-sm font-medium whitespace-normal line-clamp-1">
                {tenantSlug}
              </span>
            </span>

            {reviewCount > 0 && (
              <span className="flex items-center gap-0.5 mt-1 w-fit">
                <StarIcon className="size-3.5 fill-black" />
                <span className="text-sm font-medium" aria-hidden="true">
                  {reviewRating} ({reviewCount})
                </span>
                {/* FOR SR USERS */}
                <span className="sr-only">
                  {`This product has an overall rating of ${reviewRating} out of ${MAX_PRODUCT_RATING} and a total rating of ${reviewCount}`}
                </span>
              </span>
            )}
          </CardContent>
        </Card>
      </article>
    </Link>
  );
});
