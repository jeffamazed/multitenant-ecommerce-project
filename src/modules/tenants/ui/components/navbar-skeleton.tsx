import { Skeleton } from "@/components/ui/skeleton";

export const NavbarSkeleton = () => {
  return (
    <div className="border-b sticky top-0 left-0 bg-white z-50 w-full h-18">
      <div className="common-padding-x max-container-sm size-full flex items-center overflow-x-auto">
        <div className="flex items-center gap-2">
          <Skeleton className="bg-skeleton size-[32px] shrink-0 rounded-full" />
          <Skeleton className="bg-skeleton w-32 h-8" />
        </div>
      </div>
    </div>
  );
};
