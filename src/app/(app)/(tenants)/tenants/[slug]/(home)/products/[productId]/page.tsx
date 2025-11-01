import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { ProductView } from "@/modules/products/ui/views/product-view";

interface Props {
  params: Promise<{ productId: string; slug: string }>;
}

const ProductPage = async ({ params }: Props) => {
  const { productId, slug } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.tenants.getOne.queryOptions({
      slug,
    })
  );
  void queryClient.prefetchQuery(
    trpc.products.getOne.queryOptions({
      id: productId,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductView productId={productId} tenantSlug={slug} />
    </HydrationBoundary>
  );
};

export default ProductPage;
