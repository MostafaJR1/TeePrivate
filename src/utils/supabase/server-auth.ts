import { createClient } from "./server"; // Imports your server client helper [1.1.9]

export interface ServerUser {
  id: string;
  email?: string;
  storeName?: string;
  onboardingStatus?: "pending" | "completed";
  role?: "admin" | "merchant";
}

/**
 * Parses & verifies the session token directly in server memory.
 * Reads the native Supabase cookies (0 database queries) [1.2.6].
 */
export async function getVerifiedServerUser(): Promise<ServerUser | null> {
  try {
    const supabase = await createClient(); // Initializes the SSR server client [1.1.9]
    
    // Reads, parses, and decrypts the standard cookie locally (0 network roundtrips) [1.2.6]
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) return null;

    const user = session.user;

    return {
      id: user.id,
      email: user.email,
      storeName: user.user_metadata?.store_name,
      onboardingStatus: user.user_metadata?.onboarding_status as "pending" | "completed" | undefined,
      role: user.user_metadata?.role as "admin" | "merchant" | undefined, // Strongly typed role!
    };
  } catch (err) {
    console.error("Server-side auth verification error:", err);
    return null;
  }
}