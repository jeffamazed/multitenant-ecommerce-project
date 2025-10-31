"use client";

import Image from "next/image";
import Link from "next/link";
import { LinkIcon, StarIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

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
              <div className="py-4 px-6 w-fit border-r">
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
                <StarRating rating={4} totalRating={5} iconClassName="size-4" />
              </div>
            </div>

            {/* PRODUCT RATING MOBILE */}
            <div className="flex-cent lg:hidden px-6 py-4 border-b gap-2">
              <StarRating rating={4} totalRating={5} iconClassName="size-4" />
            </div>

            <div className="p-6">
              {data.description ? (
                <p>{data.description}</p>
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
                  <CartButton productId={productId} tenantSlug={tenantSlug} />

                  <TooltipCustom
                    trigger={
                      <Button
                        className="size-12 bg-white"
                        variant="elevated"
                        onClick={() => {}}
                        disabled={false}
                        aria-label="Copy current URL"
                      >
                        <LinkIcon />
                      </Button>
                    }
                    side="bottom"
                    content="Copy URL"
                    sideOffset={10}
                  />
                </div>

                {/* REFUND POLICY */}
                <p className="text-center">
                  <strong className="italic">
                    {data.refundPolicy === "no-refunds"
                      ? "No refunds"
                      : `${data.refundPolicy} money back guarantee`}
                  </strong>
                </p>
              </div>

              {/* RATINGS OVERVIEW */}
              {/* TODO: EDIT RATINGS OVERVIEW WITH REAL DATA LATER */}
              <aside className="px-6 py-4">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <h2 className="text-xl font-medium">
                    Ratings Overview{" "}
                    <span className="sr-only">of {data.name}</span>
                  </h2>
                  <span className="flex items-center gap-2 flex-wrap">
                    <span
                      className="flex items-center gap-0.5"
                      aria-hidden="true"
                    >
                      <StarIcon className="size-4 fill-black mb-0.5" /> ({5})
                    </span>
                    <span className="whitespace-nowrap" aria-hidden="true">
                      5 ratings
                    </span>
                    {/* FOR SR */}
                    <p className="sr-only">
                      {data.name} has an overall rating of {5} out of{" "}
                      {MAX_PRODUCT_RATING} stars, based on total of {5} ratings.
                    </p>
                  </span>
                </div>

                <dl
                  aria-label={`Rating breakdown for ${data.name}`}
                  className="w-full flex flex-col gap-4 text-base font-medium"
                >
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div
                      key={stars}
                      className="flex justify-between items-center gap-2 w-full"
                    >
                      <dt className="whitespace-nowrap w-1/4 shrink-0">
                        {stars} {stars === 1 ? "star" : "stars"}
                      </dt>
                      <dd className="w-full flex items-center gap-2">
                        <Progress
                          value={5}
                          className="h-[1lh]"
                          aria-hidden="true"
                        />
                        <span aria-hidden="true">{0}%</span>

                        {/* FOR SR */}
                        <span className="sr-only">
                          {stars} star ratings make up {0}% of total ratings.
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </aside>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
