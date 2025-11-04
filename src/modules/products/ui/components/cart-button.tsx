import { SquarePlusIcon, SquareX } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hooks/use-cart";
import Link from "next/link";

interface Props {
  tenantSlug: string;
  productId: string;
  productName: string;
  isPurchased?: boolean;
}

export const CartButton = ({
  tenantSlug,
  productId,
  productName,
  isPurchased,
}: Props) => {
  const { isProductInCart, toggleProduct } = useCart(tenantSlug);
  const productInCart = isProductInCart(productId);

  const handleClick = () => {
    toggleProduct(productId);
    if (productInCart) toast.warning(`${productName} removed from cart.`);
    if (!productInCart) toast.success(`${productName} added to cart.`);
  };

  return isPurchased ? (
    <Button
      variant="elevated"
      asChild
      className={cn(
        "flex-1 hover:bg-custom-accent focus-visible:bg-custom-accent"
      )}
    >
      <Link href={`${process.env.NEXT_PUBLIC_APP_URL!}/library/${productId}`}>
        View in library
      </Link>
    </Button>
  ) : (
    <Button
      className={cn("flex-1", {
        "bg-custom-accent": !productInCart,
        "bg-destructive text-red-50": productInCart,
      })}
      variant="elevated"
      onClick={handleClick}
      aria-pressed={productInCart}
    >
      {productInCart ? (
        <SquareX className="size-5" />
      ) : (
        <SquarePlusIcon className="size-5" />
      )}
      {productInCart ? "Remove from cart" : "Add to cart"}
    </Button>
  );
};
