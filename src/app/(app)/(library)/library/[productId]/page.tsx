import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { ProductView } from "@/modules/library/ui/views/product-view";

interface Props {
  params: Promise<{ productId: string }>;
}

const LibraryPage = async ({ params }: Props) => {
  const { productId } = await params;

  const queryClient = getQueryClient();

  void Promise.all([
    queryClient.prefetchQuery(
      trpc.library.getOne.queryOptions({
        productId,
      })
    ),
    queryClient.prefetchQuery(
      trpc.reviews.getOne.queryOptions({
        productId,
      })
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductView productId={productId} />
    </HydrationBoundary>
  );
};

export default LibraryPage;
