

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Product type
type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity?: number;
};

// Store type
type Store = {
  cart: Product[];
  wishlist: Product[];
  addToCart: (
    product: Product,
    user: any,
    location: string,
    deviceInfo: string
  ) => void;
  removeFromCart: (
    id: string,
    user: any,
    location: string,
    deviceInfo: string
  ) => void;
  addToWishlist: (
    product: Product,
    user: any,
    location: string,
    deviceInfo: string
  ) => void;
  removeFromWishlist: (
    id: string,
    user: any,
    location: string,
    deviceInfo: string
  ) => void;
};

// Zustand store with persist
export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],

      addToCart: (product, user, location, deviceInfo) => {
        set((state) => {
          const existing = state.cart?.find((item) => item.id === product.id);

          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: (item.quantity ?? 1) + 1 }
                  : item
              ),
            };
          }

          return {
            cart: [...state.cart, { ...product, quantity: 1 }],
          };
        });
      },

      removeFromCart: (id, user, location, deviceInfo) => {
        set({ cart: get().cart.filter((item) => item.id !== id) });
      },

      addToWishlist: (product, user, location, deviceInfo) => {
        const existing = get().wishlist.find((item) => item.id === product.id);
        if (!existing) {
          set({ wishlist: [...get().wishlist, product] });
        }
      },

      removeFromWishlist: (id, user, location, deviceInfo) => {
        set({ wishlist: get().wishlist.filter((item) => item.id !== id) });
      },
    }),
    {
      name: "store-storage", // localStorage key
    }
  )
);
