import { redirect } from "next/navigation";
import { getVerifiedServerUser } from "@/utils/supabase/server-auth";
import { SideBar } from "@/Components/SideBar";

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  // 1. Authenticate user on the server (0 DB requests) [1.2.6]
  const user = await getVerifiedServerUser();

  // 2. Security fallback: If unauthorized, redirect immediately to login [1.1.4]
  if (!user) {
    redirect("/auth/login");
  }

  // 3. Onboarding Guard: If they haven't finished onboarding, block dashboard access [1.1.4]
  if (user.onboardingStatus !== "completed") {
    redirect("/auth/onboarding"); // Force pending users back to onboarding [1.1.4]
  }

  return (
    <div className="flex h-screen w-full bg-[#0a0a0c] text-white overflow-hidden">
      {/* Permanent, non-flickering slim sidebar [1.1.8] */}
      <SideBar user={user} />

      {/* Main scrolling viewport */}
      <main className="flex-1 h-full overflow-y-auto no-scrollbar flex flex-col">
        {children}
      </main>
    </div>
  );
}