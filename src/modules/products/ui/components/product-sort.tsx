"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useProductsFilters } from "../../hooks/use-product-filter";
import { SORT_BUTTONS, SortValue } from "../../constants";
import TooltipCustom from "@/components/shared/tooltip-custom";

export const ProductSort = () => {
  const [filters, setFilters] = useProductsFilters();

  const handleClick = (value: SortValue) =>
    setFilters((prev) => ({ ...prev, sort: value }));

  return (
    <div
      className="flex items-center gap-2 ml-auto"
      role="group"
      aria-label="Sort products"
    >
      {SORT_BUTTONS.map(({ label, value, Icon, ariaLabel, tooltip }) => {
        const isActive = filters.sort === value;

        const sortButton = (
          <Button
            key={label ?? value}
            size="sm"
            className={cn(
              "rounded-full bg-white hover:bg-white",
              !isActive &&
                "bg-transparent border-transparent hover:border-border hover:bg-transparent"
            )}
            variant="secondary"
            onClick={() => handleClick(value)}
            aria-pressed={isActive}
            {...(ariaLabel && { "aria-label": ariaLabel })}
          >
            {label}
            {Icon && <Icon className="size-5" />}
          </Button>
        );

        return tooltip ? (
          <TooltipCustom
            key={label ?? value}
            trigger={sortButton}
            content={ariaLabel ?? ""}
            side="bottom"
            sideOffset={5}
          />
        ) : (
          sortButton
        );
      })}
    </div>
  );
};
