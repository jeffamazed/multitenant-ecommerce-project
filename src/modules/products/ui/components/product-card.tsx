"use client";

import Link from "next/link";
import React, { memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { StarIcon } from "lucide-react";

import { cn, generateTenantURL } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

import ProductPlaceholder from "@/app/assets/img/product_placeholder.png";
import AvatarPlaceholderSmall from "@/app/assets/img/avatar_placeholder_small.png";

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl?: string | null;
  tenantSlug: string;
  tenantImageUrl: string | null | undefined;
  reviewRating: number;
  reviewCount: number;
  price: number;
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
      href={`/products/${id}`}
      className={cn(
        "border rounded-md bg-white overflow-hidden",
        "custom-shadcn-button-product"
      )}
      aria-label={`View product page of ${name}`}
    >
      <article>
        <Card className="border-none p-0 gap-0">
          <CardHeader className="p-0 gap-0">
            <AspectRatio className="relative w-full border-b" ratio={1}>
              <Image
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={imageUrl || ProductPlaceholder}
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
                  className="rounded-full border shrink-0 size-[16px]"
                />
                <span className="text-sm font-medium">
                  <span className="sr-only">View profile page of </span>
                  {tenantSlug}
                </span>
              </span>
            </Button>

            {reviewCount > 0 && (
              <span className="flex items-center gap-0.5 mt-1 w-fit">
                <StarIcon className="size-3.5 fill-black" />
                <span className="text-sm font-medium" aria-hidden="true">
                  {reviewRating} ({reviewCount})
                </span>
                {/* FOR SR USERS */}
                <span className="sr-only">
                  {`This product has ${reviewCount} reviews and a rating of ${reviewRating} out of 5.`}
                </span>
              </span>
            )}
          </CardContent>

          <CardFooter className="px-4 py-2">
            <span className="relative px-2 py-1 border bg-custom-accent w-fit">
              <span className="text-sm font-medium">
                <span className="sr-only">This product has a price of </span>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(Number(price))}
              </span>
            </span>
          </CardFooter>
        </Card>
      </article>
    </Link>
  );
});
