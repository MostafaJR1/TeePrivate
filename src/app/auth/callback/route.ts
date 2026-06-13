import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    
    // Exchange the authorization code for a secure session [1.1.4]
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.user) {
      const status = data.user.user_metadata?.onboarding_status;
      
      // If onboarding is complete, send to dashboard. Otherwise, send to onboarding steps. [1.1.4]
      if (status === "completed") {
        return NextResponse.redirect(`${origin}/u/dashboard`);
      } else {
        return NextResponse.redirect(`${origin}/auth/onboarding`);
      }
    }
  }

  // Fallback to error route if something fails
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}