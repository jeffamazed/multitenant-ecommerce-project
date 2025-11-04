import { useCallback, useMemo } from "react";

import { useShallow } from "zustand/react/shallow";

import { useCartStore } from "../store/use-cart-store";

const EMPTY_ARRAY: string[] = [];

export const useCart = (tenantSlug: string) => {
  const addProduct = useCartStore((s) => s.addProduct);
  const removeProduct = useCartStore((s) => s.removeProduct);
  const clearCart = useCartStore((s) => s.clearCart);
  const clearAllCarts = useCartStore((s) => s.clearAllCarts);

  const productIds = useCartStore(
    useShallow((s) => s.tenantCarts[tenantSlug]?.productIds || EMPTY_ARRAY)
  );

  const toggleProduct = useCallback(
    (productId: string) => {
      if (productIds.includes(productId)) {
        removeProduct(tenantSlug, productId);
      } else {
        addProduct(tenantSlug, productId);
      }
    },
    [addProduct, productIds, removeProduct, tenantSlug]
  );

  const isProductInCart = useCallback(
    (productId: string) => {
      return productIds.includes(productId);
    },
    [productIds]
  );

  const clearTenantCart = useCallback(
    () => clearCart(tenantSlug),
    [clearCart, tenantSlug]
  );

  const addProductOptimized = useCallback(
    (productId: string) => addProduct(tenantSlug, productId),
    [addProduct, tenantSlug]
  );

  const removeProductOptimized = useCallback(
    (productId: string) => {
      removeProduct(tenantSlug, productId);
    },
    [removeProduct, tenantSlug]
  );

  return useMemo(
    () => ({
      productIds,
      addProduct: addProductOptimized,
      removeProduct: removeProductOptimized,
      clearCart: clearTenantCart,
      clearAllCarts,
      toggleProduct,
      isProductInCart,
      totalItems: productIds.length,
    }),
    [
      addProductOptimized,
      clearAllCarts,
      clearTenantCart,
      isProductInCart,
      productIds,
      removeProductOptimized,
      toggleProduct,
    ]
  );
};
