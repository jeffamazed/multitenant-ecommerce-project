import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, generateTenantURL } from "@/lib/utils";

import { useCart } from "../../hooks/use-cart";
import { Skeleton } from "@/components/ui/skeleton";
import TooltipCustom from "@/components/shared/tooltip-custom";

interface Props {
  className?: string;
  tenantSlug: string;
}

export const CheckoutButton = ({ className, tenantSlug }: Props) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { totalItems } = useCart(tenantSlug);

  useEffect(() => setMounted(true), []);

  const ariaLabel =
    totalItems === 0
      ? "No items to checkout"
      : `Check out with ${totalItems} item${totalItems > 1 ? "s" : ""} in the cart`;

  return (
    <>
      {!mounted && <Skeleton className="size-12 shrink-0 bg-skeleton" />}
      <TooltipCustom
        trigger={
          <Button
            asChild
            variant="elevated"
            className={cn("bg-white min-w-12", className, {
              "loading-state": !mounted,
            })}
            inert={!mounted}
            tabIndex={!mounted ? -1 : 0}
            aria-label={ariaLabel}
          >
            <Link href={`${generateTenantURL(tenantSlug)}/checkout`}>
              <ShoppingCartIcon className="size-5" />
              {totalItems > 0 ? totalItems : ""}
            </Link>
          </Button>
        }
        content={totalItems === 0 ? "No items" : `Checkout (${totalItems})`}
        sideOffset={10}
      />
    </>
  );
};
