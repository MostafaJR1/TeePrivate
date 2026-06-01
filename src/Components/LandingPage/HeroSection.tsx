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
    image: "/HERO-4.png",
    bgColor: "#efe4de",
  },
  {
    id: "artist-2",
    tagline: "ZERO RISK, HIGH VALUE",
    title: "Build your dream business",
    description:
      "Launch an online store without inventory. Focus strictly on your creative marketing while we manage order fulfillment and global delivery.",
    ctaText: "Start your store",
    image: "/HERO-3.jpg",
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
    image: "/HERO-1.jpg", // Replace with your builder image
    bgColor: "#e6eff4",
  },
  {
    id: "builder-2",
    tagline: "ONE-OF-A-KIND PRODUCTS",
    title: "Bring ideas to physical life",
    description:
      "No minimum order limits. Craft custom t-shirts, mugs, hoodies, and gifts with our easy-to-use custom builder tool.",
    ctaText: "Customize a product",
    image: "/HERO-2.jpg", // Replace with your builder image
    bgColor: "#f6cece",
  },
];

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<"artist" | "builder">("artist");
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSlides = activeTab === "artist" ? artistSlides : builderSlides;
  const currentSlide = currentSlides[currentIndex] || currentSlides[0];

  const scrollToSteps = () => {
    const element = document.getElementById("steps-section");
    if (element) {
      const headerOffset = -220; // Matches the approximate height of your sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Auto-play interval that resets whenever the active tab changes
  useEffect(() => {
    setTimeout(() => setCurrentIndex(0), 0);

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % currentSlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [activeTab, currentSlides.length]);

  return (
    <motion.section
      className="relative min-h-[500px] lg:h-[650px] flex items-center overflow-hidden transition-colors duration-1000"
      animate={{ backgroundColor: currentSlide.bgColor }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-12 lg:py-0 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
        
        {/* LEFT COLUMN: Controls & Copy */}
        <div className="lg:col-span-7 flex flex-col justify-center z-10">
          
          {/* SWITCHER / TOGGLE (Using layoutId for smooth sliding background) */}
          <div className="inline-flex self-start rounded-full bg-black/5 p-1 mb-8 gap-1 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab("artist")}
              className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300 cursor-pointer ${
                activeTab === "artist" ? "black-text" : "text-black/50 hover:text-black/80"
              }`}
            >
              {activeTab === "artist" && (
                <motion.span
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-white rounded-full shadow-sm"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <span className="relative z-10">Start Your Brand</span>
            </button>
            <button
              onClick={() => setActiveTab("builder")}
              className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300 cursor-pointer ${
                activeTab === "builder" ? "black-text" : "text-black/50 hover:text-black/80"
              }`}
            >
              {activeTab === "builder" && (
                <motion.span
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-white rounded-full shadow-sm"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <span className="relative z-10">Customize Article</span>
            </button>
          </div>

          {/* ANIMATING HERO DETAILS */}
          <div className="max-w-[580px]">
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
                <h1 className="mb-5 text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight primary-text">
                  {currentSlide.title}
                </h1>

                {/* DESCRIPTION */}
                <p className="mb-8 text-base md:text-lg leading-relaxed text-black/70 max-w-lg">
                  {currentSlide.description}
                </p>

                {/* CTA ACTIONS */}
                <div className="flex flex-wrap items-center gap-4">
                  <button className="rounded-full primary-bg cursor-pointer px-7 py-3.5 font-semibold transition shadow-md hover:shadow-lg">
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

        {/* RIGHT COLUMN: Responsive Image Preview with Cadre */}
        <div className="lg:col-span-5 relative flex items-center justify-center w-full min-h-[350px] md:min-h-[450px] lg:h-[500px]">
          
          {/* Ambient visual background glow behind the cadre */}
          <div className="absolute w-[80%] h-[80%] rounded-full bg-white/20 blur-3xl -z-10 pointer-events-none scale-105" />

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${currentIndex}`}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -15 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative w-full aspect-square max-w-[400px] lg:max-w-none lg:h-[460px] bg-white/40 backdrop-blur-sm rounded-[2.5rem] border border-white/60 p-6 md:p-8 shadow-xl shadow-black/[0.02] flex items-center justify-center overflow-hidden"
            >
              {/* Subtle background matrix pattern inside the frame to blend landscape/portrait images */}
              <div className="absolute inset-0 bg-[radial-gradient(#80808008_1px,transparent_1px)] bg-[size:16px_16px] rounded-[2.5rem] pointer-events-none" />

              {/* Inner scaling container ensuring clean bounding boxes for any dimension */}
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  fill
                  priority
                  quality={100}
                  style={{ objectPosition: "top" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 35vw"
                  className="object-cover rounded-md max-h-full max-w-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.03)]"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Background Gradient overlay on small screens to ensure text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent pointer-events-none lg:hidden" />
    </motion.section>
  );
}