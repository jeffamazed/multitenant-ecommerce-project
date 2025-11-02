"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckIcon, LinkIcon, StarIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { RichText } from "@payloadcms/richtext-lexical/react";

import { formatCurrency, generateTenantURL } from "@/lib/utils";

import ProductPlaceholderLarge from "@/app/assets/img/product_placeholder_large.png";
import AvatarPlaceholderSmall from "@/app/assets/img/avatar_placeholder_small.png";
import { StarRating } from "@/components/shared/star-rating";
import { Button } from "@/components/ui/button";
import TooltipCustom from "@/components/shared/tooltip-custom";
import { Progress } from "@/components/ui/progress";
import { MAX_PRODUCT_RATING } from "@/lib/constants";

import { CartButton } from "../components/cart-button";

interface Props {
  productId: string;
  tenantSlug: string;
}

export const ProductView = ({ productId, tenantSlug }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ id: productId })
  );
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopyURL = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(window.location.href);
    toast.info("Link copied to clipboard!");

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="common-padding max-container">
      <article className="border rounded-sm bg-white overflow-hidden">
        <div className="relative border-b aspect-[1.5] md:aspect-[2] lg:aspect-[2.5] xl:aspect-[3.2]">
          <Image
            src={data.cover?.url || ProductPlaceholderLarge}
            alt={`${data.name} cover image` || "Product cover image"}
            fill
            sizes="100vw"
            className="object-cover"
            placeholder="blur"
            priority
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6">
          <div className="col-span-4">
            {/* PRODUCT'S NAME */}
            <div className="p-6 flex items-center border-b">
              <h1>{data.name}</h1>
            </div>

            <div className="flex border-b">
              {/* PRICE */}
              <div className="py-4 px-6 w-fit border-r flex-cent">
                <p className="px-4 py-2 border bg-custom-accent w-fit">
                  <span className="text-base font-medium">
                    <span className="sr-only">
                      This product has a price of{" "}
                    </span>
                    {formatCurrency(data.price)}
                  </span>
                </p>
              </div>

              {/* USER LINK */}
              <div className="py-4 px-6 flex flex-cent lg:border-r">
                <Link
                  href={generateTenantURL(tenantSlug)}
                  aria-label={`Visit tenant of ${data.tenant.name}`}
                  className="line-clamp-2 lg:max-w-[300px]"
                >
                  <Image
                    src={data.tenant.image?.url || AvatarPlaceholderSmall}
                    alt={`${data.tenant.name}'s avatar`}
                    width={20}
                    height={20}
                    className="rounded-full inline align-middle mr-2 border shrink-0 size-[20px]"
                  />
                  <span className="text-base underline font-medium">
                    {data.tenant.name}
                  </span>
                </Link>
              </div>

              {/* PRODUCT RATING DESKTOP */}
              <div className="hidden lg:flex px-6 py-4 items-center justify-center">
                <StarRating
                  rating={data.reviewRating}
                  totalRating={data.reviewCount}
                  iconClassName="size-4"
                />
              </div>
            </div>

            {/* PRODUCT RATING MOBILE */}
            <div className="flex-cent lg:hidden px-6 py-4 border-b gap-2">
              <StarRating
                rating={data.reviewRating}
                totalRating={data.reviewCount}
                iconClassName="size-4"
              />
            </div>

            <div className="p-6">
              {data.description ? (
                <RichText data={data.description} />
              ) : (
                <p className="font-medium text-muted-foreground italic">
                  No description provided.
                </p>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <div className="border-t lg:border-t-0 lg:border-l h-full">
              <div className="flex flex-col gap-4 px-6 py-4 border-b">
                <div className="flex items-center gap-2">
                  <CartButton
                    productId={productId}
                    tenantSlug={tenantSlug}
                    productName={data.name}
                    isPurchased={data.isPurchased}
                  />

                  <TooltipCustom
                    trigger={
                      <Button
                        className="size-12 bg-white"
                        variant="elevated"
                        onClick={handleCopyURL}
                        aria-label="Copy current link"
                        disabled={isCopied}
                      >
                        {isCopied ? <CheckIcon /> : <LinkIcon />}
                      </Button>
                    }
                    side="bottom"
                    content="Copy link"
                    sideOffset={10}
                  />
                </div>

                {/* REFUND POLICY */}
                {!data.isPurchased && (
                  <p className="text-center">
                    <strong className="italic">
                      {data.refundPolicy === "no-refunds"
                        ? "No refunds"
                        : `${data.refundPolicy} money back guarantee`}
                    </strong>
                  </p>
                )}
              </div>

              {/* RATINGS OVERVIEW */}
              {/* TODO: EDIT RATINGS OVERVIEW WITH REAL DATA LATER */}
              <aside className="px-6 py-4">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <h2 className="text-lg font-medium whitespace-nowrap">
                    Ratings Overview{" "}
                    <span className="sr-only">of {data.name}</span>
                  </h2>
                  <p className="flex items-center gap-2 whitespace-nowrap">
                    {data.reviewCount > 0 ? (
                      <>
                        <span
                          className="flex items-center gap-0.5"
                          aria-hidden="true"
                        >
                          <StarIcon className="size-4 fill-black mb-0.5" /> (
                          {data.reviewRating})
                        </span>
                        <span className="whitespace-nowrap" aria-hidden="true">
                          {data.reviewCount} ratings
                        </span>
                      </>
                    ) : (
                      <span className="text-sm md:text-base font-medium">
                        No ratings yet
                      </span>
                    )}

                    {/* FOR SR */}
                    {data.reviewCount > 0 ? (
                      <span className="sr-only">
                        {data.name} has an overall rating of {data.reviewRating}{" "}
                        out of {MAX_PRODUCT_RATING} stars, based on total of{" "}
                        {data.reviewCount} ratings.
                      </span>
                    ) : (
                      <span className="sr-only">No ratings yet</span>
                    )}
                  </p>
                </div>

                <dl
                  aria-label={`Rating breakdown for ${data.name}`}
                  className="w-full flex flex-col gap-4 text-base font-medium"
                >
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const ratingDist = data.ratingDistribution[stars];
                    return (
                      <div
                        key={stars}
                        className="flex justify-between items-center gap-2 w-full"
                      >
                        <dt className="whitespace-nowrap w-1/6 shrink-0 text-sm md:text-base">
                          {stars} {stars === 1 ? "star" : "stars"}
                        </dt>
                        <dd className="flex items-center gap-2 w-5/6">
                          <Progress
                            value={ratingDist}
                            className="h-[0.7lh] md:h-[1lh]"
                            aria-valuenow={ratingDist}
                            aria-label={`${stars} stars rating`}
                          />
                          <span
                            aria-hidden="true"
                            className="w-1/8 shrink-0 text-right text-sm md:text-base"
                          >
                            {ratingDist}%
                          </span>
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </aside>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
