"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

// Slide contents for the "Join Us as Artist" flow (Sellers / Brand builders)
const artistSlides = [
  {
    id: "artist-1",
    tagline: "FOR CREATORS & SELLERS",
    title: "Unleash your inner brand",
    description:
      "Add your custom designs to hundreds of premium products. We manufacture and ship directly to your customers worldwide, hassle-free.",
    ctaText: "Start selling for free",
    bgColor: "#efe4de",
  },
  {
    id: "artist-2",
    tagline: "ZERO RISK, HIGH VALUE",
    title: "Build your dream business",
    description:
      "Launch an online store without inventory. Focus strictly on your creative marketing while we manage order fulfillment and global delivery.",
    ctaText: "Start your store",
    bgColor: "#caf7ff",
  },
];

// Slide contents for the "Build Your Own Article" flow (Personal creators)
const builderSlides = [
  {
    id: "builder-1",
    tagline: "DESIGN FOR YOURSELF",
    title: "Create pieces with your own hands",
    description:
      "Pick from our range of high-quality fabrics and goods. Upload your own graphics, text, or photos to design clothing exactly how you want it.",
    ctaText: "Start designing",
    bgColor: "#e6eff4",
  },
  {
    id: "builder-2",
    tagline: "ONE-OF-A-KIND PRODUCTS",
    title: "Bring ideas to physical life",
    description:
      "No minimum order limits. Craft custom t-shirts, mugs, hoodies, and gifts with our easy-to-use custom builder tool.",
    ctaText: "Customize a product",
    bgColor: "#f6cece",
  },
];

// High-quality mockup images
const col1Products = [
  "/HERO-1.png", // T-shirt
  "/HERO-2.png", // T-shirt
  "/HERO-3.png", // Slate Mug
];

const col2ProductsCenter = [
  "/HERO-1.png", // Premium Hoodie
  "/HERO-2.png", // Tote Bag
  "/HERO-3.png", // Tote Bag
];

const col3Products = [
  "/HERO-1.png", // Leggings
  "/HERO-2.png", // Enamel Mug
  "/HERO-3.png", // Alternate T-shirt
];

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<"artist" | "builder">("artist");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentSlides = activeTab === "artist" ? artistSlides : builderSlides;
  const currentSlide = currentSlides[currentIndex] || currentSlides[0];

  const scrollToSteps = () => {
    const element = document.getElementById("steps-section");
    if (element) {
      const headerOffset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Auto-play interval
  useEffect(() => {
    setTimeout(() => setCurrentIndex(0), 0);

    const interval = setInterval(() => {
      if (isPaused) return;
      setCurrentIndex((prev) => (prev + 1) % currentSlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [activeTab, currentSlides.length, isPaused]);

  return (
    <motion.section
      className="relative min-h-[580px] lg:mt-0 mt-6 lg:h-[700px] flex items-center overflow-hidden"
      animate={{ backgroundColor: currentSlide.bgColor }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      <div className="mx-auto w-full max-w-[1300px] px-6 py-12 md:px-12 lg:py-0 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
        
        {/* LEFT COLUMN: Controls & Copy */}
        <div className="lg:col-span-6 flex flex-col justify-center z-10">
          
          {/* SWITCHER / TOGGLE (Using layoutId for smooth sliding background) */}
          <div className="inline-flex self-start rounded-xl shadow-sm bg-black/5 p-1 mb-8 gap-1 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab("artist")}
              className={`relative rounded-xl px-5 py-2 text-sm font-semibold transition-colors duration-300 cursor-pointer ${
                activeTab === "artist" ? "black-text" : "text-black/50 hover:text-black/80"
              }`}
            >
              {activeTab === "artist" && (
                <motion.span
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <span className="relative z-10">Start Your Brand</span>
            </button>
            <button
              onClick={() => setActiveTab("builder")}
              className={`relative rounded-xl px-5 py-2 text-sm font-semibold transition-colors duration-300 cursor-pointer ${
                activeTab === "builder" ? "black-text" : "text-black/50 hover:text-black/80"
              }`}
            >
              {activeTab === "builder" && (
                <motion.span
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <span className="relative z-10">Customize Article</span>
            </button>
          </div>

          {/* ANIMATING HERO DETAILS */}
          <div className="max-w-[540px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${currentIndex}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* TAGLINE */}
                <span className="block text-xs font-bold tracking-widest text-black/50 uppercase mb-3">
                  {currentSlide.tagline}
                </span>

                {/* TITLE */}
                <h1 className="mb-5 text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight primary-text">
                  {currentSlide.title}
                </h1>

                {/* DESCRIPTION */}
                <p className="mb-8 text-base md:text-lg leading-relaxed text-black/70 max-w-lg">
                  {currentSlide.description}
                </p>

                {/* CTA ACTIONS */}
                <div className="flex flex-wrap items-center gap-4">
                  <button className="rounded-xl primary-bg cursor-pointer px-7 py-3 font-semibold transition shadow-md hover:shadow-lg">
                    {currentSlide.ctaText}
                  </button>

                  <button
                    onClick={scrollToSteps}
                    className="cursor-pointer font-semibold underline-offset-4 hover:underline text-black/85 transition hover:text-black px-4 py-2"
                  >
                    How it works ?
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: Three-Column Counter-Scrolling Showcase [1] */}
        <div 
          className="lg:col-span-6 relative flex items-center justify-center w-full h-[450px] md:h-[500px] lg:h-[550px] overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle glow backer */}
          <div className="absolute w-[80%] h-[80%] rounded-full bg-white/20 blur-3xl -z-10 pointer-events-none" />

          {/* Dynamic synchronized vertical fading masks [1] */}
          <motion.div 
            animate={{ backgroundImage: `linear-gradient(to bottom, ${currentSlide.bgColor}, transparent)` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute top-0 inset-x-0 h-24 pointer-events-none z-20" 
          />
          <motion.div 
            animate={{ backgroundImage: `linear-gradient(to top, ${currentSlide.bgColor}, transparent)` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute bottom-0 inset-x-0 h-24 pointer-events-none z-20" 
          />

          {/* THREE-COLUMN HORIZONTAL GRID CANVAS (No rotation, smallest gap) [1] */}
          <div className="flex gap-1.5 h-[650px] items-center justify-center w-full select-none pointer-events-none">
            
            {/* COLUMN 1 (Left Side): Downwards Infinite Scroll (Tripled array, transitions from -33.333% to 0% for zero flicker) [1] */}
            <div className="flex flex-col w-[100px] sm:w-[125px] h-full overflow-hidden">
              <motion.div
                animate={{ y: ["-33.333%", "0%"] }}
                transition={{ ease: "linear", duration: 24, repeat: Infinity }}
                className="flex flex-col gap-1.5"
              >
                {[...col1Products, ...col1Products, ...col1Products].map((imgSrc, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-sm border border-neutral-200/40 flex items-center justify-center w-full aspect-square relative overflow-hidden">
                    <Image
                      src={imgSrc}
                      alt="Catalog product design template"
                      fill
                      sizes="(max-width: 768px) 20vw, 10vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* COLUMN 2 (Center): Upwards Infinite Scroll (Doubled array, transitions from 0% to -50% for zero flicker) [1] */}
            <div className="flex flex-col w-[130px] sm:w-[165px] h-full overflow-hidden">
              <motion.div
                animate={{ y: ["0%", "-50%"] }}
                transition={{ ease: "linear", duration: 20, repeat: Infinity }}
                className="flex flex-col gap-1.5"
              >
                {[...col2ProductsCenter, ...col2ProductsCenter].map((imgSrc, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-md border border-neutral-200/50 flex items-center justify-center w-full aspect-square relative overflow-hidden">
                    <Image
                      src={imgSrc}
                      alt="Featured catalog product design template"
                      fill
                      sizes="(max-width: 768px) 25vw, 12vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* COLUMN 3 (Right Side): Downwards Infinite Scroll (Tripled array, transitions from -33.333% to 0% for zero flicker) [1] */}
            <div className="flex flex-col w-[100px] sm:w-[125px] h-full overflow-hidden">
              <motion.div
                animate={{ y: ["-33.333%", "0%"] }}
                transition={{ ease: "linear", duration: 24, repeat: Infinity }}
                className="flex flex-col gap-1.5"
              >
                {[...col3Products, ...col3Products, ...col3Products].map((imgSrc, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-sm border border-neutral-200/40 flex items-center justify-center w-full aspect-square relative overflow-hidden">
                    <Image
                      src={imgSrc}
                      alt="Catalog product design template"
                      fill
                      sizes="(max-width: 768px) 20vw, 10vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </motion.div>
            </div>

          </div>

        </div>
      </div>

      {/* Background Gradient overlay on small screens to ensure text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent pointer-events-none lg:hidden" />
    </motion.section>
  );
}