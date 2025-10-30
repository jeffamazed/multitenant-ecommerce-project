import { ChevronLeftIcon, ChevronRightIcon, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { CategoriesGetManyOutput } from "@/modules/categories/types";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import TooltipCustom from "@/components/shared/TooltipCustom";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
}

export const CategoriesSidebar = ({ open, onOpenChange, trigger }: Props) => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.categories.getMany.queryOptions());

  const [parentCategories, setParentCategories] =
    useState<CategoriesGetManyOutput | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    CategoriesGetManyOutput[1] | null
  >(null);

  const pathname = usePathname();

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setSelectedCategory(null);
      setParentCategories(null);
      onOpenChange(open);
    },
    [onOpenChange]
  );

  // auto closing when not changing ismobile
  const isMobile = useIsMobile();
  useEffect(() => {
    handleOpenChange(false);
  }, [isMobile, handleOpenChange]);

  // FOCUS BACK BUTTON
  const backButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (parentCategories) backButtonRef.current?.focus();
    else closeButtonRef.current?.focus();
  }, [parentCategories]);

  // if we have parent categories, show those, otherwise show root categories
  const currentCategories = parentCategories ?? data ?? [];

  const handleCategoryClick = (category: CategoriesGetManyOutput[1]) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CategoriesGetManyOutput);
      setSelectedCategory(category);
    }
  };

  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategory(null);
    }
  };

  const backgroundColor = selectedCategory?.color || "#fff";

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <TooltipCustom
        trigger={<SheetTrigger asChild>{trigger}</SheetTrigger>}
        content="View all"
        side="bottom"
        sideOffset={10}
        className="md:hidden"
      />

      <SheetContent
        side="left"
        className="p-0 gap-0 transition-colors duration-75"
        style={{ backgroundColor }}
        role="navigation"
      >
        <SheetHeader className="px-6 border-b h-18 shrink-0 flex-cent relative">
          <SheetTitle className="text-xl w-full">Categories</SheetTitle>

          <SheetClose
            asChild
            className="absolute right-6 border-transparent bg-white size-12"
          >
            <Button
              ref={closeButtonRef}
              variant="ghost"
              className="hover:bg-transparent focus-visible:bg-transparent bg-transparent"
            >
              <X className="size-6" />
              <span className="sr-only">Close category sidebar</span>
            </Button>
          </SheetClose>

          <SheetDescription className="sr-only">
            This is the complete list of product search filter
          </SheetDescription>
        </SheetHeader>

        <div
          className="flex flex-col overflow-y-auto h-full"
          aria-label={
            parentCategories
              ? `Subcategories under ${selectedCategory?.name}`
              : "Root categories"
          }
        >
          {/* FOR SR USER */}
          <p className="sr-only" aria-live="polite">
            {parentCategories
              ? `Showing subcategories for ${selectedCategory?.name}`
              : "Showing all categories"}
          </p>

          {parentCategories && (
            <button
              ref={backButtonRef}
              type="button"
              onClick={handleBackClick}
              className="w-full text-left px-6 py-4 hover:bg-black hover:text-white flex items-center text-base font-medium focus-visible:bg-black focus-visible:text-white"
              aria-label={`Go back to main categories`}
            >
              <ChevronLeftIcon className="size-4 mr-2" />
              Back
            </button>
          )}

          <ul className="w-full">
            {/* TOP LEVEL PARENT CATEGORY */}
            {selectedCategory && (
              <li key={selectedCategory.slug} className="w-full">
                <Link
                  href={`/${selectedCategory.slug}`}
                  onClick={() => handleOpenChange(false)}
                  aria-current={
                    pathname === `/${selectedCategory.slug}`
                      ? "page"
                      : undefined
                  }
                  className={cn(
                    "w-full text-left px-6 py-4 hover:bg-black hover:text-white flex items-center gap-2 text-base font-bold focus-visible:bg-black focus-visible:text-white underline",
                    pathname === `/${selectedCategory.slug}` &&
                      "bg-black text-white"
                  )}
                >
                  {selectedCategory.name}
                  <Sparkles className="size-4" />
                </Link>
              </li>
            )}

            {/* CATEGORIES TO DISPLAY WHETHER IT'S A CATEGORY OR SUBCATEGORY */}
            {currentCategories.map((category) => {
              const hasSubCategory = category.subcategories?.length > 0;

              const href =
                parentCategories && selectedCategory
                  ? `/${selectedCategory.slug}/${category.slug}`
                  : category.slug === "all"
                    ? "/"
                    : `/${category.slug}`;

              const isActive =
                pathname === href || pathname.startsWith(`${href}/`);

              return category.subcategories && hasSubCategory ? (
                <li key={category.slug} className="w-full">
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className={cn(
                      "w-full text-left px-6 py-4 hover:bg-black hover:text-white flex items-center justify-between text-base font-medium focus-visible:bg-black focus-visible:text-white",
                      isActive && "bg-black text-white"
                    )}
                    // ARIA
                    aria-haspopup="true"
                    aria-expanded={selectedCategory?.slug === category.slug}
                    aria-label={`View subcategories under ${category.name}`}
                  >
                    {category.name}
                    {category.subcategories && hasSubCategory && (
                      <ChevronRightIcon className="size-4" />
                    )}
                  </button>
                </li>
              ) : (
                <li key={category.slug} className="w-full">
                  <Link
                    href={href}
                    onClick={() => handleOpenChange(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "w-full text-left px-6 py-4 hover:bg-black hover:text-white flex items-center justify-between text-base font-medium focus-visible:bg-black focus-visible:text-white",
                      isActive && "bg-black text-white"
                    )}
                  >
                    {category.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
};
