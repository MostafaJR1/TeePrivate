"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

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
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "calc-2",
    name: "Coffee Mugs",
    basePrice: 4.50,
    recommendedPrice: 15.00,
    minPrice: 6.00,
    maxPrice: 30.00,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "calc-3",
    name: "Hoodies",
    basePrice: 21.90,
    recommendedPrice: 49.95,
    minPrice: 26.00,
    maxPrice: 90.00,
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
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

export function ProfitCalculator() {
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const activeProduct = calculatorProducts[activeProductIndex];

  // Pricing & volume states
  const [sellPrice, setSellPrice] = useState(activeProduct.recommendedPrice);
  const [salesPerDay, setSalesPerDay] = useState(5);

  // Sync pricing configuration whenever the active product changes
  useEffect(() => {
    setTimeout(() =>     setSellPrice(activeProduct.recommendedPrice), 0); // Reset sales per day with a slight delay for UX smoothness
  }, [activeProduct]);

  const handleNextProduct = () => {
    setActiveProductIndex((prev) => (prev + 1) % calculatorProducts.length);
  };

  const handlePrevProduct = () => {
    setActiveProductIndex((prev) => (prev - 1 + calculatorProducts.length) % calculatorProducts.length);
  };

  // Math: Profit Per Sale * Daily Sales * Days in a Year
  const profitPerSale = Math.max(0, sellPrice - activeProduct.basePrice);
  const annualProfit = profitPerSale * salesPerDay * 365;

  return (
    <section className="black-bg py-20 md:py-28 text-white relative overflow-hidden">
      
      {/* Background accents */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-[#e9204f]/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#e9204f]/5 blur-[100px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black tracking-tight mb-4"
          >
            Your passion really can pay
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-neutral-400 font-medium text-sm md:text-base"
          >
            See how much you could make
          </motion.p>
        </div>

        {/* CALCULATOR INTERFACE */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 lg:p-16 text-black grid grid-cols-1 lg:grid-cols-12 gap-12 items-center shadow-xl">
          
          {/* LEFT: Product Mockup & Selector */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* Product Cycling Menu */}
            <div className="flex items-center gap-6 mb-8 w-full justify-between max-w-[340px]">
              <button
                onClick={handlePrevProduct}
                className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 hover:border-neutral-300 transition cursor-pointer"
                aria-label="Previous product"
              >
                <IoChevronBack size={18} className="text-neutral-600" />
              </button>

              <h3 className="text-xl font-black tracking-tight text-neutral-800 text-center flex-1">
                {activeProduct.name}
              </h3>

              <button
                onClick={handleNextProduct}
                className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 hover:border-neutral-300 transition cursor-pointer"
                aria-label="Next product"
              >
                <IoChevronForward size={18} className="text-neutral-600" />
              </button>
            </div>

            {/* Product Image Frame */}
            <div className="relative w-full aspect-square max-w-[360px] bg-neutral-50 rounded-3xl border border-neutral-100 overflow-hidden shadow-inner flex items-center justify-center">
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
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* RIGHT: Slider Metrics & Calculation [1] */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            
            {/* Row 1: Flat Cost (Disabled metric) [1] */}
            <div className="flex justify-between items-center bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
              <span className="text-sm font-bold text-neutral-500">You buy for</span>
              <div className="text-right">
                <span className="text-[10px] font-bold text-neutral-400 mr-1.5 uppercase">Starting from</span>
                <span className="text-base font-black text-neutral-800">${activeProduct.basePrice.toFixed(2)}*</span>
              </div>
            </div>

            {/* Row 2: Sell Price Slider [1] */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-neutral-500">You sell for</span>
                <div className="flex items-center gap-1.5 border border-neutral-200 rounded-lg px-3 py-1.5 bg-neutral-50">
                  <span className="text-xs font-bold text-neutral-400">$</span>
                  <input
                    type="number"
                    value={sellPrice}
                    min={activeProduct.minPrice}
                    max={activeProduct.maxPrice}
                    step="0.5"
                    onChange={(e) => setSellPrice(Math.max(activeProduct.basePrice, Number(e.target.value)))}
                    className="w-16 bg-transparent text-sm font-extrabold outline-none text-neutral-800 text-right"
                  />
                </div>
              </div>
              <input
                type="range"
                min={activeProduct.minPrice}
                max={activeProduct.maxPrice}
                step="0.10"
                value={sellPrice}
                onChange={(e) => setSellPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-[#e9204f]"
              />
              <span className="text-[10px] font-black tracking-wide uppercase text-[#e9204f] mt-1 block">
                Recommended Price: ${activeProduct.recommendedPrice.toFixed(2)}
              </span>
            </div>

            {/* Row 3: Volume Slider [1] */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-neutral-500">Sales per day</span>
                <div className="border border-neutral-200 rounded-lg px-4 py-1.5 bg-neutral-50">
                  <input
                    type="number"
                    value={salesPerDay}
                    min="1"
                    max="100"
                    onChange={(e) => setSalesPerDay(Math.max(1, Number(e.target.value)))}
                    className="w-10 bg-transparent text-sm font-extrabold outline-none text-neutral-800 text-right"
                  />
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={salesPerDay}
                onChange={(e) => setSalesPerDay(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-[#e9204f]"
              />
            </div>

            {/* Dividers */}
            <div className="h-[1px] bg-neutral-100 w-full" />

            {/* Calculation Output [1] */}
            <div className="flex flex-col items-center sm:items-start leading-tight">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                Your approximate annual profit
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={annualProfit}
                  initial={{ scale: 0.97 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 12 }}
                  className="text-3xl md:text-5xl font-black tracking-tight text-neutral-900"
                >
                  {annualProfit.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Action CTA & Fine print disclaimer */}
            <div className="flex flex-col gap-3 mt-2">
              <button className="primary-bg cursor-pointer w-full py-4 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition duration-150 text-center">
                Start selling
              </button>
              <p className="text-[10px] text-neutral-400 font-medium leading-relaxed">
                *This estimated value includes general print placement on the product canvas. Extra placements, shipping fees, regional sales taxes, or custom integrations are recalculated inside your catalog panel.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}