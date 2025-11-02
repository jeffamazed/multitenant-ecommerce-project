import { Skeleton } from "@/components/ui/skeleton";

export const ProductViewSkeleton = () => {
  return (
    <div className="common-padding max-container" aria-hidden="true">
      <div className="border rounded-sm bg-white overflow-hidden">
        <div className="relative border-b aspect-[1.5] md:aspect-[2] lg:aspect-[2.5] xl:aspect-[3.2]">
          <Skeleton className="bg-skeleton size-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6">
          <div className="col-span-4">
            {/* PRODUCT'S NAME */}
            <div className="p-6 flex items-center border-b">
              <Skeleton className="bg-skeleton h-10 w-60" />
            </div>

            <div className="flex border-b">
              {/* PRICE */}
              <div className="py-4 px-6 w-fit border-r flex-cent">
                <Skeleton className="px-4 py-2 h-10 rounded-none bg-skeleton w-12" />
              </div>

              {/* USER LINK */}
              <div className="py-4 px-6 flex flex-cent lg:border-r">
                <span className="line-clamp-2 lg:max-w-[300px]">
                  <Skeleton className="bg-skeleton w-40 h-5" />
                </span>
              </div>

              {/* PRODUCT RATING DESKTOP */}
              <div className="hidden lg:flex px-6 py-4 items-center justify-center">
                <Skeleton className="bg-skeleton w-40 h-5" />
              </div>
            </div>

            {/* PRODUCT RATING MOBILE */}
            <div className="flex-cent lg:hidden px-6 py-4 border-b gap-2">
              <Skeleton className="bg-skeleton w-40 h-5" />
            </div>

            <div className="p-6 space-y-2">
              <Skeleton className="bg-skeleton h-5 w-full" />
              <Skeleton className="bg-skeleton h-5 w-full" />
              <Skeleton className="bg-skeleton h-5 w-full" />
              <Skeleton className="bg-skeleton h-5 w-full" />
            </div>
          </div>

          <div className="col-span-2">
            <div className="border-t lg:border-t-0 lg:border-l h-full">
              <div className="flex flex-col gap-4 px-6 py-4 border-b">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-12 flex-1 bg-skeleton" />
                  <Skeleton className="size-12 bg-skeleton" />
                </div>

                {/* REFUND POLICY */}
                <Skeleton className="bg-skeleton h-5 w-60 mx-auto" />
              </div>

              {/* RATINGS OVERVIEW */}
              {/* TODO: EDIT RATINGS OVERVIEW WITH REAL DATA LATER */}
              <div className="px-6 py-4">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <Skeleton className="bg-skeleton h-8 w-20" />
                  <Skeleton className="bg-skeleton h-5 w-20" />
                </div>

                <div className="w-full flex flex-col gap-4 text-base font-medium">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    return (
                      <div
                        key={stars}
                        className="flex justify-between items-center gap-2 w-full"
                      >
                        <div className="whitespace-nowrap w-1/6 shrink-0 text-sm md:text-base">
                          <Skeleton className="w-full h-5 bg-skeleton" />
                        </div>
                        <div className="flex items-center gap-2 w-5/6">
                          <Skeleton className="h-[0.7lh] md:h-[1lh] w-full bg-skeleton rounded-full" />
                          <Skeleton
                            aria-hidden="true"
                            className="w-1/8 shrink-0 bg-skeleton h-5"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
