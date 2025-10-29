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
import { useProductsFilters } from "../../hooks/use-product-filter";

export const ProductFilters = memo(function ProductFilters() {
  const [filters, setFilters] = useProductsFilters();

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

  return (
    <aside className="border rounded-md bg-white">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-medium text-xl">Filters</h2>
        <Button
          variant="link"
          size="sm"
          className="text-base border-none underline"
          type="button"
          onClick={() => {}}
        >
          Clear
        </Button>
      </div>
      <Accordion type="multiple">
        <AccordionItem value="item-1" className="px-4 overflow-visible">
          <AccordionTrigger className="text-lg">Price</AccordionTrigger>
          <AccordionContent>
            <PriceFilter
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              onMinPriceChange={handleOnMinPriceChange}
              onMaxPriceChange={handleOnMaxPriceChange}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
});
