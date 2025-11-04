import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { Metadata } from "next";

import { trpc, getQueryClient } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { DEFAULT_LIMIT_INFINITE_LOAD } from "@/lib/constants";
import { SearchFilters } from "@/modules/home/ui/components/search-filters/search-filters";
import { SearchSectionSkeleton } from "@/modules/home/ui/components/search-filters/search-section-skeleton";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;

  const queryClient = getQueryClient();

  const cat = await queryClient.fetchQuery(
    trpc.categories.getMeta.queryOptions({ name: category })
  );

  return {
    title: `${cat}`,
    description: `Explore top products in the ${cat} category on Monavo. Browse, compare, and discover curated collections from multiple independent stores.`,
  };
}

const CategoryPage = async ({ params, searchParams }: Props) => {
  const { category } = await params;
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  void Promise.all([
    queryClient.prefetchInfiniteQuery(
      trpc.products.getMany.infiniteQueryOptions({
        category,
        ...filters,
        limit: DEFAULT_LIMIT_INFINITE_LOAD,
      })
    ),
    queryClient.prefetchQuery(trpc.categories.getMany.queryOptions()),
    queryClient.prefetchQuery(trpc.auth.session.queryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<SearchSectionSkeleton />}>
        <SearchFilters />
      </Suspense>
      <ProductListView category={category} />
    </HydrationBoundary>
  );
};

export default CategoryPage;
