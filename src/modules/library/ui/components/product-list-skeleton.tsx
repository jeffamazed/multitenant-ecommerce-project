import { DEFAULT_LIMIT_INFINITE_LOAD } from "@/lib/constants";
import { ProductCardSkeleton } from "./product-card-skeleton";

export const ProductListSkeleton = () => {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
      aria-hidden="true"
    >
      {Array.from({ length: DEFAULT_LIMIT_INFINITE_LOAD }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
