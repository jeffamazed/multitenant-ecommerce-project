import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { ProductView } from "@/modules/products/ui/views/product-view";
import { ProductViewSkeleton } from "@/modules/products/ui/components/product-view-skeleton";
import { TRPCError } from "@trpc/server";

interface Props {
  params: Promise<{ productId: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId, slug } = await params;
  const queryClient = getQueryClient();

  const product = await queryClient.fetchQuery(
    trpc.products.getMeta.queryOptions({ id: productId })
  );
  const tenant = await queryClient.fetchQuery(
    trpc.tenants.getMeta.queryOptions({ slug })
  );

  return {
    title: `${tenant.name} | ${product.name}`,
    description: `Explore "${product.name}" from ${tenant.name}. Check details, read reviews, and discover related products.`,
  };
}

const ProductPage = async ({ params }: Props) => {
  const { productId, slug } = await params;

  const queryClient = getQueryClient();

  try {
    await queryClient.fetchQuery(
      trpc.products.getOne.queryOptions({ id: productId })
    );
  } catch (err: TRPCError | unknown) {
    if (err instanceof TRPCError) {
      if (err.code === "NOT_FOUND") {
        notFound();
      }
    }

    throw err;
  }

  // Prefetch tenant
  void queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({ slug }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView productId={productId} tenantSlug={slug} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default ProductPage;
