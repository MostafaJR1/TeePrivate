import { unstable_cache } from "next/cache";
import { createClient } from "./client";

export interface DashboardPayload {
  wallet: { cleared_cash: number; wallet_balance: number };
  orders: any[];
}

/**
 * Caches merchant metrics on the server-side for 5 minutes [1.1.2].
 * Bypasses cookies using parameterization to guarantee stable caching [1.1.2, 1.2.6].
 */
export const getCachedMerchantDashboardData = unstable_cache(
  async (merchantId: string): Promise<DashboardPayload> => {
    const supabase = await createClient();

    // 1. Fetch Wallet details
    const { data: wallet } = await supabase
      .from("merchant_wallets")
      .select("cleared_cash, wallet_balance")
      .eq("merchant_id", merchantId)
      .single();

    // 2. Fetch All Orders
    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .eq("merchant_id", merchantId)
      .order("created_at", { ascending: false });

    return {
      wallet: wallet || { cleared_cash: 0, wallet_balance: 0 },
      orders: orders || [],
    };
  },
  ["merchant-dashboard-cache-key"], // Unique cache key
  {
    revalidate: 300, // Throttles queries to once every 5 minutes [1.1.2]
  }
);