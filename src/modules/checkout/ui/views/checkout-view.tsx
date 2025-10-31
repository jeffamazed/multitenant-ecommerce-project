"use client";

import { toast } from "sonner";
import { useCallback, useEffect } from "react";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { generateTenantURL } from "@/lib/utils";

import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

import { CheckoutItem } from "../components/checkout-item";
import { useCart } from "../../hooks/use-cart";
import { CheckoutSidebar } from "../components/checkout-sidebar";
import { CheckoutItemSkeleton } from "../components/checkout-item-skeleton";

interface Props {
  tenantSlug: string;
}

export const CheckoutView = ({ tenantSlug }: Props) => {
  const { productIds, clearAllCarts, removeProduct } = useCart(tenantSlug);

  const trpc = useTRPC();
  const { data, error, isLoading } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: productIds,
    })
  );

  // CLEAR LOCALSTORAGE WHEN ITEMS CONFLICTED
  useEffect(() => {
    if (!error) return;

    if (error.data?.code === "NOT_FOUND") {
      clearAllCarts();
      toast.warning(
        "Your cart contained unavailable items and has been refreshed."
      );
    }
  }, [clearAllCarts, error]);

  const onRemoveProduct = useCallback(
    (productId: string) => removeProduct(productId),
    [removeProduct]
  );

  const handleOnCheckout = useCallback(() => {}, []);
  const skeletons = [...Array(3)].map((_, i, arr) => (
    <CheckoutItemSkeleton
      key={i}
      isFirst={i === 0}
      isLast={i === arr.length - 1}
    />
  ));

  return (
    <div className="max-container common-padding">
      <h1 className="common-margin-bottom">Complete Your Purchase</h1>

      <div className="grid grid-cols-1 md:grid-cols-10 common-gap">
        <section className="md:col-span-6">
          <h2 className="text-xl md:text-2xl mb-4 font-medium">
            Review Your Items
          </h2>
          {isLoading ? (
            skeletons
          ) : data?.totalDocs === 0 ? (
            <EmptyPlaceholder
              Heading="h3"
              headingContent="No items here..."
              content="There's no item to checkout"
            />
          ) : (
            <ul className="">
              {data?.docs.map((p, i) => (
                <li key={p.id}>
                  <CheckoutItem
                    id={p.id}
                    isLast={i === data.docs.length - 1}
                    isFirst={i === 0}
                    imageUrl={p.image?.url}
                    name={p.name}
                    productUrl={`${generateTenantURL(p.tenant.slug)}/products/${p.id}`}
                    tenantUrl={generateTenantURL(p.tenant.slug)}
                    tenantName={p.tenant.name}
                    price={p.price}
                    onRemove={onRemoveProduct}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="md:col-span-4">
          <h2 className="text-xl md:text-2xl mb-4 font-medium text-right">
            Order Summary
          </h2>
          <CheckoutSidebar
            total={data?.totalPrice}
            onCheckout={handleOnCheckout}
            isCanceled={false}
            isPending={isLoading}
            isLoading={isLoading}
          />
        </aside>
      </div>
    </div>
  );
};
