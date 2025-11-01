"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { ReviewForm } from "./review-form";

interface Props {
  productId: string;
}

export const ReviewSidebar = ({ productId }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.reviews.getOne.queryOptions({ productId })
  );

  return (
    <aside className="p-4 bg-white rounded-md border">
      <ReviewForm productId={productId} initialData={data} />
    </aside>
  );
};
