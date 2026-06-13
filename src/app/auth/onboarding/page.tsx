"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { 
  IoArrowForward, 
  IoArrowBack, 
  IoCheckmarkOutline,
  IoLogoGoogle,
  IoLogoTwitter,
  IoLogoFacebook,
  IoStorefrontOutline,
  IoWarningOutline
} from "react-icons/io5";
import { FaChevronRight } from "react-icons/fa";

const logoFont = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });
const supabase = createClient();

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [storeName, setStoreName] = useState("");
  const [userRole, setUserRole] = useState<"artist" | "builder" | null>(null);
  const [integration, setIntegration] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [creationStatus, setCreationStatus] = useState(0);
  const [isSuccessfullyCreated, setIsSuccessfullyCreated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // BROWSER-BASED TOKEN INTERCEPTOR (0 Database Queries) [1.2.6]
  useEffect(() => {
    const checkLocalSession = async () => {
      // Parse session locally from memory/browser storage [1.2.6]
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUserId(session.user.id);
        const status = session.user.user_metadata?.onboarding_status;
        
        if (status === "completed") {
          router.push("/u/dashboard");
        } else {
          // If logged-in but pending, instantly skip Step 1 and resume at Step 2 [1.1.4]
          setCurrentStep(2);
        }
      }
    };
    checkLocalSession();

    // Listen to Auth state events locally [1.2.6]
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session?.user) {
        setUserId(session.user.id);
        const status = session.user.user_metadata?.onboarding_status;
        
        if (status === "completed") {
          router.push("/u/dashboard");
        } else {
          setCurrentStep(2);
        }
      } else {
        setUserId(null);
        setCurrentStep(1); // Return to Step 1 if logged out
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSocialRegister = async (provider: "google" | "twitter" | "facebook") => {
    try {
      setErrorMessage(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { onboarding_status: "pending" }
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || "Social registration failed.");
    }
  };

  useEffect(() => {
    if (currentStep === 4 && userId) {
      const saveOnboardingDetails = async () => {
        try {
          setCreationStatus(1);

          // 1. Update User Metadata (Updates local browser JWT Token immediately) [1.2.6]
          const { error: authError } = await supabase.auth.updateUser({
            data: {
              store_name: storeName,
              user_role: userRole,
              integration: integration,
              onboarding_status: "completed",
            },
          });

          if (authError) throw authError;
          setCreationStatus(2);
          await new Promise((resolve) => setTimeout(resolve, 800));

          // 2. Write details to PostgreSQL profile [1.1.4]
          const { error: profileError } = await supabase
            .from("profiles")
            .update({
              store_name: storeName,
              user_role: userRole,
              integration: integration,
              onboarding_status: "completed",
            })
            .eq("id", userId);

          if (profileError) throw profileError;
          setCreationStatus(3);
          await new Promise((resolve) => setTimeout(resolve, 800));

          setCreationStatus(4);
          setIsSuccessfullyCreated(true);
          router.refresh(); // Refreshes Next.js server cookie context in background [1.1.8]
        } catch (err: unknown) {
          console.error(err);
          setErrorMessage((err as Error).message || "Fulfillment connection failed.");
          setCurrentStep(2);
        }
      };

      saveOnboardingDetails();
    }
  }, [currentStep, userId, router, storeName, userRole, integration]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 2 && currentStep < 4) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isStepValid = () => {
    if (currentStep === 2) {
      return storeName.trim().length >= 3 && userRole !== null;
    }
    if (currentStep === 3) {
      return integration !== null;
    }
    return true;
  };

  return (
    <main className="min-h-screen black-bg flex flex-col items-center justify-center p-6 md:p-12 relative text-white">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#e9204f]/5 blur-[120px] pointer-events-none" />

      <div className="mb-10 text-center z-10">
        <Link href="/" className={`${logoFont.className} text-3xl font-bold tracking-tight text-white select-none`}>
          Tee<span className="primary-text">Private</span>
        </Link>
      </div>

      <div className="w-full max-w-lg bg-white rounded-md border border-neutral-200/50 shadow-2xl p-8 md:p-12 text-black relative overflow-hidden z-10">
        {currentStep < 4 && (
          <div className="w-full h-1 bg-neutral-100 rounded-full mb-8 relative overflow-hidden">
            <motion.div
              initial={{ width: "33%" }}
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
              className="absolute inset-y-0 left-0 primary-bg rounded-full"
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div key="step-1" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="flex flex-col gap-5">
              <div>
                <h1 className="text-2xl font-black text-neutral-900 tracking-tight leading-tight mb-2">Create your account</h1>
                <p className="text-neutral-500 text-xs font-semibold leading-relaxed">Authenticate securely with a social network to begin setup.</p>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 text-xs font-bold p-4 rounded-md border border-red-100 leading-relaxed">
                  <span className="shrink-0"><IoWarningOutline size={16} /></span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex flex-col gap-3 mt-2">
                <button onClick={() => handleSocialRegister("google")} className="flex items-center justify-center gap-3 border border-neutral-200 hover:border-[#e9204f]/40 hover:bg-neutral-50 py-3.5 rounded-md transition cursor-pointer font-bold text-sm text-neutral-700">
                  <IoLogoGoogle size={18} className="text-neutral-700" />
                  <span>Register with Google</span>
                </button>
                <button onClick={() => handleSocialRegister("twitter")} className="flex items-center justify-center gap-3 border border-neutral-200 hover:border-[#e9204f]/40 hover:bg-neutral-50 py-3.5 rounded-md transition cursor-pointer font-bold text-sm text-neutral-700">
                  <IoLogoTwitter size={18} className="text-sky-500" />
                  <span>Register with X</span>
                </button>
                <button onClick={() => handleSocialRegister("facebook")} className="flex items-center justify-center gap-3 border border-neutral-200 hover:border-[#e9204f]/40 hover:bg-neutral-50 py-3.5 rounded-md transition cursor-pointer font-bold text-sm text-neutral-700">
                  <IoLogoFacebook size={18} className="text-blue-600" />
                  <span>Register with Facebook</span>
                </button>
              </div>

              <div className="text-center text-xs font-semibold text-neutral-500 mt-4">
                Already have an account? <Link href="/login" className="font-bold text-[#e9204f] hover:underline">Log in</Link>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.form key="step-2" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} onSubmit={handleNext} className="flex flex-col gap-5">
              <div>
                <h2 className="text-2xl font-black text-neutral-900 tracking-tight leading-tight mb-2">Verify your details</h2>
                <p className="text-neutral-500 text-xs font-semibold leading-relaxed">Establish your store brand and layout preferences [1].</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Store / Brand Name</label>
                <div className="relative flex items-center bg-neutral-50 border border-neutral-200 focus-within:border-[#e9204f]/40 rounded-md transition duration-150 p-1">
                  <div className="pl-3 text-neutral-400"><IoStorefrontOutline size={18} /></div>
                  <input type="text" required placeholder="My Brand Shop" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="w-full pl-2 pr-4 py-2 bg-transparent outline-none text-sm font-semibold text-neutral-800 placeholder-neutral-400" />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div onClick={() => setUserRole("artist")} className={`p-4 rounded-md border-2 cursor-pointer transition select-none ${userRole === "artist" ? "border-[#e9204f] bg-[#e9204f]/5" : "border-neutral-200 hover:border-neutral-300"}`}>
                  <h3 className="text-xs font-black text-neutral-800 mb-0.5">Start selling & building a brand</h3>
                  <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed">I want to sync products to my store and utilize automated fulfillment across Morocco.</p>
                </div>
                <div onClick={() => setUserRole("builder")} className={`p-4 rounded-md border-2 cursor-pointer transition select-none ${userRole === "builder" ? "border-[#e9204f] bg-[#e9204f]/5" : "border-neutral-200 hover:border-neutral-300"}`}>
                  <h3 className="text-xs font-black text-neutral-800 mb-0.5">Customize articles for myself</h3>
                  <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed">I want to craft premium custom hoodies, mugs, or gifts for personal use or local teams.</p>
                </div>
              </div>

              <button type="submit" disabled={!isStepValid()} className="primary-bg cursor-pointer w-full py-2.5 rounded-md font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 flex items-center justify-center gap-2">
                <span>Continue</span>
                <FaChevronRight size={13} className="bg-white primary-text rounded-full p-0.5" />
              </button>
            </motion.form>
          )}

          {currentStep === 3 && (
            <motion.div key="step-3" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-black text-neutral-900 tracking-tight leading-tight mb-2">Select your platform</h2>
                <p className="text-neutral-500 text-xs font-semibold leading-relaxed">Which e-commerce system do you want to connect?</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {["Shopify", "YouCan.shop", "Storeino", "WooCommerce", "Wix", "None / Custom"].map((platform) => (
                  <div key={platform} onClick={() => setIntegration(platform)} className={`p-4 rounded-md border-2 text-center font-bold text-xs cursor-pointer transition select-none flex items-center justify-center h-16 ${integration === platform ? "border-[#e9204f] bg-[#e9204f]/5 text-neutral-900" : "border-neutral-200 text-neutral-500 hover:border-neutral-300"}`}>{platform}</div>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button type="button" onClick={handleBack} className="w-14 py-3 rounded-md border border-neutral-200 hover:bg-neutral-50 flex items-center justify-center text-neutral-600 transition cursor-pointer"><IoArrowBack size={18} /></button>
                <button type="button" onClick={handleNext} disabled={!isStepValid()} className="primary-bg cursor-pointer w-full py-2.5 rounded-md font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 flex items-center justify-center gap-2">
                  <span>Build Dashboard</span>
                  <FaChevronRight size={13} className="bg-white primary-text rounded-full p-0.5" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div key="step-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-6">
              <AnimatePresence mode="wait">
                {!isSuccessfullyCreated ? (
                  <motion.div key="creating-loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-6">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full border-4 border-neutral-100" />
                      <div className="absolute inset-0 rounded-full border-4 border-[#e9204f] border-t-transparent animate-spin" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-neutral-900 mb-1">Activating account...</h2>
                      <p className="text-xs text-neutral-400 font-medium">Securing PostgreSQL profile nodes & refreshing local JWT token [1].</p>
                    </div>
                    <div className="flex flex-col items-start gap-2.5 bg-neutral-50 p-5 rounded-md border border-neutral-150 w-full max-w-[280px] text-xs font-bold text-neutral-500">
                      <div className="flex items-center gap-2"><span className={creationStatus >= 1 ? "text-emerald-500" : "text-neutral-300"}>✓</span><span className={creationStatus >= 1 ? "text-neutral-800" : "text-neutral-400"}>Verifying session token</span></div>
                      <div className="flex items-center gap-2"><span className={creationStatus >= 2 ? "text-emerald-500" : "text-neutral-300"}>✓</span><span className={creationStatus >= 2 ? "text-neutral-800" : "text-neutral-400"}>Saving profile metadata</span></div>
                      <div className="flex items-center gap-2"><span className={creationStatus >= 3 ? "text-emerald-500" : "text-neutral-300"}>✓</span><span className={creationStatus >= 3 ? "text-neutral-800" : "text-neutral-400"}>Refreshing JWT Claims</span></div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="success-celebration" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center"><IoCheckmarkOutline size={32} /></div>
                    <div>
                      <h2 className="text-2xl font-black text-neutral-900 mb-1">Your store is active!</h2>
                      <p className="text-xs text-neutral-400 font-medium">onboarding metadata has been safely written to your database profile.</p>
                    </div>
                    <div className="mt-4 w-full">
                      <Link href="/u/dashboard" className="primary-bg cursor-pointer w-full py-4 rounded-md font-bold text-sm shadow-md hover:shadow-lg transition duration-150 flex items-center justify-center gap-2">
                        <span>Launch Dashboard</span>
                        <IoArrowForward size={16} />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
