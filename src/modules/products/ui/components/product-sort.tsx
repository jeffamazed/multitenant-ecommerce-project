"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useProductsFilters } from "../../hooks/use-product-filter";
import { SORT_BUTTONS, SortValue } from "../../constants";

export const ProductSort = () => {
  const [filters, setFilters] = useProductsFilters();

  const handleClick = (value: SortValue) =>
    setFilters((prev) => ({ ...prev, sort: value }));

  return (
    <div
      className="flex items-center gap-2"
      role="group"
      aria-label="Sort product"
    >
      {SORT_BUTTONS.map(({ label, value }) => (
        <Button
          key={label}
          size="sm"
          className={cn(
            "rounded-full bg-white hover:bg-white",
            filters.sort !== value &&
              "bg-transparent border-transparent hover:border-border hover:bg-transparent"
          )}
          variant="secondary"
          onClick={() => handleClick(value)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};
