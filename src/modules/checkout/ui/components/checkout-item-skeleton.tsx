import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const CheckoutItemSkeleton = ({
  isLast,
  isFirst,
}: {
  isLast: boolean;
  isFirst: boolean;
}) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "grid grid-cols-[6rem_1fr_auto] sm:grid-cols-[7.5rem_1fr_auto] md:grid-cols-[8.5rem_1fr_auto] xl:grid-cols-[10rem_1fr_auto] gap-2 sm:gap-4 pr-2 sm:pr-4 border-t border-l border-r overflow-x-auto bg-white",
        {
          "border-b rounded-b-md": isLast,
          "rounded-t-md": isFirst,
        }
      )}
    >
      <div className="overflow-hidden border-r">
        <AspectRatio ratio={1} className="relative">
          <Skeleton className="bg-skeleton size-full" />
        </AspectRatio>
      </div>

      <div className="py-2 sm:py-4 flex flex-col justfiy-between">
        <div className="flex flex-col gap-1 sm:gap-2">
          <Skeleton className="bg-skeleton w-30 h-8" />
          <Skeleton className="bg-skeleton w-20 h-6" />
        </div>
      </div>

      <div className="py-2 sm:py-4 flex flex-col justify-between">
        <Skeleton className="bg-skeleton w-10 h-6 self-end" />
        <Skeleton className="bg-skeleton w-6 md:w-16 h-6 self-end" />
      </div>
    </div>
  );
};
