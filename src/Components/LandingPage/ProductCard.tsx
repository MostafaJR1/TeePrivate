"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  IoChevronForward, 
  IoChevronBack, 
  IoHeartOutline, 
  IoStar 
} from "react-icons/io5";
import { DatabaseProduct } from "@/utils/supabase/products";

const USD_TO_MAD = 10;

interface ProductCardProps {
  product: DatabaseProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const basePriceMAD = product.base_price * USD_TO_MAD;
  const originalPriceMAD = basePriceMAD * 2.15;
  const discountPercent = 53;

  // Compile active mockup images (Front underlay, back underlay)
  const images = [product.image, product.hover_image].filter(Boolean);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stops parent Link redirections [1]
    setActiveImgIdx((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stops parent Link redirections [1]
    setActiveImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-[#131315] border border-white/5 rounded-none overflow-hidden flex flex-col h-full group hover:border-[#e9204f]/25 transition duration-300 shadow-lg select-none">
      
      {/* 1. Product Thumbnail Area (No Rounding) */}
      <div className={`relative aspect-square w-full rounded-none overflow-hidden border-b border-white/5 ${product.backdrop_bg} p-8`}>
        
        {/* Render Active Mockup Image */}
        <Image 
          src={images[activeImgIdx]}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 30vw, 22vw"
          className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dynamic Navigation Arrows (Fades in on card hover) [1] */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-[#131315]/80 hover:bg-[#e9204f] text-white flex items-center justify-center border border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-md"
              aria-label="Previous image"
            >
              <IoChevronBack size={12} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-[#131315]/80 hover:bg-[#e9204f] text-white flex items-center justify-center border border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-md"
              aria-label="Next image"
            >
              <IoChevronForward size={12} />
            </button>
          </>
        )}
        
        {/* Wishlist button */}
        <button className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-[#e9204f] rounded-full border border-white/5 text-neutral-300 hover:text-white shadow-xs transition duration-150 cursor-pointer z-10">
          <IoHeartOutline size={14} />
        </button>

        <span className="absolute top-4 left-4 bg-white/5 border border-white/5 text-neutral-300 text-[8px] font-black px-2.5 py-1 rounded-none shadow-sm tracking-wider uppercase backdrop-blur-sm z-10">
          {product.category}
        </span>
      </div>

      {/* 2. Metadata & Actions Area [1] */}
      <div className="p-4 flex flex-col justify-between flex-grow bg-[#131315]">
        <div>
          {/* Title & Rating row */}
          <div className="flex justify-between items-center gap-2 mb-2">
            <h3 className="text-xs font-black text-white tracking-tight group-hover:text-[#e9204f] transition duration-150 leading-snug line-clamp-1 flex-1">
              {product.title}
            </h3>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-neutral-300 shrink-0">
              <IoStar className="text-amber-500" size={11} />
              <span>4.9</span>
            </div>
          </div>

          {/* Color Swatches */}
          <div className="flex gap-1.5 mb-4">
            {product.colors.map((color, idx) => (
              <span
                key={idx}
                className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-inner"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Pricing and Action Button [1] */}
        <div className="border-t border-white/5 pt-3.5 mt-auto flex flex-col gap-3.5">
          <div className="flex items-baseline gap-2 leading-none">
            <span className="text-xs font-black text-[#e9204f]">{basePriceMAD.toFixed(2)} DH</span>
            <span className="text-[10px] font-bold text-neutral-500 line-through">{originalPriceMAD.toFixed(0)} DH</span>
            <span className="text-[9px] font-black text-[#e9204f] uppercase tracking-wide">({discountPercent}% OFF)</span>
          </div>

          {/* Drags directly into your custom workspace canvas (Includes hover gap animation) [1, 2] */}
          <Link
            href={`/u/editor?img=${encodeURIComponent(images[activeImgIdx])}`} // Encodes the current viewed image index [2]
            className="w-full py-2.5 primary-bg text-white font-black text-[10px] uppercase tracking-widest transition duration-150 rounded-none cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] group/btn"
          >
            <span>Start Design</span>
            <IoChevronForward 
              size={12} 
              className="transform transition-transform duration-200 ease-out group-hover/btn:translate-x-1" 
            />
          </Link>
        </div>
      </div>

    </div>
  );
}