"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

interface Props {
  category?: string;
}

export const ProductList = ({ category }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({ category })
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {data?.docs.map((p) => (
        <article key={p.id} className="border rounded-md bg-white p-4">
          <h3 className="text-xl font-medium">{p.name}</h3>
          <p>${p.price}</p>
        </article>
      ))}
    </div>
  );
};
