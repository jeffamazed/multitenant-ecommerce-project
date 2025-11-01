import { useEffect, useState } from "react";
import { SquarePlusIcon, SquareX } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hooks/use-cart";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  tenantSlug: string;
  productId: string;
  productName: string;
}

export const CartButton = ({ tenantSlug, productId, productName }: Props) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { isProductInCart, toggleProduct } = useCart(tenantSlug);
  const productInCart = isProductInCart(productId);

  useEffect(() => setMounted(true), []);

  const handleClick = () => {
    toggleProduct(productId);
    if (productInCart) toast.warning(`${productName} removed from cart.`);
    if (!productInCart) toast.success(`${productName} added to cart.`);
  };

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
        onClick={handleClick}
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
