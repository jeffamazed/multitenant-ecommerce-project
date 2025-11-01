import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TenantCart {
  productIds: string[];
}

interface CartState {
  tenantCarts: Record<string, TenantCart>;
  addProduct: (tenantSlug: string, productId: string) => void;
  removeProduct: (tenantSlug: string, productId: string) => void;
  clearCart: (tenantSlug: string) => void;
  clearAllCarts: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      tenantCarts: {},
      addProduct: (tenantSlug, productId) =>
        set((state) => {
          const existingCart = state.tenantCarts[tenantSlug]?.productIds || [];

          return {
            tenantCarts: {
              ...state.tenantCarts,
              [tenantSlug]: {
                productIds: [...existingCart, productId],
              },
            },
          };
        }),
      removeProduct: (tenantSlug, productId) =>
        set((state) => {
          const filteredProductIds =
            state.tenantCarts[tenantSlug]?.productIds.filter(
              (id) => id !== productId
            ) || [];

          return {
            tenantCarts: {
              ...state.tenantCarts,
              [tenantSlug]: {
                productIds: filteredProductIds,
              },
            },
          };
        }),
      clearCart: (tenantSlug) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              productIds: [],
            },
          },
        })),
      clearAllCarts: () =>
        set({
          tenantCarts: {},
        }),
    }),
    {
      name: "monavo-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
