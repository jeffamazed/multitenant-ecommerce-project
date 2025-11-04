import type { SearchParams } from "nuqs/server";
import type { Metadata } from "next";

import { trpc, getQueryClient } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { DEFAULT_LIMIT_INFINITE_LOAD } from "@/lib/constants";
import { Suspense } from "react";
import { SearchFilters } from "@/modules/home/ui/components/search-filters/search-filters";
import { SearchSectionSkeleton } from "@/modules/home/ui/components/search-filters/search-section-skeleton";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Explore products and categories on Monavo, a multitenant e-commerce platform for discovering top items and new collections.",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const HomePage = async ({ searchParams }: Props) => {
  const queryClient = getQueryClient();
  const filters = await loadProductFilters(searchParams);

  // Using void
  void Promise.all([
    queryClient.prefetchQuery(trpc.categories.getMany.queryOptions()),
    queryClient.prefetchInfiniteQuery(
      trpc.products.getMany.infiniteQueryOptions({
        ...filters,
        limit: DEFAULT_LIMIT_INFINITE_LOAD,
      })
    ),
    queryClient.prefetchQuery(trpc.auth.session.queryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<SearchSectionSkeleton />}>
        <SearchFilters />
      </Suspense>
      <ProductListView />
    </HydrationBoundary>
  );
};

export default HomePage;
