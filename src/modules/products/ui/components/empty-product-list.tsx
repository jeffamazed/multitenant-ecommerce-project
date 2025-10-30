import { InboxIcon } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export const EmptyProductList = () => {
  return (
    <Empty className="w-full bg-white rounded-lg! border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <InboxIcon className="size-8" />
        </EmptyMedia>
        <EmptyTitle>
          <h3 className="text-lg font-medium">It&apos;s empty here</h3>
        </EmptyTitle>
        <EmptyDescription>
          <p className="text-base font-medium text-muted-foreground">
            No products found
          </p>
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};
