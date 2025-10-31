import { InboxIcon } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface Props {
  headingContent: string;
  Heading: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  content: string;
}

export const EmptyPlaceholder = ({
  content,
  Heading,
  headingContent,
}: Props) => {
  return (
    <Empty className="w-full bg-white rounded-lg! border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <InboxIcon className="size-8" />
        </EmptyMedia>
        <EmptyTitle>
          <Heading className="text-lg font-medium">{headingContent}</Heading>
        </EmptyTitle>
        <EmptyDescription>
          <p className="text-base font-medium text-muted-foreground">
            {content}
          </p>
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};
