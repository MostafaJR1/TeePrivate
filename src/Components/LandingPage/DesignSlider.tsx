"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export function DesignSlider() {
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100 percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging || e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents browser image dragging or text selection [1]
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleMove(e.touches[0].clientX);
  };

  // Safe global drag release
  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  return (
    <section className="bg-white py-20 md:py-28 px-6 md:px-12 border-b border-neutral-100 relative">
      <div className="max-w-[1100px] mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <span className="text-xs font-extrabold tracking-widest text-[#e9204f] uppercase mb-2 block">
            MOCKUP ENGINE
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-neutral-800 leading-tight mb-4">
            From blank canvas to premium streetwear
          </h2>
          <p className="text-sm md:text-base text-neutral-500 max-w-xl mx-auto font-medium">
            Drag the slider to see how our custom generator blends your graphics directly into raw fabric folds with flawless print precision.
          </p>
        </div>

        {/* COMPARISON INTERFACE SLIDER */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-[4/3] rounded-[2.5rem] border border-neutral-200/60 overflow-hidden shadow-lg bg-neutral-100 select-none cursor-ew-resize"
        >
          
          {/* STATIC BASE LAYER: Renders once so the T-shirt's width & coordinates are 100% identical [1] */}
          <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square pointer-events-none">
            <Image
              src="/HERO-3.png"
              alt="Premium cotton T-shirt backdrop"
              fill
              priority
              className="object-cover pointer-events-none"
            />
            {/* "Before" label in the top-left */}
            <span className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm text-neutral-800 text-[10px] font-black px-4 py-2 rounded-full shadow-sm tracking-wider uppercase z-20">
              Blank Canvas
            </span>
            {/* "After" label in the top-right */}
            <span className="absolute top-6 right-6 bg-[#1b1b1b]/90 backdrop-blur-sm text-white text-[10px] font-black px-4 py-2 rounded-full shadow-sm tracking-wider uppercase z-20">
              Printed Article
            </span>
          </div>

          {/* OVERLAY DESIGN LAYER: Applies the slider clip-path only to the transparent printed graphic [1] */}
          <div 
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            {/* Graphic Print Chest Overlay (Blends perfectly into fabric folds using multiply) [1] */}
            <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square pointer-events-none">
              <Image
                src="/HERO-3-TRANSPARENT.png" // High-fidelity artwork on transparent background
                alt="Custom TeePrivate graphic design print"
                fill
                className="object-contain mix-blend-multiply"
              />
            </div>
          </div>

          {/* SLIDER HANDLE LINE & DRAG BUTTON [1] */}
          <div 
            className="absolute inset-y-0 z-30 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Core split bar line */}
            <div className="absolute inset-y-0 -left-[1px] w-[2px] bg-[#e9204f]" />

            {/* Glowing drag core handle */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#e9204f] text-white flex items-center justify-center shadow-lg cursor-ew-resize">
              
              {/* Inner Pulsating ring */}
              <AnimatePresence>
                {isDragging && (
                  <motion.span
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border border-white/60 pointer-events-none"
                  />
                )}
              </AnimatePresence>

              <div className="flex gap-0.5 pointer-events-none">
                <IoChevronBack size={14} />
                <IoChevronForward size={14} />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}