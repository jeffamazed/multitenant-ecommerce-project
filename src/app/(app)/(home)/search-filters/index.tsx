import { Category } from "@/payload-types";

import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { CategoryDropdown } from "./categories-dropdown";
import { SearchInput } from "./search-input";

interface Props {
  data: any;
}

export const SearchFilters = ({ data }: Props) => {
  return (
    <NavigationMenu
      className="flex flex-col gap-4 mx-auto max-w-full"
      aria-label="Product Search Navigation"
      viewport={false}
    >
      <SearchInput />
      <NavigationMenuList className="flex-wrap">
        {data.map((category: Category) => (
          <CategoryDropdown key={category.id} category={category} />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
