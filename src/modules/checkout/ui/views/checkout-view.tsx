"use client";

import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generateTenantURL } from "@/lib/utils";

import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

import { CheckoutItem } from "../components/checkout-item";
import { useCart } from "../../hooks/use-cart";
import { CheckoutSidebar } from "../components/checkout-sidebar";
import { CheckoutItemSkeleton } from "../components/checkout-item-skeleton";
import { useCheckoutStates } from "../../hooks/use-checkout-states";
import { CheckoutSuccess } from "../components/checkout-success";
import { CheckoutGetProducts } from "../../types";

interface Props {
  tenantSlug: string;
}

export const CheckoutView = ({ tenantSlug }: Props) => {
  const router = useRouter();
  const [checkoutStates, setCheckoutStates] = useCheckoutStates();
  const [isLoadingLocal, setIsLoadingLocal] = useState<boolean>(false);
  const [localData, setLocalData] = useState<CheckoutGetProducts | null>(null);
  const { productIds, removeProduct, clearCart } = useCart(tenantSlug);

  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const {
    data,
    error,
    isLoading: isLoadingData,
  } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: productIds,
    })
  );

  useEffect(() => {
    if (data) setLocalData(data);
  }, [data]);

  const purchase = useMutation(
    trpc.checkout.purchase.mutationOptions({
      onMutate: () => {
        // RESET THE STATE FIRST
        setCheckoutStates({ success: false, cancel: false });
      },
      onSuccess: (data) => {
        // REDIRECT TO STRIPE CHECKOUT PAGE
        window.location.href = data.url;
      },
      onError: (error) => {
        setIsLoadingLocal(false);
        toast.error(error.message);
        if (error.data?.code === "UNAUTHORIZED") {
          router.push(`${process.env.NEXT_PUBLIC_APP_URL!}/sign-in`);
        }
      },
    })
  );

  useEffect(() => {
    if (checkoutStates.success) {
      clearCart();

      queryClient.invalidateQueries(trpc.library.getMany.infiniteQueryFilter());
    }
  }, [
    checkoutStates.success,
    clearCart,
    queryClient,
    router,
    trpc.library.getMany,
  ]);

  // CLEAR LOCALSTORAGE FOR THIS TENANT WHEN ITEMS CONFLICTED
  useEffect(() => {
    if (!error) return;

    if (error.data?.code === "NOT_FOUND") {
      clearCart();
      toast.warning(
        "Your cart contained unavailable items and has been refreshed."
      );
    }
  }, [clearCart, error]);

  const onRemoveProduct = useCallback(
    (productId: string) => {
      removeProduct(productId);
      setLocalData((prev) => {
        if (prev) {
          const newDocs = prev?.docs.filter((p) => p.id !== productId);
          const newTotalPrice = newDocs.reduce(
            (acc, product) => acc + product.price,
            0
          );
          return {
            ...prev,
            docs: newDocs,
            totalPrice: newTotalPrice,
          };
        }

        return prev;
      });
    },
    [removeProduct]
  );

  const handleOnPurchase = useCallback(() => {
    setIsLoadingLocal(true);

    purchase.mutate({ tenantSlug, productIds });
  }, [productIds, tenantSlug, purchase]);

  const skeletons = [...Array(3)].map((_, i, arr) => (
    <CheckoutItemSkeleton
      key={i}
      isFirst={i === 0}
      isLast={i === arr.length - 1}
    />
  ));

  return (
    <div className="max-container common-padding">
      {checkoutStates.success ? (
        <CheckoutSuccess />
      ) : (
        <>
          <h1 className="common-margin-bottom">Complete Your Purchase</h1>

          <div className="common-grid-setup">
            <section className="md:col-span-6">
              <h2 className="text-xl md:text-2xl mb-4 font-medium">
                Review Your Items
              </h2>
              {isLoadingData && !localData ? (
                skeletons
              ) : localData?.totalDocs === 0 ? (
                <EmptyPlaceholder
                  Heading="h3"
                  headingContent="No items here..."
                  content="There's no item to checkout"
                />
              ) : (
                <ul className="">
                  {localData?.docs.map((p, i) => (
                    <li key={p.id}>
                      <CheckoutItem
                        id={p.id}
                        isLast={i === localData.docs.length - 1}
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
              <div className="md:sticky top-24 lg:top-26 xl:top-28">
                <h2 className="text-xl md:text-2xl mb-4 font-medium text-right">
                  Order Summary
                </h2>
                <CheckoutSidebar
                  total={localData?.totalPrice}
                  onPurchase={handleOnPurchase}
                  disabled={
                    purchase.isPending ||
                    isLoadingLocal ||
                    localData?.docs.length === 0
                  }
                  isLoading={isLoadingData}
                  isCanceled={checkoutStates.cancel}
                />
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
};
