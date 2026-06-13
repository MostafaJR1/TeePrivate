"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client"; // Browser client helper
import { 
  IoMailOutline, 
  IoLockClosedOutline, 
  IoEyeOutline, 
  IoEyeOffOutline,
  IoWarningOutline
} from "react-icons/io5";
import { FaChevronRight } from "react-icons/fa";
import Image from "next/image";

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
      // 1. Authenticate against Supabase [1.2.6]
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      // 2. Force Next.js to pull the fresh cookie and route cleanly [1.1.8]
      router.refresh(); 
      setTimeout(() => {
        // Redirects directly to private workspace [1.1.4]
        router.push("/u/dashboard"); 
      }, 100);

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
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white text-black">
      {/* Brand presentation column (Desktop) */}
      <section className="hidden lg:flex lg:col-span-5 black-bg relative justify-center items-center p-12 overflow-hidden border-r border-white/5">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#e9204f]/5 blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
            <Link href="/" className={`flex items-center gap-3 text-2xl font-bold tracking-tight text-white select-none z-10`}>
            <Image
              src="/TeeDrop-Logo.png"
              alt="Login Illustration"
              width={60}
              height={60}
              className="mx-auto"
            />
              <div>Tee<span className="primary-text">Private</span></div>
            </Link>
      </section>

      {/* Form column */}
      <section className="flex black-bg lg:col-span-7 items-center justify-center p-3 md:p-6 relative bg-white">
        <div className="w-full max-w-[420px] bg-white text-center py-6 px-10 rounded-md flex flex-col gap-8">
          <div>
            <Image
              src="/TeeDrop-Logo.png"
              alt="Login Illustration"
              width={50}
              height={50}
              className="mx-auto mb-3"
            />
            <h1 className="text-3xl font-black black-text tracking-tight mb-1">Welcome back</h1>
            <p className="text-neutral-500 text-sm font-medium leading-relaxed">Log in to your TeePrivate dashboard.</p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center justify-center w-full gap-1.5">
              <button onClick={handleGoogleLogin} className="w-full shadow flex items-center justify-center gap-2 border border-neutral-300 hover:bg-neutral-500/10 hover py-2 rounded-md transition cursor-pointer" aria-label="Sign in with Google">
                <Image src="/Google-Logo.png" alt="Google Logo" width={18} height={18} className="text-neutral-700" /> <span className="text-sm text-neutral-600">Continue with Google</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] bg-neutral-200 flex-1" />
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Or continue with</span>
              <div className="h-[1px] bg-neutral-200 flex-1" />
            </div>
          </div>

          <AnimatePresence>
            {errorMessage && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2 bg-red-50 text-red-700 text-xs font-bold p-4 rounded-xl border border-red-100 leading-relaxed">
                <span className="shrink-0"><IoWarningOutline size={16} /></span>
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="text-start flex flex-col gap-2.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Email Address</label>
              <div className="relative flex items-center border border-neutral-300 focus-within:border-[#e9204f]/40 rounded-md transition duration-150 p-1">
                <div className="pl-2 text-neutral-400"><IoMailOutline size={16} /></div>
                <input type="email" required placeholder="name@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} 
                className="w-full pl-2 pr-4 py-1.5 bg-transparent outline-none text-sm font-semibold text-neutral-800 placeholder-neutral-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Password</label>
              <div className="relative flex items-center border border-neutral-300 focus-within:border-[#e9204f]/40 rounded-md transition duration-150 p-1">
                <div className="pl-2 text-neutral-400"><IoLockClosedOutline size={16} /></div>
                <input type={showPassword ? "text" : "password"} required placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-2 pr-10 py-1.5 bg-transparent outline-none text-sm font-semibold text-neutral-800 placeholder-neutral-400" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-neutral-400 hover:text-[#e9204f] transition cursor-pointer">
                  {showPassword ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
                </button>
              </div>
            </div>

            <div>
              <button type="submit" disabled={isLoading} className="primary-bg cursor-pointer w-full py-2.5 rounded-md font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 flex items-center justify-center gap-2">
                {isLoading ? <span>Signing in...</span> : <span className="flex items-center gap-2">Log in <FaChevronRight size={13} className="bg-white primary-text rounded-full p-0.5"/></span>}
              </button>
            </div>
          </form>

          <div className="text-center text-xs font-semibold text-neutral-500">
            Don&apos;t have an account? <Link href="/auth/onboarding" className="font-bold text-[#e9204f] hover:underline">Sign up for free</Link>
          </div>
        </div>
      </section>
    </main>
  );
}