"use client";

import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter } from "react-icons/io5";

const logoFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
});

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="black-bg border-t border-white/5 pt-16 pb-12 text-neutral-400 text-sm relative overflow-hidden">
      
      {/* Tiny subtle background glow to match our other dark sections */}
      <div className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full bg-[#e9204f]/5 blur-[80px] pointer-events-none" />

      <div className="max-w-[1300px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* TOP ROW: Logo & Link Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-16">
          
          {/* COLUMN 1: Brand & Logo */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link 
              href="/" 
              className={`${logoFont.className} text-2xl font-bold tracking-tight text-white select-none`}
            >
              Tee<span className="primary-text">Private</span>
            </Link>
            <p className="max-w-xs text-xs md:text-sm text-neutral-500 font-medium leading-relaxed">
              Morocc&apos;s leading print-on-demand platform. We help you create, automate, and scale your merchandise without stock or upfront investments.
            </p>
          </div>

          {/* COLUMN 2: Navigation Links */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="text-white font-extrabold text-xs tracking-wider uppercase mb-2">Platform</h4>
            <Link href="#steps-section" className="hover:text-[#e9204f] transition font-medium text-xs sm:text-sm">How It Works</Link>
            <Link href="#" className="hover:text-[#e9204f] transition font-medium text-xs sm:text-sm">Catalog Preview</Link>
            <Link href="#" className="hover:text-[#e9204f] transition font-medium text-xs sm:text-sm">Profit Estimator</Link>
          </div>

          {/* COLUMN 3: Support & Legals */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <h4 className="text-white font-extrabold text-xs tracking-wider uppercase mb-2">Support</h4>
            <Link href="#" className="hover:text-[#e9204f] transition font-medium text-xs sm:text-sm">Contact Us</Link>
            <Link href="#" className="hover:text-[#e9204f] transition font-medium text-xs sm:text-sm">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#e9204f] transition font-medium text-xs sm:text-sm">Terms of Service</Link>
          </div>

          {/* COLUMN 4: Social Icons */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <h4 className="text-white font-extrabold text-xs tracking-wider uppercase mb-2">Connect</h4>
            <div className="flex gap-2.5">
              <Link 
                href="#" 
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#e9204f] hover:text-white text-neutral-300 transition duration-150"
                aria-label="Facebook"
              >
                <IoLogoFacebook size={18} />
              </Link>
              <Link 
                href="#" 
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#e9204f] hover:text-white text-neutral-300 transition duration-150"
                aria-label="Instagram"
              >
                <IoLogoInstagram size={18} />
              </Link>
              <Link 
                href="#" 
                className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#e9204f] hover:text-white text-neutral-300 transition duration-150"
                aria-label="Twitter"
              >
                <IoLogoTwitter size={18} />
              </Link>
            </div>
          </div>

        </div>

        {/* BOTTOM ROW: Copyright & Disclaimers */}
        <div className="h-[1px] bg-white/5 w-full mb-8" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-neutral-500">
          <p>© {currentYear} TeePrivate. All rights reserved.</p>
          <div className="flex gap-4">
            <p className="font-medium text-neutral-600">Built for domestic Moroccan dropshippers & global creators</p>
          </div>
        </div>

      </div>
    </footer>
  );
}