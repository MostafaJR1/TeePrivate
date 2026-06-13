import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Check if Supabase credentials are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If credentials are missing, allow requests to proceed (development mode without Supabase)
  if (!supabaseUrl || !supabaseKey) {
    const pathname = request.nextUrl.pathname;
    
    // Redirect protected routes to login
    if (pathname.startsWith("/u") || pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set({ name, value, ...options }));
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const pathname = request.nextUrl.pathname;
    const now = Date.now();
    const fifteenMinutes = 15 * 60 * 1000;

    const lastRefreshCheck = request.cookies.get("teeprivate-refresh-check")?.value;
    const refreshToken = request.cookies.get("sb-refresh-token")?.value;

    // Default values for user state
    let onboardingStatus: "pending" | "completed" = "pending";
    let userRole: "admin" | "merchant" = "merchant";
    let isLoggedIn = false;

    // Extract session state
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        isLoggedIn = true;
        
        const metadata = session.user.user_metadata;
        onboardingStatus = metadata?.onboarding_status === "completed" ? "completed" : "pending";
        userRole = metadata?.role === "admin" ? "admin" : "merchant";
      }
    } catch (err) {
      console.error("[v0] Session parsing failed:", err);
    }

    // Security routing - redirect unauthenticated users
    if (!isLoggedIn) {
      if (pathname.startsWith("/u") || pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
    }

    // Admin routing
    if (isLoggedIn && userRole === "admin") {
      if (
        pathname.startsWith("/auth/login") ||
        pathname.startsWith("/auth/onboarding") ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/onboarding")
      ) {
        return NextResponse.redirect(new URL("/u/dashboard", request.url));
      }
      
      return supabaseResponse;
    }

    // Merchant routing
    if (isLoggedIn && userRole === "merchant") {
      if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/u/dashboard", request.url));
      }

      if (onboardingStatus === "pending") {
        if (pathname.startsWith("/u") || pathname.startsWith("/u/dashboard")) {
          return NextResponse.redirect(new URL("/auth/onboarding", request.url));
        }
        if (pathname.startsWith("/auth/login") || pathname === "/login") {
          return NextResponse.redirect(new URL("/auth/onboarding", request.url));
        }
      }

      if (onboardingStatus === "completed") {
        if (
          pathname.startsWith("/auth/login") ||
          pathname.startsWith("/auth/onboarding") ||
          pathname.startsWith("/login") ||
          pathname.startsWith("/onboarding")
        ) {
          return NextResponse.redirect(new URL("/u/dashboard", request.url));
        }
      }
    }

    // Session refresh throttling
    const shouldCheckRefresh = !lastRefreshCheck || (now - Number(lastRefreshCheck) > fifteenMinutes);

    if (shouldCheckRefresh && refreshToken && isLoggedIn) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data: { session: refreshedSession } } = await supabase.auth.getSession();

        if (user && refreshedSession) {
          supabaseResponse.cookies.set("teeprivate-refresh-check", String(now), { maxAge: 60 * 60 * 24 * 30, path: "/" });
          supabaseResponse.cookies.set("teeprivate-access-check", String(now), { maxAge: 60 * 60 * 24 * 30, path: "/" });
        }
      } catch (refreshErr) {
        console.error("[v0] Session refresh failed:", refreshErr);
        supabaseResponse.cookies.delete("teeprivate-refresh-check");
        supabaseResponse.cookies.delete("teeprivate-access-check");
      }
    }

    return supabaseResponse;
  } catch (err) {
    console.error("[v0] Middleware error:", err);
    return supabaseResponse;
  }
}
