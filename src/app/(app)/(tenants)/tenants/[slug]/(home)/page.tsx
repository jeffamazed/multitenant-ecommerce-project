import { SearchParams } from "nuqs";
import { Metadata } from "next";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import { DEFAULT_LIMIT_INFINITE_LOAD } from "@/lib/constants";

import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { loadProductFilters } from "@/modules/products/search-params";

interface Props {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const queryClient = getQueryClient();

  const tenant = await queryClient.fetchQuery(
    trpc.tenants.getMeta.queryOptions({ slug })
  );

  return {
    title: `${tenant.name}`,
    description: `Explore products from ${tenant.name}. Browse their collection, discover top items, and find what you need.`,
  };
}

const TenantPage = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      tenantSlug: slug,
      limit: DEFAULT_LIMIT_INFINITE_LOAD,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView tenantSlug={slug} />
    </HydrationBoundary>
  );
};

export default TenantPage;
