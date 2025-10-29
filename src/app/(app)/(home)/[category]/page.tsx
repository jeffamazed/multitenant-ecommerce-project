import { Suspense } from "react";

import { trpc, getQueryClient } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { ProductList } from "@/modules/products/ui/components/product-list";
import { ProductListSkeleton } from "@/modules/products/ui/components/product-list-skeleton";
import { ProductFilters } from "@/modules/products/ui/components/product-filters";

import { headingCategoryFormat } from "@/lib/utils";

interface Props {
  params: Promise<{ category: string }>;
}

const CategoryPage = async ({ params }: Props) => {
  const { category } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="common-padding max-container grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-10">
        <div className="lg:col-span-2 xl:col-span-2">
          <ProductFilters />
        </div>
        <section className="lg:col-span-4 xl:col-span-6 chk">
          <h2 className="sr-only">{`Product List of Category ${headingCategoryFormat(category)}`}</h2>
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList category={category} />
          </Suspense>
        </section>
      </div>
    </HydrationBoundary>
  );
};

export default CategoryPage;
