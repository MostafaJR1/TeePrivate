"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Space_Grotesk } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client"; // Browser client helper
import { 
  IoMailOutline, 
  IoLockClosedOutline, 
  IoEyeOutline, 
  IoEyeOffOutline,
  IoLogoGoogle,
  IoWarningOutline
} from "react-icons/io5";

const logoFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
});

const supabase = createClient();

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // BROWSER-BASED TOKEN GUARD (0 Database Queries) [1.2.6]
  useEffect(() => {
    const checkLocalSession = async () => {
      // Reads session purely from local browser cookies/storage [1.2.6]
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const status = session.user.user_metadata?.onboarding_status;
        if (status === "completed") {
          router.push("/u/dashboard");
        } else {
          router.push("/auth/onboarding");
        }
      }
    };
    checkLocalSession();

    // Dynamically listen to auth transitions on the client [1.2.6]
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const status = session.user.user_metadata?.onboarding_status;
        if (status === "completed") {
          router.push("/u/dashboard");
        } else {
          router.push("/auth/onboarding");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
      
      router.refresh(); // Syncs server cookie context [1.1.8]
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage((err as { message: string }).message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setErrorMessage(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setErrorMessage((err as { message: string }).message || "Google authentication failed.");
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white text-black font-sans">
      {/* Brand presentation column (Desktop) */}
      <section className="hidden lg:flex lg:col-span-5 black-bg relative flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#e9204f]/5 blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        <Link href="/" className={`${logoFont.className} text-2xl font-bold tracking-tight text-white select-none z-10`}>
          Tee<span className="primary-text">Private</span>
        </Link>
        <div className="z-10 flex flex-col gap-5 max-w-sm">
          <span className="text-xs font-black tracking-widest text-[#e9204f] uppercase">Morocco&apos;s Leading COD & POD Platform</span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">Connect, Print, and Automate</h2>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-medium">Zero upfront risk, fast nationwide delivery, and same-day COD cashouts.</p>
        </div>
        <div className="z-10 text-xs font-bold text-neutral-600 tracking-widest">© {new Date().getFullYear()} TeePrivate Morocco</div>
      </section>

      {/* Form column */}
      <section className="flex lg:col-span-7 items-center justify-center p-6 md:p-12 lg:p-16 relative bg-white">
        <div className="absolute top-6 left-6 lg:hidden">
          <Link href="/" className={`${logoFont.className} text-xl font-bold tracking-tight black-text select-none`}>
            Tee<span className="primary-text">Private</span>
          </Link>
        </div>

        <div className="w-full max-w-[420px] flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight mb-2">Welcome back</h1>
            <p className="text-neutral-500 text-sm font-medium leading-relaxed">Log in to your TeePrivate dashboard to manage custom designs and track shipping.</p>
          </div>

          <AnimatePresence>
            {errorMessage && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2 bg-red-50 text-red-700 text-xs font-bold p-4 rounded-xl border border-red-100 leading-relaxed">
                <span className="shrink-0"><IoWarningOutline size={16} /></span>
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Email Address</label>
              <div className="relative flex items-center bg-neutral-50 border border-neutral-200 focus-within:border-[#e9204f]/40 rounded-xl transition duration-150 p-1">
                <div className="pl-3 text-neutral-400"><IoMailOutline size={18} /></div>
                <input type="email" required placeholder="name@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-3 pr-4 py-2.5 bg-transparent outline-none text-sm font-semibold text-neutral-800 placeholder-neutral-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Password</label>
              <div className="relative flex items-center bg-neutral-50 border border-neutral-200 focus-within:border-[#e9204f]/40 rounded-xl transition duration-150 p-1">
                <div className="pl-3 text-neutral-400"><IoLockClosedOutline size={18} /></div>
                <input type={showPassword ? "text" : "password"} required placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-3 pr-10 py-2.5 bg-transparent outline-none text-sm font-semibold text-neutral-800 placeholder-neutral-400" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-neutral-400 hover:text-[#e9204f] transition cursor-pointer">
                  {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
                </button>
              </div>
            </div>

            <div className="mt-4">
              <button type="submit" disabled={isLoading} className="primary-bg cursor-pointer w-full py-4 rounded-xl font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 flex items-center justify-center gap-2">
                {isLoading ? <span>Signing in...</span> : <span>Log in to Dashboard</span>}
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] bg-neutral-200 flex-1" />
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Or continue with</span>
            <div className="h-[1px] bg-neutral-200 flex-1" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-2 border border-neutral-200 hover:border-[#e9204f]/40 hover:bg-neutral-50 py-3 rounded-xl transition cursor-pointer" aria-label="Sign in with Google">
              <IoLogoGoogle size={18} className="text-neutral-700" />
            </button>
            <button className="flex items-center justify-center border border-neutral-200 hover:border-[#e9204f]/40 hover:bg-neutral-50 py-3 rounded-xl transition cursor-pointer font-extrabold text-xs text-neutral-700">YouCan</button>
            <button className="flex items-center justify-center border border-neutral-200 hover:border-[#e9204f]/40 hover:bg-neutral-50 py-3 rounded-xl transition cursor-pointer font-extrabold text-xs text-neutral-700">Storeino</button>
          </div>

          <div className="text-center text-xs font-semibold text-neutral-500 mt-4">
            Don&apos;t have an account? <Link href="/onboarding" className="font-bold text-[#e9204f] hover:underline">Sign up for free</Link>
          </div>
        </div>
      </section>
    </main>
  );
}