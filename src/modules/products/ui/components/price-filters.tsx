import { memo } from "react";
import CurrencyInput from "react-currency-input-field";

import { Label } from "@/components/ui/label";

interface Props {
  minPrice?: string | null;
  maxPrice?: string | null;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
}

export const PriceFilter = memo(function PriceFilter({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: Props) {
  const handlePriceChange = (
    value: string | undefined | null,
    type: "minPrice" | "maxPrice"
  ) => {
    if (type === "minPrice") onMinPriceChange(value ?? "");
    else onMaxPriceChange(value ?? "");
  };

  return (
    <div className="flex flex-col gap-2" aria-label="Price filter" role="group">
      <div className="flex flex-col gap-2">
        <Label htmlFor="filter-minimum-price" className="font-medium text-sm">
          Minimum Price
        </Label>
        <CurrencyInput
          id="filter-minimum-price"
          placeholder="$0"
          value={minPrice ?? ""}
          decimalsLimit={2}
          onValueChange={(value) => handlePriceChange(value, "minPrice")}
          intlConfig={{ locale: "en-US", currency: "USD" }}
          className="custom-shadcn-input"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="filter-maximum-price" className="font-medium text-sm">
          Maximum Price
        </Label>
        <CurrencyInput
          id="filter-maximum-price"
          placeholder="∞"
          value={maxPrice ?? ""}
          decimalsLimit={2}
          onValueChange={(value) => handlePriceChange(value, "maxPrice")}
          intlConfig={{ locale: "en-US", currency: "USD" }}
          className="custom-shadcn-input placeholder:text-xl"
        />
      </div>
    </div>
  );
});
