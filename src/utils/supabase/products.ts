"use server";

import { revalidateTag, unstable_cache } from "next/cache";

export interface DatabaseProduct {
  id: string;
  title: string;
  category: string;
  base_price: number;
  colors: string[];
  color_count: number;
  image: string;
  hover_image: string;
  badge_text: string | null;
  creator_handle: string;
  avatar_bg: string;
  backdrop_bg: string;
}

/**
 * Globally fetches and caches public products once for all users.
 * Bypasses request headers to guarantee a single, shared static cache [1.1.2].
 */
export const getGlobalProducts = unstable_cache(
  async (): Promise<DatabaseProduct[]> => {
    // Dynamically import client on the server to prevent environmental leaks [1.1.9]
    const { createClient } = await import("@supabase/supabase-js");
    
    const directSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await directSupabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Database cache retrieval error:", error);
      throw error;
    }

    return (data as DatabaseProduct[]) || [];
  },
  ["global-products-cache-key"], // Unique cache key
  {
    tags: ["global-products-tag"], // Cache tag used for on-demand revalidation [1.1.2]
  }
);

/**
 * Instantly invalidates the global products cache across all users.
 * Call this inside your Server Actions whenever you insert, delete, or modify products [1.1.2].
 */
export async function triggerProductsRevalidation() {
  revalidateTag("global-products-tag", "default"); // Clears and rebuilds the Next.js cache instantly [1.1.2]
}