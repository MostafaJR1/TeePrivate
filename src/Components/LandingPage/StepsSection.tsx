"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface Step {
  number: string;
  title: string;
  description: string;
  visualMockup: React.ReactNode;
}

export function StepsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const steps: Step[] = [
    {
      number: "1/5",
      title: "Design your products",
      description:
        "Bring your creative ideas to life on hundreds of premium customizable products. Quickly upload your custom artwork or build a fresh mockup design right on our canvas.",
      visualMockup: (
        <div className="grid grid-cols-2 gap-3 p-5 bg-teal-500/10 rounded-2xl border border-teal-500/20 h-full items-center">
          <div className="bg-white p-3 rounded-xl shadow-sm text-center flex flex-col items-center">
            <span className="text-xl sm:text-2xl">👕</span>
            <span className="text-[10px] font-bold text-neutral-800 mt-1">Premium Tee</span>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm text-center flex flex-col items-center border-2 border-[#e9204f]">
            <span className="text-xl sm:text-2xl">🧢</span>
            <span className="text-[10px] font-bold text-neutral-800 mt-1">Retro Cap</span>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm text-center flex flex-col items-center">
            <span className="text-xl sm:text-2xl">☕</span>
            <span className="text-[10px] font-bold text-neutral-800 mt-1">Ceramic Mug</span>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm text-center flex flex-col items-center">
            <span className="text-xl sm:text-2xl">🎒</span>
            <span className="text-[10px] font-bold text-neutral-800 mt-1">Backpack</span>
          </div>
        </div>
      ),
    },
    {
      number: "2/5",
      title: "Connect your online store",
      description:
        "Instantly sync TeePrivate to your favorite e-commerce platforms like Shopify, Etsy, WooCommerce, or Wix in just a few simple clicks.",
      visualMockup: (
        <div className="flex flex-col gap-2.5 justify-center p-5 bg-sky-500/10 rounded-2xl border border-sky-500/20 h-full">
          <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
            <span className="text-xs font-bold text-neutral-800">Shopify Integration</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Connected</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
            <span className="text-xs font-bold text-neutral-800">Etsy Storefront</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Connected</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm opacity-50">
            <span className="text-xs font-bold text-neutral-800">WooCommerce</span>
            <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-bold">Pending</span>
          </div>
        </div>
      ),
    },
    {
      number: "3/5",
      title: "Set your pricing margins",
      description:
        "You retain complete control over your final retail margins. We only charge you for the flat production cost, leaving the rest of the profit directly in your pockets.",
      visualMockup: (
        <div className="flex flex-col justify-center gap-4 p-5 bg-rose-500/10 rounded-2xl border border-rose-500/20 h-full">
          <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-2">
            <div className="flex justify-between text-xs font-bold text-neutral-500">
              <span>Production Cost</span>
              <span>$12.50</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-neutral-800">
              <span>Your Retail Price</span>
              <span className="text-[#e9204f]">$28.00</span>
            </div>
            <div className="h-[2px] bg-neutral-100 my-1" />
            <div className="flex justify-between text-xs font-black text-emerald-600">
              <span>Your Net Profit Margin</span>
              <span>+ $15.50</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: "4/5",
      title: "Publish & launch",
      description:
        "Once synced, your decorated mockup listings populate your store immediately. They are live, automated, and ready for your audience to order instantly.",
      visualMockup: (
        <div className="flex flex-col justify-center items-center p-5 bg-amber-500/10 rounded-2xl border border-amber-500/20 h-full text-center">
          <div className="bg-white p-5 rounded-2xl shadow-md w-full max-w-[180px]">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-3">
              🚀
            </div>
            <p className="text-xs font-extrabold text-neutral-800">Synced to Cloud</p>
            <p className="text-[10px] text-neutral-400 mt-1">Catalog Live</p>
          </div>
        </div>
      ),
    },
    {
      number: "5/5",
      title: "Hands-off fulfillment",
      description:
        "Whenever an order rolls in, our centers print, package, and ship the product directly to your buyer under your own branding. You don't lift a finger.",
      visualMockup: (
        <div className="flex flex-col justify-center gap-3 p-5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 h-full">
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <span className="text-3xl">📦</span>
            <p className="text-xs font-bold text-neutral-800 mt-2">Order Automatically Dispatched</p>
            <p className="text-[10px] text-neutral-400 mt-1">Tracking ID: #TP-84920</p>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <section id="steps-section" className="black-bg py-20 md:py-28 text-white overflow-hidden relative">
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#e9204f]/5 blur-[120px] pointer-events-none" />

      <div className="w-full">
        {/* HEADER */}
        <div className="text-center px-6 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4 max-w-3xl mx-auto"
          >
            Take the leap and start building your iconic brand today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-neutral-400 font-medium text-sm md:text-base"
          >
            Get your store up and running within an hour.
          </motion.p>
        </div>

        {/* CENTERED FRAME CAROUSEL */}
        {/* Bounding box matches exact active card width (850px). overflow-visible shows surrounding cards peeking on the left and right. */}
        <div className="relative w-full max-w-[850px] mx-auto overflow-visible px-6 md:px-0">
          <motion.div
            animate={{ x: `calc(-${currentIndex * 100}% - ${currentIndex * 24}px)` }}
            transition={{ type: "spring", stiffness: 180, damping: 24 }}
            className="flex gap-6 w-full"
          >
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`w-full flex-shrink-0 transition-opacity duration-300 ${
                  currentIndex === idx ? "opacity-100" : "opacity-30"
                }`}
              >
                {/* CARD BODY */}
                <div className="bg-white rounded-3xl p-8 md:p-12 min-h-[460px] md:min-h-[350px] grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-black shadow-xl">
                  {/* LEFT: Copy */}
                  <div className="md:col-span-7 flex flex-col justify-center">
                    <span className="inline-flex items-center justify-center border border-neutral-200 text-neutral-500 rounded-full px-4 py-1 text-xs font-extrabold max-w-max mb-6">
                      {step.number}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight leading-tight mb-4">
                      {step.title}
                    </h3>
                    <p className="text-neutral-500 text-sm md:text-base leading-relaxed max-w-md">
                      {step.description}
                    </p>
                  </div>

                  {/* RIGHT: Visual Mockup */}
                  <div className="md:col-span-5 h-[210px] w-full">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="h-full w-full"
                      >
                        {step.visualMockup}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* DOTS & BUTTON CONTROLS */}
        <div className="flex items-center justify-center gap-4 mt-12 px-6">
          {/* Back Arrow */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center transition cursor-pointer ${
              currentIndex === 0
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-white hover:text-black border-white"
            }`}
            aria-label="Previous step"
          >
            <IoChevronBack size={18} />
          </button>

          {/* Dots Indicator (Matches exact slide index position) */}
          <div className="flex gap-2.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx ? "w-8 primary-bg" : "w-2 bg-neutral-700 hover:bg-neutral-500"
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            disabled={currentIndex === steps.length - 1}
            className={`w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center transition cursor-pointer ${
              currentIndex === steps.length - 1
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-white hover:text-black border-white"
            }`}
            aria-label="Next step"
          >
            <IoChevronForward size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}