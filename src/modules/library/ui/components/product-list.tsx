"use client";

import { useEffect, useRef } from "react";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { DEFAULT_LIMIT_INFINITE_LOAD } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

import { ProductCardSkeleton } from "./product-card-skeleton";
import { ProductCard } from "./product-card";

export const ProductList = () => {
  const loadMoreBtnRef = useRef<null | HTMLButtonElement>(null);
  const trpc = useTRPC();
  const { data, hasNextPage, isFetchingNextPage, isLoading, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.library.getMany.infiniteQueryOptions(
        {
          limit: DEFAULT_LIMIT_INFINITE_LOAD,
        },
        {
          getNextPageParam: (lastPage) => {
            return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
          },
        }
      )
    );

  // move focus back to loadmorebtn
  useEffect(() => {
    if (!isFetchingNextPage) {
      loadMoreBtnRef.current?.focus();
    }
  }, [isFetchingNextPage]);

  const pages = data?.pages.flatMap((page) => page.docs) ?? [];
  const skeletons = Array.from(
    { length: DEFAULT_LIMIT_INFINITE_LOAD },
    (_, i) => <ProductCardSkeleton key={i} />
  );

  if (pages.length === 0) {
    return (
      <EmptyPlaceholder
        Heading="h3"
        headingContent="It's empty here..."
        content="No products found"
      />
    );
  }

  return (
    <>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading
          ? skeletons
          : pages.map((p) => (
              <li key={p.id} className="block">
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  imageUrl={p.image?.url}
                  tenantSlug={p.tenant.slug}
                  tenantImageUrl={p.tenant.image?.url}
                  reviewRating={p.reviewRating}
                  reviewCount={p.reviewCount}
                />
              </li>
            ))}

        {/* LOADER FETCHING NEXT PAGE */}
        {isFetchingNextPage && skeletons}
      </ul>
      <div className="w-full flex-cent">
        {hasNextPage && (
          <Button
            type="button"
            ref={loadMoreBtnRef}
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            variant="elevated"
            className="text-sm mt-8"
          >
            {isFetchingNextPage
              ? "Loading more products..."
              : "Load more products"}
          </Button>
        )}
      </div>
    </>
  );
};
