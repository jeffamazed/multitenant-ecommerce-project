import Link from "next/link";
import { memo } from "react";
import Image from "next/image";
import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

import PlaceholderImage from "@/app/assets/img/plageholder.png";

interface ProductCardProps {
  id: string;
  name: string;
  imageUrl?: string | null;
  authorUsername: string;
  authorImageUrl: string | null;
  reviewRating: number;
  reviewCount: number;
  price: number;
}

export const ProductCard = memo(function ProductCard({
  id,
  name,
  imageUrl,
  authorUsername,
  authorImageUrl,
  reviewRating,
  reviewCount,
  price,
}: ProductCardProps) {
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
                src={imageUrl || PlaceholderImage}
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
          {/* TODO: REDIRECT TO USER SHOP */}
          <CardContent className="px-4 border-b pb-2">
            <Button
              asChild
              variant="customLink"
              tabIndex={0}
              onClick={() => {}}
            >
              <span>
                {authorImageUrl && (
                  <Image
                    alt={`${authorUsername}'s avatar`}
                    src={authorImageUrl}
                    width={16}
                    height={16}
                    className="rounded-full border shrink-0 size-[16px]"
                  />
                )}
                <span className="text-sm font-medium">
                  <span className="sr-only">View profile page of </span>
                  {authorUsername}
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
