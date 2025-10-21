import { useEffect, useState } from "react";
import { ListFilterIcon, SearchIcon } from "lucide-react";

import { CustomCategory } from "../types";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategoriesSidebar } from "./categories-sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TooltipCustom from "@/components/shared/TooltipCustom";

interface Props {
  disabled?: boolean;
  data: CustomCategory[];
  isMobile: boolean;
}

export const SearchInput = ({ disabled, data, isMobile }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), []);

  return (
    // TODO: CHANGE TO FORM IF IT HAS ANY ACTION
    <div className="flex items-center gap-2 w-full max-w-3xl mx-auto">
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
        <Label htmlFor="homepage-search" className="sr-only">
          Search products
        </Label>
        <Input
          id="homepage-search"
          type="search"
          className="pl-8"
          placeholder="Search Products"
          disabled={disabled}
        />
      </div>
      {!mounted && (
        <Skeleton className="size-12 shrink-0 rounded-md bg-skeleton" />
      )}
      {isMobile && (
        <CategoriesSidebar
          trigger={
            <TooltipCustom
              trigger={
                <Button
                  variant="elevated"
                  className={cn(
                    "select-none transition-all! focus-visible:ring-0! relative size-12 shrink-0 border-border bg-white"
                  )}
                  aria-label="View all category filters"
                >
                  <ListFilterIcon />
                </Button>
              }
              content="View all"
              side="bottom"
              sideOffset={10}
            />
          }
          open={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
          data={data}
        />
      )}
      {/* TODO: ADD LIBRARY BUTTON */}
    </div>
  );
};
