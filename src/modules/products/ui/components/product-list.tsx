"use client";

import { useEffect, useRef } from "react";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { DEFAULT_LIMIT_INFINITE_LOAD } from "@/lib/constants";

import { Button } from "@/components/ui/button";

import { useProductsFilters } from "../../hooks/use-product-filter";
import { ProductCard } from "./product-card";
import { EmptyProductList } from "./empty-product-list";
import { ProductCardSkeleton } from "./product-card-skeleton";

interface Props {
  category?: string;
}

export const ProductList = ({ category }: Props) => {
  const loadMoreBtnRef = useRef<null | HTMLButtonElement>(null);
  const [filters] = useProductsFilters();
  const trpc = useTRPC();
  const { data, hasNextPage, isFetchingNextPage, isLoading, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.products.getMany.infiniteQueryOptions(
        { category, ...filters, limit: DEFAULT_LIMIT_INFINITE_LOAD },
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
    return <EmptyProductList />;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading
          ? skeletons
          : pages.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                imageUrl={p.image?.url}
                authorUsername="jeffamazed"
                authorImageUrl={null}
                reviewRating={3}
                reviewCount={5}
                price={p.price}
              />
            ))}

        {/* LOADER FETCHING NEXT PAGE */}
        {isFetchingNextPage && skeletons}
      </div>
      <div className="w-full flex-cent mt-8">
        {hasNextPage && (
          <Button
            type="button"
            ref={loadMoreBtnRef}
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            variant="elevated"
            className="text-sm"
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
