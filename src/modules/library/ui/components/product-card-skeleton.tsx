import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductCardSkeleton = () => {
  return (
    <Card className="border-none p-0 gap-0 rounded-md">
      <CardHeader className="p-0 gap-0">
        <AspectRatio className="relative w-full" ratio={1}>
          <Skeleton className="size-full bg-skeleton rounded-b-none" />
        </AspectRatio>
        <CardTitle className="flex py-2 px-4 h-16 overflow-ellipsis">
          <Skeleton className="bg-skeleton size-full" />
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 flex flex-col gap-1 pb-2">
        <Skeleton className="bg-skeleton w-20 h-5" />
        <Skeleton className="bg-skeleton w-14 h-5" />
      </CardContent>
    </Card>
  );
};
