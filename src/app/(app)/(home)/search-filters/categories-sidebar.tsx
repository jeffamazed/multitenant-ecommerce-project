import { ChevronLeftIcon, ChevronRightIcon, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { CustomCategory } from "../types";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  data: CustomCategory[]; // TODO: remove this later
}

export const CategoriesSidebar = ({
  open,
  onOpenChange,
  trigger,
  data,
}: Props) => {
  const [parentCategories, setParentCategories] = useState<
    CustomCategory[] | null
  >(null);
  const [selectedCategory, setSelectedCategory] =
    useState<CustomCategory | null>(null);
  const pathname = usePathname();

  // auto closing when not changing ismobile
  const isMobile = useIsMobile();
  useEffect(() => {
    handleOpenChange(false);
  }, [isMobile]);

  // FOCUS BACK BUTTON
  const backButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (parentCategories) backButtonRef.current?.focus();
    else closeButtonRef.current?.focus();
  }, [parentCategories]);

  // if we have parent categories, show those, otherwise show root categories
  const currentCategories = parentCategories ?? data ?? [];

  const handleOpenChange = (open: boolean) => {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(open);
  };

  const handleCategoryClick = (category: CustomCategory) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CustomCategory[]);
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
      <SheetTrigger asChild>{trigger}</SheetTrigger>

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
              className="hover:bg-white focus-visible:bg-white bg-transparent"
            >
              <X className="size-6" />
              <span className="sr-only">Close category sidebar</span>
            </Button>
          </SheetClose>

          <SheetDescription className="sr-only">
            This is the complete list of product search filter
          </SheetDescription>
        </SheetHeader>

        <ScrollArea
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
              <button
                onClick={() => handleCategoryClick(category)}
                key={category.slug}
                className="w-full text-left px-6 py-4 hover:bg-black hover:text-white flex items-center justify-between text-base font-medium focus-visible:bg-black focus-visible:text-white"
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
            ) : (
              <Link
                key={category.slug}
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
            );
          })}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
