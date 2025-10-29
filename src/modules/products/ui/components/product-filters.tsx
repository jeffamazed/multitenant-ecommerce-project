"use client";

import { Button } from "@/components/ui/button";
import { memo, useCallback } from "react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { PriceFilter } from "./price-filters";
import { TagsFilter } from "./tags-filter";

import { useProductsFilters } from "../../hooks/use-product-filter";

export const ProductFilters = memo(function ProductFilters() {
  const [filters, setFilters] = useProductsFilters();
  const hasAnyFilters = Object.entries(filters).some(([key, value]) => {
    // PREVENTING SORT TO HAVE ANY EFFECT ON FILTER
    if (key === "sort") return false;

    if (typeof value === "string") return value !== "";
    if (Array.isArray(value)) return value.length > 0;
    return value !== null;
  });

  // ENSURES TYPE CAN ONLY BE "minPrice" AND "maxPrice"
  const onChange = useCallback(
    (key: keyof typeof filters, value: unknown) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [setFilters]
  );

  const handleOnMinPriceChange = useCallback(
    (value: unknown) => onChange("minPrice", value),
    [onChange]
  );
  const handleOnMaxPriceChange = useCallback(
    (value: unknown) => onChange("maxPrice", value),
    [onChange]
  );
  const handleOnTagChange = useCallback(
    (value: unknown) => onChange("tags", value),
    [onChange]
  );

  const onClear = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      tags: [],
    });
  };

  return (
    <aside className="border rounded-md bg-white">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-medium text-lg">Product Filters</h3>
        {hasAnyFilters && (
          <Button
            variant="link"
            size="sm"
            className="text-sm size-fit underline border-none p-0.5!"
            type="button"
            onClick={onClear}
          >
            Clear
          </Button>
        )}
      </div>
      <Accordion type="multiple">
        <AccordionItem value="price-filter">
          <AccordionTrigger Heading="h4" className="text-base px-4">
            Price
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-4 py-2">
              <PriceFilter
                minPrice={filters.minPrice}
                maxPrice={filters.maxPrice}
                onMinPriceChange={handleOnMinPriceChange}
                onMaxPriceChange={handleOnMaxPriceChange}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tag-filter">
          <AccordionTrigger Heading="h4" className="text-base px-4">
            Tags
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-4 py-2">
              <TagsFilter value={filters.tags} onChange={handleOnTagChange} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
});
