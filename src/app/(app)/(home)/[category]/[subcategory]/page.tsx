import { SearchParams } from "nuqs";
import { Suspense } from "react";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { loadProductFilters } from "@/modules/products/search-params";
import { DEFAULT_LIMIT_INFINITE_LOAD } from "@/lib/constants";
import { SearchFilters } from "@/modules/home/ui/components/search-filters/search-filters";
import { SearchSectionSkeleton } from "@/modules/home/ui/components/search-filters/search-section-skeleton";

interface Props {
  params: Promise<{
    subcategory: string;
  }>;
  searchParams: Promise<SearchParams>;
}

const SubCategoryPage = async ({ params, searchParams }: Props) => {
  const { subcategory } = await params;
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  void Promise.all([
    queryClient.prefetchInfiniteQuery(
      trpc.products.getMany.infiniteQueryOptions({
        category: subcategory,
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
      <ProductListView />
      <ProductListView category={subcategory} />
    </HydrationBoundary>
  );
};

export default SubCategoryPage;
