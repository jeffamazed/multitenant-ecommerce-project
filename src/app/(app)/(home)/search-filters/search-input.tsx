import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  disabled?: boolean;
}

export const SearchInput = ({ disabled }: Props) => {
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
      {/* TODO: ADD CATEGORIES VIEW ALL BUTTON */}
      {/* TODO: ADD LIBRARY BUTTON */}
    </div>
  );
};
