import { Suspense } from "react";

import { ProductFilters } from "../components/product-filters";
import { ProductList } from "../components/product-list";
import { ProductSort } from "../components/product-sort";
import { ProductListSkeleton } from "../components/product-list-skeleton";

interface Props {
  category?: string;
}

export const ProductListView = ({ category }: Props) => {
  return (
    <section className="max-container common-padding">
      <div className="flex items-center justify-between col-span-full common-margin-bottom flex-wrap common-gap">
        <h2 className="text-2xl font-medium whitespace-nowrap">
          Curated For You
        </h2>
        <ProductSort />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 common-gap">
        <div className="lg:col-span-2 xl:col-span-2">
          <ProductFilters />
        </div>
        <div className="lg:col-span-4 xl:col-span-6">
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList category={category} />
          </Suspense>
        </div>
      </div>
    </section>
  );
};
