"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import { LuMenu } from "react-icons/lu";
import { Space_Grotesk } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";

const logoFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
});

export function PublicHeader() {
  const [isSticky, setIsSticky] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Monitor scrolling to morph header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 680) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard accessibility: Escape closes search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-focus input when search modal opens [1]
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 80);
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
    }
  };

  const handlePopularTagClick = (tag: string) => {
    setSearchQuery(tag);
    searchInputRef.current?.focus();
  };

  // Safe offset scroller for sidebar links (closes menu first, then scrolls smoothly) [1]
  const handleScrollToSection = (elementId: string) => {
    setIsSidebarOpen(false);
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        const headerOffset = 85; // Offsets the height of our fixed sticky header [1]
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 350); // Tiny delay to let the sidebar closing animation finish smoothly
  };

  return (
    <>
      {/* 1. STRUCTURAL HEADER CARD */}
      <div className="fixed top-0 left-0 w-full z-40 flex justify-center pointer-events-none transition-all duration-500">
        <div
          className={`bg-white/75 backdrop-blur-[2px] flex items-center justify-between gap-4 pointer-events-auto transition-all duration-500 ease-in-out ${
            isSticky
              ? "w-[95%] sm:w-auto max-w-md md:max-w-lg px-5 mt-1.5 py-1.5 rounded-full border border-neutral-200/50 shadow-xl shadow-black/5"
              : "w-full max-w-[1300px] px-6 md:px-12 py-1.5 bg-transparent border-b border-transparent shadow-none"
          }`}
        >
          
          {/* LEFT: Menu Toggle & Logo */}
          <div className="flex items-center gap-4">
            <div
              className={`transition-all duration-500 overflow-hidden flex items-center ${
                isSticky ? "w-0 h-0 opacity-0 pointer-events-none" : "w-10 opacity-100"
              }`}
            >
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-full text-neutral-800 hover:text-[#e9204f] hover:bg-black/5 transition duration-200 cursor-pointer"
                aria-label="Open menu"
              >
                <LuMenu size={22} />
              </button>
            </div>

            <Link 
              href="/" 
              className={`${logoFont.className} transition-all duration-500 font-bold tracking-tight black-text select-none ${
                isSticky ? "text-lg" : "text-2xl"
              }`}
            >
              Tee<span className="primary-text">Private</span>
            </Link>

            {/* Compact Search Button (appears when sticky) [1] */}
            <div
              className={`transition-all duration-500 items-center ${
                isSticky ? "w-9 opacity-100 flex" : "w-0 opacity-0 hidden pointer-events-none"
              }`}
            >
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full text-neutral-600 hover:text-[#e9204f] hover:bg-neutral-100/80 transition duration-150 cursor-pointer flex items-center justify-center"
                aria-label="Search"
              >
                <IoSearchOutline size={18} />
              </button>
            </div>
          </div>

          {/* MIDDLE: Search Box Wrapper */}
          <div
            className={`flex-1 justify-center transition-all duration-500 ${
              isSticky ? "w-0 h-0 opacity-0 hidden pointer-events-none" : "hidden md:flex max-w-md"
            }`}
          >
            <div 
              onClick={() => setIsSearchOpen(true)}
              className="w-full bg-white/80 backdrop-blur-[1px] hover:bg-white border border-neutral-200 rounded-full overflow-hidden items-center p-1 shadow-sm flex cursor-pointer select-none"
            >
              <span className="w-full pl-5 pr-3 py-1.5 text-sm text-neutral-400 font-medium text-left">
                Search templates, designs, products...
              </span>
              <button className="primary-bg cursor-pointer p-2.5 rounded-full flex items-center justify-center">
                <IoSearchOutline size={16} className="text-white" />
              </button>
            </div>
          </div>

          {/* RIGHT: Auth Controls */}
          <div className="flex items-center gap-1.5">
            <Link href="/auth/login"
              className={`font-semibold text-neutral-700 hover:text-[#e9204f] transition-all duration-500 cursor-pointer ${
                isSticky 
                  ? "px-3 py-1.5 text-xs" 
                  : "px-5 py-2 text-sm rounded-full"
              }`}
            >
              Login
            </Link>
            <button
              className={`font-semibold primary-bg hover:shadow-md transition-all duration-500 cursor-pointer ${
                isSticky 
                  ? "px-4 py-1.5 text-xs rounded-full" 
                  : "px-5 py-2 text-sm rounded-full"
              }`}
            >
              Sign up
            </button>
          </div>

        </div>
      </div>

      {/* 2. GLOBAL SEARCH OVERLAY MODAL */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1b1b1b]/85 backdrop-blur-[2px] flex items-start justify-center pt-24 px-6 pointer-events-auto"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -30, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -30, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl border border-neutral-200/50 shadow-2xl flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-neutral-50 border border-neutral-200 focus-within:border-[#e9204f]/40 rounded-full p-1.5 transition duration-150">
                <div className="pl-4 text-neutral-400">
                  <IoSearchOutline size={18} />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search templates, designs, products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-4 py-2 bg-transparent outline-none text-base font-medium text-neutral-800 placeholder-neutral-400"
                />
                <div className="flex items-center gap-2 pr-2">
                  <span className="hidden sm:inline-block text-[10px] font-extrabold text-neutral-400 border border-neutral-200 px-2 py-1 rounded-md uppercase">
                    Esc
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-600 transition cursor-pointer"
                  >
                    <IoCloseOutline size={20} />
                  </button>
                </div>
              </form>

              <div>
                <span className="block text-xs font-black tracking-wider text-neutral-400 uppercase mb-3">
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {["Summer Tees", "Heavy Hoodies", "Custom Mugs", "Moroccan Sahara Designs", "Totebags"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handlePopularTagClick(tag)}
                      className="px-4 py-2 rounded-full border border-neutral-200 hover:border-[#e9204f] hover:text-[#e9204f] bg-white transition duration-150 text-xs font-bold text-neutral-600 cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. ACTIVE SIDE MENU DRAWER (Mobile Navigation) [1] */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Dark blurred background backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-50 bg-[#1b1b1b]/60 backdrop-blur-[1px] pointer-events-auto"
            />

            {/* Sidebar Slide-out Panel [1] */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 w-full max-w-[320px] bg-[#1b1b1b] text-white z-50 p-6 flex flex-col justify-between shadow-2xl pointer-events-auto"
            >
              <div>
                {/* Header (Logo & Close Button) */}
                <div className="flex items-center justify-between mb-10">
                  <Link 
                    href="/" 
                    onClick={() => setIsSidebarOpen(false)}
                    className={`${logoFont.className} text-xl font-bold tracking-tight text-white select-none`}
                  >
                    Tee<span className="primary-text">Private</span>
                  </Link>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1.5 rounded-full bg-white/5 text-neutral-300 hover:bg-[#e9204f] hover:text-white transition duration-150 cursor-pointer"
                    aria-label="Close menu"
                  >
                    <IoCloseOutline size={20} />
                  </button>
                </div>

                {/* Navigation Links with offset smooth scrolling [1] */}
                <nav className="flex flex-col gap-1">
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-full text-left py-3 px-4 rounded-xl hover:bg-white/5 hover:text-[#e9204f] font-bold text-sm transition duration-150 cursor-pointer"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => handleScrollToSection("steps-section")}
                    className="w-full text-left py-3 px-4 rounded-xl hover:bg-white/5 hover:text-[#e9204f] font-bold text-sm transition duration-150 cursor-pointer"
                  >
                    How it Works
                  </button>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-full text-left py-3 px-4 rounded-xl hover:bg-white/5 hover:text-[#e9204f] font-bold text-sm transition duration-150 cursor-pointer"
                  >
                    Catalog Preview
                  </button>
                  <button
                    onClick={() => handleScrollToSection("steps-section")} // Can map to specific IDs once rendered
                    className="w-full text-left py-3 px-4 rounded-xl hover:bg-white/5 hover:text-[#e9204f] font-bold text-sm transition duration-150 cursor-pointer"
                  >
                    Profit Calculator
                  </button>
                  <button
                    onClick={() => handleScrollToSection("steps-section")} // Can map to specific IDs once rendered
                    className="w-full text-left py-3 px-4 rounded-xl hover:bg-white/5 hover:text-[#e9204f] font-bold text-sm transition duration-150 cursor-pointer"
                  >
                    Fulfillment Network
                  </button>
                </nav>
              </div>

              {/* Bottom Auth Controls & Brand Label [1] */}
              <div className="flex flex-col gap-4 mt-8">
                <div className="h-[1px] bg-white/5 w-full" />
                <div className="flex flex-col gap-2">
                  <Link href="/auth/login" className="w-full flex justify-center py-3 rounded-xl border border-white/10 text-neutral-300 font-bold text-xs hover:border-[#e9204f] hover:text-[#e9204f] transition duration-150 cursor-pointer">
                    Log in
                  </Link>
                  <button className="w-full py-3 rounded-xl primary-bg font-bold text-xs shadow-md transition duration-150 cursor-pointer">
                    Sign up
                  </button>
                </div>
                <p className="text-[10px] text-neutral-600 text-center font-semibold uppercase tracking-wider">
                  TeePrivate Morocco
                </p>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}