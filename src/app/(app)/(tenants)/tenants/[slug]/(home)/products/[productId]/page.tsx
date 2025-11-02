import { Suspense } from "react";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { ProductView } from "@/modules/products/ui/views/product-view";
import { ProductViewSkeleton } from "@/modules/products/ui/components/product-view-skeleton";

interface Props {
  params: Promise<{ productId: string; slug: string }>;
}

const ProductPage = async ({ params }: Props) => {
  const { productId, slug } = await params;

  const queryClient = getQueryClient();
  void Promise.all([
    queryClient.prefetchQuery(
      trpc.tenants.getOne.queryOptions({
        slug,
      })
    ),
    queryClient.prefetchQuery(
      trpc.products.getOne.queryOptions({
        id: productId,
      })
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView productId={productId} tenantSlug={slug} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default ProductPage;
