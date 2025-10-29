import { Suspense } from "react";

import { trpc, getQueryClient } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { ProductList } from "@/modules/products/ui/components/product-list";
import { ProductListSkeleton } from "@/modules/products/ui/components/product-list-skeleton";

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
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList category={category} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default CategoryPage;
