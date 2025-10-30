import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_BG_COLOR } from "@/modules/home/constants";

export const SearchSectionSkeleton = () => {
  return (
    <div
      className="flex-cent border-b"
      style={{ backgroundColor: DEFAULT_BG_COLOR }}
    >
      <div className="max-container common-padding">
        <h1 className="text-center text-2xl md:text-3xl mb-6 lg:mb-8 font-semibold">
          One Platform. Every Store. Seamlessly.
        </h1>
        <div className="flex items-center gap-2 w-full max-w-3xl mx-auto">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
            <Input
              id="homepage-search"
              type="search"
              className="pl-8"
              placeholder="Search Products"
              readOnly
              disabled
            />
          </div>
          <Skeleton className="size-12 rounded-md bg-skeleton md:hidden shrink-0" />
        </div>
        {/* for filling gap */}
        <div className="h-4 opacity-0 md:hidden"></div>
        <div className="h-12 w-full opacity-0 mt-4 max-md:hidden"></div>
      </div>
    </div>
  );
};
