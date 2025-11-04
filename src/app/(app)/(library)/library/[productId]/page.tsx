import { Metadata } from "next";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { ProductView } from "@/modules/library/ui/views/product-view";
import { Suspense } from "react";
import { ProductViewSkeleton } from "@/modules/library/ui/components/product-view-skeleton";

interface Props {
  params: Promise<{ productId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;
  const queryClient = getQueryClient();

  const product = await queryClient.fetchQuery(
    trpc.products.getMeta.queryOptions({ id: productId })
  );

  const authData = await queryClient.fetchQuery(
    trpc.auth.session.queryOptions()
  );
  const username = authData.user?.username;

  return {
    title: `Library | ${username} | ${product.name}`,
    description: `${username}'s library page showcasing "${product.name}". Explore details, reviews, and related content for this product.`,
  };
}

export const dynamic = "force-dynamic";

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
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView productId={productId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default LibraryPage;
