"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import { motion } from "framer-motion";
import { 
  IoMailOutline, 
  IoLockClosedOutline, 
  IoEyeOutline, 
  IoEyeOffOutline,
  IoLogoGoogle 
} from "react-icons/io5";

const logoFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login authentication delay
    setTimeout(() => {
      setIsLoading(false);
      alert("Mock authentication successful!");
    }, 1500);
  };

  // Motion variants for stagger entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
    },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white text-black font-sans">
      
      {/* LEFT COLUMN: Brand Presentation (Visible on Desktop) [1] */}
      <section className="hidden lg:flex lg:col-span-5 black-bg relative flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#e9204f]/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#e9204f]/5 blur-[100px] pointer-events-none" />
        
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        {/* Brand Logo */}
        <Link 
          href="/" 
          className={`${logoFont.className} text-2xl font-bold tracking-tight text-white select-none z-10`}
        >
          Tee<span className="primary-text">Private</span>
        </Link>

        {/* Value Proposition */}
        <div className="z-10 flex flex-col gap-5 max-w-sm">
          <span className="text-xs font-black tracking-widest text-[#e9204f] uppercase">
            Morocco&apos;s Leading COD & POD Platform
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            Connect, Print, and Automate
          </h2>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-medium">
            Zero upfront risk, fast nationwide delivery, and same-day COD cashouts. Let us handle production and logistics while you scale your marketing.
          </p>
        </div>

        {/* Mini Footer */}
        <div className="z-10 text-xs font-bold text-neutral-600 uppercase tracking-widest">
          © {new Date().getFullYear()} TeePrivate Morocco
        </div>
      </section>

      {/* RIGHT COLUMN: Interactive Login Form [1] */}
      <section className="flex lg:col-span-7 items-center justify-center p-6 md:p-12 lg:p-16 relative bg-white">
        
        {/* Tiny logo visible ONLY on mobile (where left column is hidden) */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link 
            href="/" 
            className={`${logoFont.className} text-xl font-bold tracking-tight black-text select-none`}
          >
            Tee<span className="primary-text">Private</span>
          </Link>
        </div>

        {/* Staggered form wrapper */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[420px] flex flex-col gap-8"
        >
          
          {/* Form Header */}
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-neutral-500 text-sm font-medium leading-relaxed">
              Log in to your TeePrivate dashboard to manage custom designs and track local shipping metrics.
            </p>
          </motion.div>

          {/* Actual Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Email Input */}
            <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-neutral-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative flex items-center bg-neutral-50 border border-neutral-200 focus-within:border-[#e9204f]/40 rounded-xl transition duration-150 p-1">
                <div className="pl-3 text-neutral-400">
                  <IoMailOutline size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-3 pr-4 py-2.5 bg-transparent outline-none text-sm font-medium text-neutral-800 placeholder-neutral-400"
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-neutral-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative flex items-center bg-neutral-50 border border-neutral-200 focus-within:border-[#e9204f]/40 rounded-xl transition duration-150 p-1">
                <div className="pl-3 text-neutral-400">
                  <IoLockClosedOutline size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 bg-transparent outline-none text-sm font-medium text-neutral-800 placeholder-neutral-400"
                />
                {/* Toggle Password Visibility */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-neutral-400 hover:text-[#e9204f] transition cursor-pointer"
                >
                  {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
                </button>
              </div>
            </motion.div>

            {/* Remember Me & Forgot Password rows */}
            <motion.div variants={itemVariants} className="flex items-center justify-between mt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none font-bold text-neutral-500">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-[#e9204f] focus:ring-[#e9204f]/20 cursor-pointer accent-[#e9204f]"
                />
                <span>Remember me</span>
              </label>
              <Link 
                href="/forgot-password" 
                className="font-bold text-[#e9204f] hover:underline"
              >
                Forgot password?
              </Link>
            </motion.div>

            {/* Submit Action Button */}
            <motion.div variants={itemVariants} className="mt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="primary-bg cursor-pointer w-full py-4 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Log in to Dashboard</span>
                )}
              </button>
            </motion.div>

          </form>

          {/* Separator */}
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-3">
            <div className="h-[1px] bg-neutral-200 flex-1" />
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Or continue with</span>
            <div className="h-[1px] bg-neutral-200 flex-1" />
          </motion.div>

          {/* THIRD PARTY SIGN-INS (Includes Moroccan e-commerce giants) */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
            <button className="flex items-center justify-center gap-2 border border-neutral-200 hover:border-[#e9204f]/40 hover:bg-neutral-50 py-3 rounded-xl transition cursor-pointer" aria-label="Sign in with Google">
              <IoLogoGoogle size={18} className="text-neutral-700" />
            </button>
            {/* YouCan Platform Integration Sign-in (Local Moroccan focus) */}
            <button className="flex items-center justify-center border border-neutral-200 hover:border-[#e9204f]/40 hover:bg-neutral-50 py-3 rounded-xl transition cursor-pointer font-extrabold text-xs text-neutral-700">
              YouCan
            </button>
            {/* Storeino Platform Integration Sign-in (Local Moroccan focus) */}
            <button className="flex items-center justify-center border border-neutral-200 hover:border-[#e9204f]/40 hover:bg-neutral-50 py-3 rounded-xl transition cursor-pointer font-extrabold text-xs text-neutral-700">
              Storeino
            </button>
          </motion.div>

          {/* Navigation to Sign up */}
          <motion.div variants={itemVariants} className="text-center text-xs font-semibold text-neutral-500 mt-4">
            Don&apos;t have an account?{" "}
            <Link 
              href="/register" 
              className="font-bold text-[#e9204f] hover:underline"
            >
              Sign up for free
            </Link>
          </motion.div>

        </motion.div>
      </section>

    </main>
  );
}