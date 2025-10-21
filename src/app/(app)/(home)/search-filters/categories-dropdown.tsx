import Link from "next/link";
import { ChevronDown } from "lucide-react";
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

import { CustomCategory } from "../types";

interface Props {
  category: CustomCategory;
  isActive: boolean;
}

export const CategoryDropdown = ({ category, isActive }: Props) => {
  const backgroundColor = category.color || "#f5f5f5";
  const hasNoSubCat = category.subcategories.length === 0;
  const pathname = usePathname();

  // FOR CHECKING ARIA CURRENT PARENT HREF
  const parentHref = category.slug === "all" ? "/" : `/${category.slug}`;
  const isCurrentPage = pathname === parentHref;

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        asChild
        {...(category.slug !== "all" && category.slug !== "other"
          ? {}
          : { "aria-expanded": undefined, "aria-controls": undefined })}
      >
        <Button
          asChild
          variant="elevated"
          className={cn(
            "rounded-full! select-none border-transparent hover:border-border bg-transparent hover:bg-white! focus-visible:bg-white! transition-all! focus-visible:ring-0! relative text-base! h-11! px-4! py-2! has-[>svg]:px-3!",
            "data-[state=open]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] data-[state=open]:-translate-x-[4px] data-[state=open]:-translate-y-[4px] data-[state=open]:bg-white data-[state=open]:border-border",
            isActive && "border-border bg-white"
          )}
        >
          <Link
            href={parentHref}
            aria-current={isCurrentPage ? "page" : undefined}
          >
            {category.name}
            {!hasNoSubCat && (
              <ChevronDown className="transition duration-200 group-data-[state=open]:rotate-180" />
            )}
          </Link>
        </Button>
      </NavigationMenuTrigger>

      {category.subcategories && category.subcategories.length > 0 && (
        <NavigationMenuContent
          className="p-0! -translate-x-[2px] -translate-y-[2px] absolute z-3 w-60"
          asChild
        >
          <div className="overflow-hidden">
            <ul
              className="text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]! -translate-x-[2px] -translate-y-[2px] rounded-md border-border max-h-[300px] overflow-y-auto overflow-x-hidden max-md:scrollbar-none!"
              style={{ backgroundColor }}
            >
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
                          "w-60 p-4 hover:bg-black! hover:text-white! underline font-medium hover:ring-0 focus-visible:text-white! focus-visible:bg-black! focus-visible:ring-0 cursor-pointer rounded-none! text-base!",
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
};
