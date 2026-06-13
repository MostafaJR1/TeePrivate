import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createClient } from "@/utils/supabase/client";
import { DatabaseProduct } from "@/utils/supabase/products";

interface ProductState {
  products: DatabaseProduct[];
  isLoaded: boolean;
  fetchProducts: () => Promise<void>;
  subscribeToRealtime: () => () => void;
}

const supabase = createClient();

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      isLoaded: false,

      // Fetches products once per browser tab session [1.1.2]
      fetchProducts: async () => {
        // If already cached in sessionStorage, abort network request instantly [1.1.2]
        if (get().isLoaded && get().products.length > 0) return;

        try {
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: true });

          if (!error && data) {
            set({ products: data as DatabaseProduct[], isLoaded: true });
          }
        } catch (err) {
          console.error("Store product retrieval failed:", err);
        }
      },

      // Listens to database inserts/deletions and updates the memory store instantly [1.2.6]
      subscribeToRealtime: () => {
        const channel = supabase
          .channel("global-products-realtime-changes")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "products" },
            async (payload: any) => {
              const currentProducts = get().products;
              
              if (payload.eventType === "INSERT") {
                const newProd = payload.new as DatabaseProduct;
                set({ products: [...currentProducts, newProd] });
              } else if (payload.eventType === "DELETE") {
                const deletedId = payload.old.id;
                set({ products: currentProducts.filter(p => p.id !== deletedId) });
              } else if (payload.eventType === "UPDATE") {
                const updatedProd = payload.new as DatabaseProduct;
                set({
                  products: currentProducts.map(p => p.id === updatedProd.id ? updatedProd : p)
                });
              }
            }
          )
          .subscribe();

        // Return cleanup function to unsubscribe on unmount [1.2.6]
        return () => {
          supabase.removeChannel(channel);
        };
      }
    }),
    {
      name: "teeprivate-session-products", // Storage key
      storage: createJSONStorage(() => sessionStorage), // Tab-lifetime persistence [1.1.2]
    }
  )
);
