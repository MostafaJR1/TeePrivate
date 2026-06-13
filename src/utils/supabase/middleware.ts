import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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

  // STRICT PERMISSIONS DEFAULT VALUES
  let onboardingStatus: "pending" | "completed" = "pending";
  let userRole: "admin" | "merchant" = "merchant"; // Defaults safely to merchant [1]
  let isLoggedIn = false;

  // 1. EXTRACT STATE LOCALLY FROM COOKIE (0 Database Queries, No external env secrets needed) [1.2.6]
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      isLoggedIn = true; // Mark as logged in immediately if session exists [1.2.6]
      
      const metadata = session.user.user_metadata;
      onboardingStatus = metadata?.onboarding_status === "completed" ? "completed" : "pending";
      userRole = metadata?.role === "admin" ? "admin" : "merchant"; // Securely read user role [1.2.6]
    }
  } catch (err) {
    console.error("Local session parsing failed:", err);
  }

  // 2. ENFORCE AIRTIGHT SECURITY ROUTING GUARDS [1]

  // --- RULE 1: ANONYMOUS GUESTS (Not Logged In) --- [1.1.4]
  if (!isLoggedIn) {
    // Protect ALL private merchant ("/u/") and admin ("/admin/") routes [1]
    if (pathname.startsWith("/u") || pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // --- RULE 2: VERIFIED ADMINISTRATORS (Can access EVERY page) --- [1]
  if (isLoggedIn && userRole === "admin") {
    // Admins bypass all onboarding/login pages and have unrestricted routing across the app [1]
    if (
      pathname.startsWith("/auth/login") ||
      pathname.startsWith("/auth/onboarding") ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/onboarding")
    ) {
      return NextResponse.redirect(new URL("/u/dashboard", request.url));
    }
    
    return supabaseResponse; // Bypasses all other merchant blocks [1]
  }

  // --- RULE 3: REGULAR MERCHANTS (Non-Admins) --- [1]
  if (isLoggedIn && userRole === "merchant") {
    
    // A. Block access to any admin "/admin/..." pages instantly [1]
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/u/dashboard", request.url)); // Send to home page [1.1.4]
    }

    // B. If Onboarding is PENDING, force them to complete registration [1.1.4]
    if (onboardingStatus === "pending") {
      if (pathname.startsWith("/u") || pathname.startsWith("/u/dashboard")) {
        return NextResponse.redirect(new URL("/auth/onboarding", request.url));
      }
      if (pathname.startsWith("/auth/login") || pathname === "/login") {
        return NextResponse.redirect(new URL("/auth/onboarding", request.url));
      }
    }

    // C. If Onboarding is COMPLETED, block access to signup/login forms [1.1.4]
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

  // 3. SECURE PERFORMANCE THROTTLING (Runs after security guards) [1.1.4, 1.2.6]
  const shouldCheckRefresh = !lastRefreshCheck || (now - Number(lastRefreshCheck) > fifteenMinutes);

  if (shouldCheckRefresh && refreshToken && isLoggedIn) {
    try {
      const { data: { user } } = await supabase.auth.getUser(); // Triggers token refresh [1.1.4]
      const { data: { session: refreshedSession } } = await supabase.auth.getSession();

      if (user && refreshedSession) {
        supabaseResponse.cookies.set("teeprivate-refresh-check", String(now), { maxAge: 60 * 60 * 24 * 30, path: "/" });
        supabaseResponse.cookies.set("teeprivate-access-check", String(now), { maxAge: 60 * 60 * 24 * 30, path: "/" });
      }
    } catch (refreshErr) {
      console.error("Session auto-refresh failed, purging cookies:", refreshErr);
      supabaseResponse.cookies.delete("teeprivate-refresh-check");
      supabaseResponse.cookies.delete("teeprivate-access-check");
    }
  }

  return supabaseResponse;
}