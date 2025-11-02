import { useState } from "react";
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategoriesSidebar } from "./categories-sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/use-auth";
import Link from "next/link";
import TooltipCustom from "@/components/shared/tooltip-custom";

interface Props {
  disabled?: boolean;
  isMobile: boolean;
}

export const SearchInput = ({ disabled, isMobile }: Props) => {
  const session = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

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

      {isMobile && (
        <CategoriesSidebar
          trigger={
            <Button
              variant="elevated"
              className={cn(
                "select-none transition-all! size-12 shrink-0 bg-white"
              )}
              aria-label="View all category filters"
            >
              <ListFilterIcon />
            </Button>
          }
          open={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
        />
      )}

      {/* LIBRARY LINK */}
      {session?.data?.user && (
        <TooltipCustom
          trigger={
            <Button
              variant="elevated"
              className="select-none bg-white h-12 min-w-12 shrink-0"
              asChild
            >
              <Link prefetch href="/library">
                <BookmarkCheckIcon className="size-4.5" />
                <span className="max-md:sr-only">
                  <span className="sr-only">Visit</span>
                  Library
                </span>
              </Link>
            </Button>
          }
          content="Library"
          side="bottom"
          sideOffset={10}
          className="md:hidden"
        />
      )}
    </div>
  );
};
