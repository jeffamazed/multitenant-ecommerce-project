import { memo, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
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
  const [localMin, setLocalMin] = useState(minPrice ?? "");
  const [localMax, setLocalMax] = useState(maxPrice ?? "");

  // DEBOUNCE BEFORE SYNCING
  const [debouncedMin] = useDebounce(localMin, 500);
  const [debouncedMax] = useDebounce(localMax, 500);

  useEffect(() => {
    if (debouncedMin !== minPrice) onMinPriceChange(debouncedMin);
  }, [debouncedMin, minPrice, onMinPriceChange]);

  useEffect(() => {
    if (debouncedMax !== maxPrice) onMaxPriceChange(debouncedMax);
  }, [debouncedMax, maxPrice, onMaxPriceChange]);

  const handlePriceChange = (
    value: string | undefined,
    type: "minPrice" | "maxPrice"
  ) => {
    if (type === "minPrice") setLocalMin(value ?? "");
    else setLocalMax(value ?? "");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="filter-minimum-price" className="font-medium text-base">
          Minimum Price
        </Label>
        <CurrencyInput
          id="filter-minimum-price"
          placeholder="$0"
          defaultValue={localMin}
          decimalsLimit={2}
          onValueChange={(value) => handlePriceChange(value, "minPrice")}
          intlConfig={{ locale: "en-US", currency: "USD" }}
          className="custom-shadcn-input"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="filter-maximum-price" className="font-medium text-base">
          Maximum Price
        </Label>
        <CurrencyInput
          id="filter-maximum-price"
          placeholder="∞"
          defaultValue={localMax}
          decimalsLimit={2}
          onValueChange={(value) => handlePriceChange(value, "maxPrice")}
          intlConfig={{ locale: "en-US", currency: "USD" }}
          className="custom-shadcn-input placeholder:text-xl"
        />
      </div>
    </div>
  );
});
