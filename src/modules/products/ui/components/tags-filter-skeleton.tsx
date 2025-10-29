import { Skeleton } from "@/components/ui/skeleton";

export const TagsFilterSkeleton = () => {
  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2 items-center">
        <Skeleton className="bg-skeleton size-4.5" />
        <Skeleton className="bg-skeleton w-full h-4.5" />
      </div>
      <div className="flex gap-2 items-center">
        <Skeleton className="bg-skeleton size-4.5" />
        <Skeleton className="bg-skeleton w-full h-4.5" />
      </div>
      <div className="flex gap-2 items-center">
        <Skeleton className="bg-skeleton size-4.5" />
        <Skeleton className="bg-skeleton w-full h-4.5" />
      </div>
    </div>
  );
};
