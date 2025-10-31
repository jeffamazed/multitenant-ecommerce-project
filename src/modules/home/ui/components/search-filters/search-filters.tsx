"use client";
import { memo, useEffect, useRef, useState } from "react";
import { ChevronDown, ListFilterIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

import { CategoryDropdown } from "./categories-dropdown";
import { SearchInput } from "./search-input";
import { SearchFiltersSkeleton } from "./search-filters-skeleton";
import { CategoriesSidebar } from "./categories-sidebar";
import { BreadcrumbNavigation } from "./breadcrumb-navigation";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useIsMobile } from "@/hooks/use-mobile";
import { DEFAULT_BG_COLOR } from "@/modules/home/constants";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const SearchFilters = memo(function SearchFilters() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const viewAllRef = useRef<HTMLButtonElement | null>(null);
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const [visibleCount, setVisibleCount] = useState<number>(data.length);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => setMounted(true), []);

  // background changing
  const params = useParams();
  const categoryParam = params.category as string | undefined;
  const activeCategory = categoryParam || "all";
  const activeCategoryData = data.find((cat) => cat.slug === activeCategory);
  const activeCategoryColor = activeCategoryData?.color || DEFAULT_BG_COLOR;
  const activeCategoryName = activeCategoryData?.name || null;
  const activeSubcategory = params.subcategory as string | undefined;
  const activeSubcategoryName =
    activeCategoryData?.subcategories?.find(
      (subcat) => subcat.slug === activeSubcategory
    )?.name || null;

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
    <>
      <section
        className="flex-cent border-b"
        style={{ backgroundColor: activeCategoryColor }}
      >
        <div className="max-container common-padding">
          <h1 className="text-center text-2xl md:text-3xl mb-6 lg:mb-8 font-semibold">
            One Platform. Every Store. Seamlessly.
          </h1>

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
                  aria-hidden={!mounted}
                >
                  {/* TODO: HARDCORE `ALL` LINK LATER*/}
                  {/* SLICE ONLY FOR VISIBLE ITEMS */}
                  {data.slice(0, visibleCount).map((category, index) => {
                    return category.subcategories &&
                      category.subcategories.length > 0 ? (
                      <CategoryDropdown
                        key={category.id}
                        category={category}
                        isActive={index === activeCategoryIndex}
                      />
                    ) : (
                      <NavigationMenuItem asChild key={category.id}>
                        <Button
                          asChild
                          variant="elevated"
                          className={cn(
                            "rounded-full! select-none border-transparent hover:border-border bg-transparent hover:bg-white! focus-visible:bg-white! transition-all! focus-visible:ring-0! relative text-base! h-11! px-4! py-2! has-[>svg]:px-3!",
                            "data-[state=open]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] data-[state=open]:-translate-x-[4px] data-[state=open]:-translate-y-[4px] data-[state=open]:bg-white data-[state=open]:border-border",
                            index === activeCategoryIndex &&
                              "border-border bg-white"
                          )}
                        >
                          <Link
                            href={
                              category.slug === "all"
                                ? "/"
                                : `/${category.slug}`
                            }
                          >
                            {category.name}
                          </Link>
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
                              "bg-white border-border": isActiveCategoryHidden,
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

          {/* BREADCRUMB */}
          <BreadcrumbNavigation
            activeCategoryName={activeCategoryName}
            activeCategory={activeCategory}
            activeSubcategoryName={activeSubcategoryName}
          />
        </div>
      </section>
    </>
  );
});
