"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ListFilterIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { CategoryDropdown } from "./categories-dropdown";
import { SearchInput } from "./search-input";
import { SearchFiltersSkeleton } from "./search-filters-skeleton";
import { CategoriesSidebar } from "./categories-sidebar";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

export function SearchFilters() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const viewAllRef = useRef<HTMLButtonElement | null>(null);
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const [visibleCount, setVisibleCount] = useState<number>(data.length);
  const [isAnyHovered, setIsAnyHovered] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => setMounted(true), []);

  // THESE ARE FOR CHECKING IF THE ACTIVE CATEGORY IS NOT VISIBLE

  const activeCategoryIndex =
    pathname === "/"
      ? 0
      : data.findIndex((cat) => pathname.startsWith(`/${cat.slug}`));

  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

  // FOR CALCULING HOW MANY FILTERS SHOULD BE VISIBLE
  useEffect(() => {
    const calculateVisible = () => {
      const container = containerRef.current;
      const measure = measureRef.current;
      const viewAll = viewAllRef.current;
      if (!container || !measure || !viewAll) return;

      const containerWidth = container.offsetWidth;

      const viewAllWidth = viewAll.offsetWidth;
      const availableWidth = containerWidth - viewAllWidth;
      const offset = 20; // offset for scrollbar

      const items = Array.from(measure.children);
      let totalWidth = 0;
      let visible = 0;

      for (const item of items) {
        const width = item.getBoundingClientRect().width;
        if (totalWidth + width + offset >= availableWidth) break;
        totalWidth += width;
        visible++;
      }
      setVisibleCount(visible);
    };

    calculateVisible();

    const resizeObserver = new ResizeObserver(calculateVisible);
    resizeObserver.observe(containerRef.current!);

    return () => resizeObserver.disconnect();
  }, [data.length]);

  return (
    <NavigationMenu
      className="flex flex-col items-start gap-4 mx-auto max-w-full"
      aria-label="Product Search Navigation"
      viewport={false}
    >
      <SearchInput isMobile={isMobile} />

      {/* INVISIBLE MEASUREMENT PLACEHOLDER */}
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none flex"
        inert={true}
      >
        {data.map((category) => (
          <Button
            className="rounded-full! text-base! h-11! px-4! py-2! has-[>svg]:px-3! whitespace-nowrap"
            key={category.createdAt}
          >
            {category.name}
            <ChevronDown />
          </Button>
        ))}
      </div>

      <div ref={containerRef} className={cn("w-full max-w-full")}>
        {!mounted && (
          <div className="hidden md:block">
            <SearchFiltersSkeleton />
          </div>
        )}

        {!isMobile && (
          <NavigationMenuList
            className={cn("flex-nowrap flex", {
              "sr-only": !mounted,
            })}
            inert={!mounted}
            onPointerEnter={() => setIsAnyHovered(true)}
            onPointerLeave={() => setIsAnyHovered(false)}
            onFocusCapture={() => setIsAnyHovered(true)}
            onBlurCapture={() => setIsAnyHovered(false)}
          >
            {/* SLICE ONLY FOR VISIBLE ITEMS */}
            {data.slice(0, visibleCount).map((category, index) => {
              return category.subcategories.length > 0 ? (
                <CategoryDropdown
                  key={category.id}
                  category={category}
                  isActive={!isAnyHovered && index === activeCategoryIndex}
                />
              ) : (
                <NavigationMenuItem asChild key={category.id}>
                  <Button
                    asChild
                    variant="elevated"
                    className={cn(
                      "rounded-full! select-none border-transparent hover:border-border bg-transparent hover:bg-white! focus-visible:bg-white! transition-all! focus-visible:ring-0! relative text-base! h-11! px-4! py-2! has-[>svg]:px-3!",
                      "data-[state=open]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] data-[state=open]:-translate-x-[4px] data-[state=open]:-translate-y-[4px] data-[state=open]:bg-white data-[state=open]:border-border",
                      !isAnyHovered &&
                        index === activeCategoryIndex &&
                        "border-border bg-white"
                    )}
                  >
                    <Link href={category.slug}>{category.name}</Link>
                  </Button>
                </NavigationMenuItem>
              );
            })}

            {/* VIEW ALL BUTTON */}
            <li className="shrink-0">
              <CategoriesSidebar
                trigger={
                  <Button
                    ref={viewAllRef}
                    variant="elevated"
                    className={cn(
                      "rounded-full! select-none border-transparent hover:border-border bg-transparent hover:bg-white! focus-visible:bg-white! transition-all! focus-visible:ring-0! relative",
                      {
                        "bg-white border-border":
                          isActiveCategoryHidden && !isAnyHovered,
                      }
                    )}
                    aria-label="View all category filters"
                  >
                    View all
                    <ListFilterIcon />
                  </Button>
                }
                open={isSidebarOpen}
                onOpenChange={setIsSidebarOpen}
              />
            </li>
          </NavigationMenuList>
        )}
      </div>
    </NavigationMenu>
  );
}
