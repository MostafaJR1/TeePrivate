import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";

type SupabaseJwtPayload = JWTPayload & {
  user_metadata?: {
    onboarding_status?: string;
  };
};

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set({ name, value, ...options }));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set({ name, value, ...options }));
        },
      },
    }
  );

  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
      const jwtSecret = process.env.SUPABASE_JWT_SECRET;
      
      if (jwtSecret) {
        // 1. Verify token signature locally (No database calls) [1.2.2]
        const secretKey = new TextEncoder().encode(jwtSecret);
        const { payload } = await jwtVerify(session.access_token, secretKey);
        
        const onboardingStatus = (payload as SupabaseJwtPayload).user_metadata?.onboarding_status;
        const pathname = request.nextUrl.pathname;

        // 2. If user is logged in but has a PENDING status, block them from reaching dashboard [1.1.4, 1.1.8]
        if (onboardingStatus === "pending" && pathname !== "/onboarding") {
          return NextResponse.redirect(new URL("/onboarding", request.url));
        }

        // 3. If onboarding is complete, block them from returning to onboarding page [1.1.4]
        if (onboardingStatus === "completed" && pathname === "/onboarding") {
          return NextResponse.redirect(new URL("/", request.url));
        }

        return supabaseResponse;
      }
    } else {
      // No active session. If trying to reach protected dashboard, redirect to login.
      const pathname = request.nextUrl.pathname;
      if (pathname === "/dashboard" || pathname === "/onboarding") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  } catch {
    // Session token expired or failed. Trigger refresh.
    try { await supabase.auth.getUser(); } catch {}
  }

  return supabaseResponse;
}