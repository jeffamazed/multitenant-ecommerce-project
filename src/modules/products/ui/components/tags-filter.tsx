import { memo, useEffect, useRef } from "react";

import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";

import { Checkbox } from "@/components/ui/checkbox";
import { DEFAULT_LIMIT_INFINITE_LOAD } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

import { TagsFilterSkeleton } from "./tags-filter-skeleton";

interface TagsFilterProps {
  value?: string[] | null;
  onChange: (value: string[]) => void;
}

export const TagsFilter = memo(function Tagsfilter({
  value,
  onChange,
}: TagsFilterProps) {
  const loadMoreBtnRef = useRef<null | HTMLButtonElement>(null);
  const trpc = useTRPC();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      trpc.tags.getMany.infiniteQueryOptions(
        {
          limit: DEFAULT_LIMIT_INFINITE_LOAD,
        },
        {
          getNextPageParam: (lastPage) => {
            return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
          },
        }
      )
    );

  const pages = data?.pages.flatMap((page) => page.docs) ?? [];

  const onClick = (tag: string) => {
    if (value?.includes(tag)) {
      onChange(value?.filter((t) => t !== tag) || []);
    } else {
      onChange([...(value || []), tag]);
    }
  };

  // move focus back to loadmorebtn
  useEffect(() => {
    if (!isFetchingNextPage) {
      loadMoreBtnRef.current?.focus();
    }
  }, [isFetchingNextPage]);

  if (pages.length === 0) {
    return (
      <EmptyPlaceholder
        Heading="h5"
        headingContent="Nothing's here..."
        content="No tags available"
      />
    );
  }

  return (
    <div className="flex flex-col" aria-label="Tags filter" role="group">
      {isLoading ? (
        <TagsFilterSkeleton />
      ) : (
        pages.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-2 cursor-pointer hover:bg-black hover:text-white rounded-xs transition-colors duration-75 py-2"
            onClick={() => onClick(tag.name)}
          >
            <Checkbox
              id={tag.id}
              checked={value?.includes(tag.name)}
              onCheckedChange={() => onClick(tag.name)}
            />
            <Label htmlFor={tag.id} className="font-medium cursor-pointer">
              {tag.name}
            </Label>
          </div>
        ))
      )}

      {/* LOADER FETCHING NEXT PAGE */}
      {isFetchingNextPage && <TagsFilterSkeleton />}
      {hasNextPage && (
        <Button
          type="button"
          ref={loadMoreBtnRef}
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          variant="customLink"
          className="text-sm text-foreground/80 mx-auto mt-2"
        >
          {isFetchingNextPage ? "Loading more..." : "Load more"}
        </Button>
      )}
    </div>
  );
});
