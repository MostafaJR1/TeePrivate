"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface CalculatorProduct {
  id: string;
  name: string;
  basePrice: number;
  recommendedPrice: number;
  minPrice: number;
  maxPrice: number;
  image: string;
}

const calculatorProducts: CalculatorProduct[] = [
  {
    id: "calc-1",
    name: "T-Shirts",
    basePrice: 9.25,
    recommendedPrice: 23.55,
    minPrice: 12.00,
    maxPrice: 45.00,
    image: "/HERO-3-TRANSPARENT.png",
  },
  {
    id: "calc-2",
    name: "Coffee Mugs",
    basePrice: 4.50,
    recommendedPrice: 15.00,
    minPrice: 6.00,
    maxPrice: 30.00,
    image: "/MUG-TRANSPARENT.png",
  },
  {
    id: "calc-3",
    name: "Hoodies",
    basePrice: 21.90,
    recommendedPrice: 49.95,
    minPrice: 26.00,
    maxPrice: 90.00,
    image: "/HOODIE-TRANSPARENT.png",
  },
  {
    id: "calc-4",
    name: "Phone Cases",
    basePrice: 9.15,
    recommendedPrice: 22.00,
    minPrice: 12.00,
    maxPrice: 40.00,
    image: "https://images.unsplash.com/photo-1580870013141-3b13c5100c15?w=600&auto=format&fit=crop&q=80",
  },
];

const USD_TO_MAD = 10;

export function ProfitCalculator() {
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const activeProduct = calculatorProducts[activeProductIndex];

  // Pricing & Currency states [1]
  const [currency, setCurrency] = useState<"USD" | "MAD">("MAD"); // Defaults to MAD for local Moroccan users [1]
  const [sellPriceUSD, setSellPriceUSD] = useState(activeProduct.recommendedPrice);
  const [salesPerDay, setSalesPerDay] = useState(5);

  // Sync pricing whenever the active product changes [1]
  useEffect(() => {
    setTimeout(() => {
      setSellPriceUSD(activeProduct.recommendedPrice);
    }, 300); // Small delay to allow for product image transition
  }, [activeProduct]);

  const convertFromUSD = (usdValue: number) => {
    return currency === "MAD" ? usdValue * USD_TO_MAD : usdValue;
  };

  const convertToUSD = (localValue: number) => {
    return currency === "MAD" ? localValue / USD_TO_MAD : localValue;
  };

  const formatCurrency = (valueInUSD: number) => {
    const localValue = convertFromUSD(valueInUSD);
    if (currency === "MAD") {
      return `${localValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH`;
    }
    return valueInUSD.toLocaleString("en-US", { style: "currency", currency: "USD" });
  };

  const profitPerSaleUSD = Math.max(0, sellPriceUSD - activeProduct.basePrice);
  const annualProfitUSD = profitPerSaleUSD * salesPerDay * 365;

  return (
    <section className="black-bg py-20 md:py-28 text-white relative overflow-hidden">
      
      {/* Background radial highlights */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-[#e9204f]/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#e9204f]/5 blur-[100px] pointer-events-none" />

      <div className="max-w-[1300px] mx-auto px-6 md:px-12">
        
        {/* HEADER & CURRENCY SWITCHER */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16 border-b border-white/5 pb-10">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
              Your passion really can pay
            </h2>
            <p className="text-neutral-400 font-medium text-sm md:text-base">
              Set your retail prices and calculate your potential store margins [1].
            </p>
          </div>

          {/* Minimal Currency Switcher Pill [1] */}
          <div className="inline-flex rounded-full bg-white/5 p-1 border border-white/10 backdrop-blur-sm select-none">
            <button
              onClick={() => setCurrency("MAD")}
              className={`relative rounded-full px-5 py-2 text-xs font-black uppercase tracking-wider transition-colors duration-300 cursor-pointer ${
                currency === "MAD" ? "text-[#1b1b1b]" : "text-neutral-400 hover:text-white"
              }`}
            >
              {currency === "MAD" && (
                <motion.span
                  layoutId="calcCurrencyBg"
                  className="absolute inset-0 bg-white rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <span className="relative z-10">MAD (DH)</span>
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`relative rounded-full px-5 py-2 text-xs font-black uppercase tracking-wider transition-colors duration-300 cursor-pointer ${
                currency === "USD" ? "text-[#1b1b1b]" : "text-neutral-400 hover:text-white"
              }`}
            >
              {currency === "USD" && (
                <motion.span
                  layoutId="calcCurrencyBg"
                  className="absolute inset-0 bg-white rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <span className="relative z-10">USD ($)</span>
            </button>
          </div>
        </div>

        {/* GLASSMORPHIC CALCULATOR CARD [1] */}
        <div className="bg-white/[0.02] border border-white/5 rounded-lg p-8 md:p-12 lg:p-14 backdrop-blur-md grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: Product Selection & Image Frame */}
          <div className="lg:col-span-6 flex flex-col items-center w-full">
            
            {/* Minimal Underline Text Tabs [1] */}
            <div className="flex flex-wrap justify-center gap-6 mb-10 border-b border-white/5 pb-4 w-full">
              {calculatorProducts.map((prod, idx) => (
                <button
                  key={prod.id}
                  onClick={() => setActiveProductIndex(idx)}
                  className={`relative pb-3 text-xs md:text-sm font-black uppercase tracking-widest transition cursor-pointer ${
                    activeProductIndex === idx ? "text-[#e9204f]" : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  {prod.name}
                  {activeProductIndex === idx && (
                    <motion.span
                      layoutId="calcActiveTabLine"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-[#e9204f]"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Glowing, transparent product image container [1] */}
            <div className="relative w-full aspect-square max-w-[340px] flex items-center justify-center p-6">
              {/* Inner ambient glow */}
              <div className="absolute inset-4 rounded-full bg-white/[0.02] blur-xl" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProduct.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={activeProduct.image}
                    alt={activeProduct.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* RIGHT: Metric Sliders & Dynamic Output */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            
            {/* Sliders Area (Removed nested cards, designed with clean open layouts) [1] */}
            <div className="flex flex-col gap-6">
              
              {/* Sell Price Slider [1] */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">You sell for</span>
                  <div className="flex items-center gap-1 border-b border-white/15 pb-0.5 focus-within:border-[#e9204f]/60 transition">
                    <input
                      type="number"
                      value={Math.round(convertFromUSD(sellPriceUSD))}
                      min={Math.round(convertFromUSD(activeProduct.minPrice))}
                      max={Math.round(convertFromUSD(activeProduct.maxPrice))}
                      step="1"
                      onChange={(e) => {
                        const localVal = Number(e.target.value);
                        setSellPriceUSD(Math.max(activeProduct.basePrice, convertToUSD(localVal)));
                      }}
                      className="w-16 bg-transparent text-right font-black outline-none text-white text-sm pr-1"
                    />
                    <span className="text-[10px] font-black text-neutral-500 uppercase">{currency === "MAD" ? "DH" : "USD"}</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={activeProduct.minPrice}
                  max={activeProduct.maxPrice}
                  step="0.10"
                  value={sellPriceUSD}
                  onChange={(e) => setSellPriceUSD(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#e9204f]"
                />
                <span className="text-[9px] font-extrabold tracking-wide uppercase text-neutral-500">
                  Recommended retail: {formatCurrency(activeProduct.recommendedPrice)}
                </span>
              </div>

              {/* Volume Slider [1] */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">Sales per day</span>
                  <div className="border-b border-white/15 pb-0.5 focus-within:border-[#e9204f]/60 transition">
                    <input
                      type="number"
                      value={salesPerDay}
                      min="1"
                      max="100"
                      onChange={(e) => setSalesPerDay(Math.max(1, Number(e.target.value)))}
                      className="w-10 bg-transparent text-right font-black outline-none text-white text-sm"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={salesPerDay}
                  onChange={(e) => setSalesPerDay(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#e9204f]"
                />
              </div>

            </div>

            {/* Flat Cost & Margins Inline Status Strip [1] */}
            <div className="flex flex-wrap gap-4 text-xs font-bold text-neutral-500 border-t border-white/5 pt-6 justify-between items-center">
              <div className="flex gap-2 items-center">
                <span className="uppercase tracking-widest text-[9px] font-black text-neutral-500">Cost:</span>
                <span className="text-neutral-300 font-extrabold">{formatCurrency(activeProduct.basePrice)}</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="uppercase tracking-widest text-[9px] font-black text-neutral-500">Your margin:</span>
                <span className="text-emerald-500 font-extrabold">+{formatCurrency(profitPerSaleUSD)} /item</span>
              </div>
            </div>

            {/* Dynamic Profit Output (Unboxed, bold hero sizing) [1] */}
            <div className="flex flex-col leading-none mt-2">
              <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-2.5">
                Your approximate annual profit
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${currency}-${annualProfitUSD}`}
                  initial={{ scale: 0.98, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 14 }}
                  className="text-4xl md:text-6xl font-black tracking-tight text-white"
                >
                  {formatCurrency(annualProfitUSD)}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Action Button */}
            <div className="mt-2">
              <button className="primary-bg cursor-pointer w-full py-4 rounded-full font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition duration-150 text-center">
                Start selling
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}