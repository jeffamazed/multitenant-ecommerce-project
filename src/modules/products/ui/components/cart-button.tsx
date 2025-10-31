import { useEffect, useState } from "react";
import { SquarePlusIcon, SquareX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hooks/use-cart";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  tenantSlug: string;
  productId: string;
}

export const CartButton = ({ tenantSlug, productId }: Props) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { isProductInCart, toggleProduct } = useCart(tenantSlug);
  const productInCart = isProductInCart(productId);

  useEffect(() => setMounted(true), []);

  return (
    <>
      {!mounted && <Skeleton className="bg-skeleton h-12 flex-1" />}
      <Button
        className={cn("flex-1 transition-colors duration-75", {
          "bg-custom-accent": !productInCart,
          "bg-destructive": productInCart,
          "loading-state": !mounted,
        })}
        variant="elevated"
        onClick={() => toggleProduct(productId)}
        aria-pressed={productInCart}
        // disabling focus when not mounted
        inert={!mounted}
        tabIndex={!mounted ? -1 : 0}
      >
        {productInCart ? (
          <SquareX className="size-5" />
        ) : (
          <SquarePlusIcon className="size-5" />
        )}
        {productInCart ? "Remove from cart" : "Add to cart"}
      </Button>
    </>
  );
};
