import { NextResponse } from "next/server";
import { getVerifiedServerUser } from "@/utils/supabase/server-auth";
import { getCachedMerchantDashboardData } from "@/utils/supabase/dashboard-queries";

export async function GET() {
  // 1. Authenticate user locally from JWT Claims (0 DB requests) [1.2.6]
  const user = await getVerifiedServerUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 2. Fetch server-cached metrics
  const data = await getCachedMerchantDashboardData(user.id);
  return NextResponse.json(data);
}