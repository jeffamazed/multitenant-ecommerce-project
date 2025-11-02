import { Skeleton } from "@/components/ui/skeleton";

import { ReviewSidebarSkeleton } from "./review-sidebar-skeleton";

export const ProductViewSkeleton = () => {
  return (
    <div className="flex flex-col min-h-dvh" aria-hidden="true">
      <div className="border-b sticky top-0 left-0 bg-custom-accent z-50 w-full h-18">
        <div className="common-padding-x max-container size-full flex justify-between items-center overflow-x-auto gap-4">
          <Skeleton className="bg-skeleton h-12 w-32" />
        </div>
      </div>
      <div className="flex-1 bg-zinc-100">
        <div className="bg-custom-accent-secondary border-b">
          <div className="common-padding max-container">
            <Skeleton className="bg-skeleton h-8 md:h-9 lg:h-10 w-60" />
          </div>
        </div>

        <div className="common-padding max-container">
          <Skeleton className="bg-skeleton h-10 w-50 common-margin-bottom" />
          <div className="common-grid-setup">
            <div className="md:col-span-4 lg:col-span-3">
              <ReviewSidebarSkeleton />
            </div>

            <div className="md:col-span-6 lg:col-span-7 space-y-2">
              <Skeleton className="bg-skeleton h-6 w-full" />
              <Skeleton className="bg-skeleton h-6 w-full" />
              <Skeleton className="bg-skeleton h-6 w-full" />
              <Skeleton className="bg-skeleton h-6 w-full" />
              <Skeleton className="bg-skeleton h-6 w-full" />
              <Skeleton className="bg-skeleton h-6 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
