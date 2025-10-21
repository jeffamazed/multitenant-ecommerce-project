import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchIcon } from "lucide-react";

export const SearchInputSkeleton = () => {
  return (
    <>
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
    </>
  );
};
