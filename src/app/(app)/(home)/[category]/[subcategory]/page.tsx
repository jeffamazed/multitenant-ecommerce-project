import { Suspense } from "react";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { ProductList } from "@/modules/products/ui/components/product-list";
import { ProductListSkeleton } from "@/modules/products/ui/components/product-list-skeleton";

interface Props {
  params: Promise<{
    subcategory: string;
  }>;
}

const SubCategoryPage = async ({ params }: Props) => {
  const { subcategory } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category: subcategory,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList category={subcategory} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default SubCategoryPage;
