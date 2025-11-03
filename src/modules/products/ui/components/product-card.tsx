"use client";

import Link from "next/link";
import React, { memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SparklesIcon, StarIcon } from "lucide-react";

import {
  cn,
  determineIsProductNew,
  formatCurrency,
  generateTenantURL,
} from "@/lib/utils";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

import ProductPlaceholderMedium from "@/app/assets/img/product_placeholder_medium.png";
import AvatarPlaceholderSmall from "@/app/assets/img/avatar_placeholder_small.png";
import {
  MAX_PRODUCT_RATING,
  NEW_PRODUCT_DAYS_THRESHOLD,
} from "@/lib/constants";

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl?: string | null;
  tenantSlug: string;
  tenantImageUrl: string | null | undefined;
  reviewRating: number;
  reviewCount: number;
  price: number;
  createdAt: string;
}

export const ProductCard = memo(function ProductCard({
  id,
  name,
  imageUrl,
  tenantSlug,
  tenantImageUrl,
  reviewRating,
  reviewCount,
  price,
  createdAt,
}: ProductCardProps) {
  const router = useRouter();

  const handleUserNavigation = (
    e: React.MouseEvent<HTMLSpanElement> | React.KeyboardEvent<HTMLSpanElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(generateTenantURL(tenantSlug));
  };

  return (
    <Link
      href={`${generateTenantURL(tenantSlug)}/products/${id}`}
      className={cn(
        "border rounded-md bg-white overflow-hidden block h-full",
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
              {determineIsProductNew(createdAt, NEW_PRODUCT_DAYS_THRESHOLD) && (
                <span
                  aria-hidden="true"
                  className="absolute top-2 right-2 text-sm bg-radial from-yellow-100 from-40% to-yellow-200 p-1 rounded-md border border-yellow-400"
                >
                  New <SparklesIcon className="inline size-4.5" />
                </span>
              )}
            </AspectRatio>
            <CardTitle className="flex py-2 px-4 h-16 overflow-ellipsis">
              <h3 className="text-lg font-medium line-clamp-2 leading-tight">
                {name}
              </h3>
            </CardTitle>
          </CardHeader>

          <CardContent className="px-4 border-b pb-2">
            <Button
              asChild
              variant="customLink"
              tabIndex={0}
              onClick={handleUserNavigation}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleUserNavigation(e);
              }}
              role="link"
            >
              <span>
                <Image
                  alt={`${tenantSlug}'s avatar`}
                  src={tenantImageUrl || AvatarPlaceholderSmall}
                  width={16}
                  height={16}
                  className="rounded-full border shrink-0 size-4"
                />
                <span className="text-sm font-medium whitespace-normal line-clamp-1">
                  <span className="sr-only">Visit tenant of </span>
                  {tenantSlug}
                </span>
              </span>
            </Button>

            <span className="flex items-center gap-0.5 mt-1 w-fit">
              {reviewCount > 0 ? (
                <>
                  <StarIcon className="size-3.5 fill-black" />
                  <span className="text-sm font-medium" aria-hidden="true">
                    {reviewRating} ({reviewCount})
                  </span>
                  {/* FOR SR USERS */}
                  <span className="sr-only">
                    {`This product has an overall rating of ${reviewRating} out of ${MAX_PRODUCT_RATING} and a total ratings of ${reviewCount}.`}
                  </span>
                </>
              ) : (
                <span className="text-sm">No reviews yet</span>
              )}
            </span>
          </CardContent>

          <CardFooter className="px-4 py-2">
            <p className="px-2 py-1 border bg-custom-accent w-fit">
              <span className="text-sm font-medium">
                <span className="sr-only">This product has a price of </span>
                {formatCurrency(price)}
              </span>
            </p>
          </CardFooter>
        </Card>
      </article>
    </Link>
  );
});
