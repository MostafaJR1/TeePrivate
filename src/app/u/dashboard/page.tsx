import { redirect } from "next/navigation";
import { getVerifiedServerUser } from "@/utils/supabase/server-auth";
import { getCachedMerchantDashboardData } from "@/utils/supabase/dashboard-queries";
import { DashboardClient } from "@/Components/PrivateDashboard/DashboardClient";

export default async function DashboardPage() {
  // 1. Authenticate user on the server (0 DB requests) [1.2.6]
  const user = await getVerifiedServerUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 2. Fetch serverside-cached metrics (0 DB queries if loaded within 5 mins) [1.1.2, 1.2.6]
  const initialData = await getCachedMerchantDashboardData(user.id);

  // 3. Delegate to SWR Client with pre-rendered data [1.1.8]
  return <DashboardClient initialData={initialData} />;
}