import { memo, useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useDebounce } from "use-debounce";

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
  const [localMinPrice, setLocalMinPrice] = useState<string>(minPrice ?? "");
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(maxPrice ?? "");

  const [debouncedMinPrice] = useDebounce(localMinPrice, 500);
  const [debouncedMaxPrice] = useDebounce(localMaxPrice, 500);
  useEffect(() => {
    onMinPriceChange(debouncedMinPrice);
  }, [debouncedMinPrice, onMinPriceChange]);

  useEffect(() => {
    onMaxPriceChange(debouncedMaxPrice);
  }, [debouncedMaxPrice, onMaxPriceChange]);

  return (
    <div className="flex flex-col gap-2" aria-label="Price filter" role="group">
      <div className="flex flex-col gap-2">
        <Label htmlFor="filter-minimum-price" className="font-medium text-sm">
          Minimum Price
        </Label>
        <CurrencyInput
          id="filter-minimum-price"
          placeholder="$0"
          value={localMinPrice}
          decimalsLimit={2}
          onValueChange={(value) => setLocalMinPrice(value ?? "")}
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
          value={localMaxPrice}
          decimalsLimit={2}
          onValueChange={(value) => setLocalMaxPrice(value ?? "")}
          intlConfig={{ locale: "en-US", currency: "USD" }}
          className="custom-shadcn-input placeholder:text-xl"
        />
      </div>
    </div>
  );
});
