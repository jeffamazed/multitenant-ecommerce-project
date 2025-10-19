import Link from "next/link";

import { Category } from "@/payload-types";
import { Button } from "@/components/ui/button";

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ChevronDown } from "lucide-react";

interface Props {
  category: Category;
}

export const CategoryDropdown = ({ category }: Props) => {
  const backgroundColor = category.color || "#f5f5f5";
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger asChild>
        <Button
          variant="elevated"
          className="rounded-full! select-none border-transparent hover:border-border bg-transparent hover:bg-white! focus-visible:bg-white! transition-all! focus-visible:ring-0! relative"
        >
          {category.name}
          <ChevronDown className="transition duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </NavigationMenuTrigger>

      {category.subcategories && category.subcategories.length > 0 && (
        <NavigationMenuContent className="w-60! p-0! -translate-x-[2px] -translate-y-[2px] absolute">
          <ul
            className="w-full text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]! -translate-x-[2px] -translate-y-[2px] rounded-md border-border"
            style={{ backgroundColor }}
          >
            {category.subcategories?.map((subcategory: Category) => (
              <li key={subcategory.slug} className="w-full">
                <NavigationMenuLink asChild>
                  <Link
                    href="/"
                    className="w-full text-left p-4 hover:bg-black! hover:text-white! underline font-medium hover:ring-0 focus-visible:text-white! focus-visible:bg-black! focus-visible:ring-0 cursor-pointer rounded-none!"
                  >
                    {subcategory.name}
                  </Link>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      )}
    </NavigationMenuItem>
  );
};
