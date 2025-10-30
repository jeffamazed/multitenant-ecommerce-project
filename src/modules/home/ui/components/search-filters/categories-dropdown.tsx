import { memo } from "react";
import Link from "next/link";
import { ChevronDown, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

import { Category } from "@/payload-types";
import { Button } from "@/components/ui/button";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

import { CategoriesGetManyOutput } from "@/modules/categories/types";
import { DEFAULT_BG_COLOR } from "@/modules/home/constants";

interface Props {
  category: CategoriesGetManyOutput[1];
  isActive: boolean;
}

export const CategoryDropdown = memo(function CategoryDropdown({
  category,
  isActive,
}: Props) {
  const backgroundColor = category.color || DEFAULT_BG_COLOR;
  const hasNoSubCat = category.subcategories.length === 0;
  const pathname = usePathname();

  // FOR CHECKING ARIA CURRENT PARENT HREF
  const parentHref = category.slug === "all" ? "/" : `/${category.slug}`;
  const isCurrentPageParent = pathname === parentHref;

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        asChild
        // DISABLE ARIA WHEN NO THERE'S NO DROPDOWN
        {...(category.slug !== "all" && category.slug !== "other"
          ? {}
          : { "aria-expanded": undefined, "aria-controls": undefined })}
      >
        <Button
          variant="elevated"
          className={cn(
            "rounded-full! select-none border-transparent hover:border-border bg-transparent hover:bg-white! focus-visible:bg-white! transition-all! focus-visible:ring-0! relative text-base! h-11! px-4! py-2! has-[>svg]:px-3!",
            "data-[state=open]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] data-[state=open]:-translate-x-[4px] data-[state=open]:-translate-y-[4px] data-[state=open]:bg-white data-[state=open]:border-border cursor-default",
            isActive && "border-border bg-white"
          )}
        >
          <>
            {category.name}
            {!hasNoSubCat && (
              <ChevronDown className="transition duration-200 group-data-[state=open]:rotate-180" />
            )}
          </>
        </Button>
      </NavigationMenuTrigger>

      {category.subcategories && category.subcategories.length > 0 && (
        <NavigationMenuContent
          className="p-0! -translate-x-[2px] -translate-y-[2px] absolute z-3 w-60"
          asChild
        >
          <div className="overflow-hidden">
            <ul
              className="text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]! -translate-x-[2px] -translate-y-[2px] rounded-md border-border max-h-[350px] overflow-y-auto overflow-x-hidden max-md:scrollbar-none!"
              style={{ backgroundColor }}
            >
              {/* PARENT DOMAIN */}
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href={parentHref}
                    aria-current={isCurrentPageParent ? "page" : undefined}
                    className={cn(
                      "font-bold nav-product-filter-item flex items-center flex-row gap-2",
                      isCurrentPageParent && "bg-black text-white"
                    )}
                  >
                    {category.name} <Sparkles className="size-4 text-inherit" />
                  </Link>
                </NavigationMenuLink>
              </li>

              {category.subcategories?.map((subcategory: Category) => {
                const href = `/${category.slug}/${subcategory.slug}`;
                const isCurrentPageSubCat = pathname === href;

                return (
                  <li key={subcategory.slug}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={href}
                        aria-current={isCurrentPageSubCat ? "page" : undefined}
                        className={cn(
                          "font-medium nav-product-filter-item",
                          isCurrentPageSubCat && "bg-black text-white"
                        )}
                      >
                        {subcategory.name}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </NavigationMenuContent>
      )}
    </NavigationMenuItem>
  );
});
