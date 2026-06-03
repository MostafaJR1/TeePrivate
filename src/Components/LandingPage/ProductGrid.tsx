"use client";

import { useState } from "react";
import Image from "next/image";
import { IoChevronForward } from "react-icons/io5";
import { FaMinus, FaPlus } from "react-icons/fa";

interface Product {
  id: string;
  title: string;
  category: string;
  basePrice: string;
  colors: string[]; // Color hexes for variant dots
  colorCount: number;
  image: string;
  hoverImage: string;
}

const productsData: Product[] = [
  {
    id: "p1",
    title: "Classic Unisex Premium Tee",
    category: "Apparel",
    basePrice: "8.20Dh",
    colors: ["#1b1b1b", "#ffffff", "#e9204f", "#3b82f6", "#10b981"],
    colorCount: 24,
    image: "/HERO-1.png",
    hoverImage: "/HERO-1.png",
  },
  {
    id: "p2",
    title: "Everyday Heavy Canvas Tote",
    category: "Accessories",
    basePrice: "5.95Dh",
    colors: ["#d2b48c", "#1b1b1b", "#ffffff"],
    colorCount: 6,
    image: "/HERO-2.png",
    hoverImage: "/HERO-2.png",
  },
  {
    id: "p3",
    title: "Minimalist Two-Tone Mug",
    category: "Home & Living",
    basePrice: "4.50Dh",
    colors: ["#ef4444", "#f97316", "#3b82f6"],
    colorCount: 8,
    image: "/HERO-3.png",
    hoverImage: "/HERO-3.png",
  },
  {
    id: "p4",
    title: "Embroidered Champion Hoodie",
    category: "Embroidery",
    basePrice: "21.90Dh",
    colors: ["#1b1b1b", "#e5e7eb", "#1e3a8a", "#7c3aed"],
    colorCount: 14,
    image: "/HERO-1.png",
    hoverImage: "/HERO-1.png",
  },
  {
    id: "p5",
    title: "Eco-Friendly Matte Case",
    category: "Phone Cases",
    basePrice: "9.15Dh",
    colors: ["#ffffff", "#1b1b1b", "#a78bfa", "#f472b6"],
    colorCount: 18,
    image: "/HERO-1.png",
    hoverImage: "/HERO-1.png",
  },
  {
    id: "p6",
    title: "High-Waist Athletic Leggings",
    category: "Apparel",
    basePrice: "16.50Dh",
    colors: ["#1b1b1b", "#4b5563", "#1e3a8a"],
    colorCount: 5,
    image: "/HERO-1.png",
    hoverImage: "/HERO-1.png",
  },
];

export function ProductGrid() {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  return (
    <section className="bg-neutral-50 py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-[1300px] mx-auto">
        
        {/* Dynamic Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          
          {/* LEAD PROMO CARD (Spans 2 columns on larger viewports) */}
          {/* LEAD PROMO CARD (Spans 2 columns on larger viewports) [1] */}
          <div className="sm:col-span-2 lg:col-span-2 relative rounded-3.5xl rounded-lg border border-neutral-200/60 overflow-hidden bg-white black-text p-6 md:p-8 flex flex-col sm:flex-row gap-6 justify-start items-start h-full md:min-h-none shadow-sm">
            
            {/* Left: Product Thumbnail Capsule [1] */}
            <div className="relative shrink-0 w-40 h-40 sm:w-48 sm:h-48 aspect-square rounded-2.5xl overflow-hidden bg-neutral-100 border border-neutral-100">
              <Image 
                fill 
                className="object-cover" 
                src={productsData[0].image} 
                alt={productsData[0].title} 
                sizes="(max-width: 640px) 150px, 200px"
              />
            </div>

            {/* Right: Content Column [1] */}
            <div className="flex flex-col justify-between h-full w-full">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight leading-tight mb-2.5">
                  {productsData[0].title}
                </h2>
                <p className="text-xs md:text-sm text-neutral-500 font-medium leading-relaxed mb-6">
                  Explore our best-selling customizable tee, perfect for any occasion. With 24 vibrant colors and premium quality, it&apos;s the ideal canvas for your creativity.
                </p>
              </div>

              {/* Pricing & Quantity Selector Panel [1] */}
              <div className="flex items-center justify-between gap-4 mt-auto">
                <div className="leading-none">
                  <span className="text-xl sm:text-2xl font-black text-neutral-900">{productsData[0].basePrice}</span>
                </div>
                
                {/* Quantity Selector Control [1] */}
                <div className="flex items-center gap-1.5 black-bg w-max rounded-xl text-white overflow-hidden shadow-sm">
                  <button className="px-3.5 py-2 cursor-pointer hover:bg-neutral-800 transition duration-150 flex items-center justify-center">
                    <FaMinus size={9} />
                  </button>
                  <span className="text-[11px] font-extrabold text-neutral-300 w-4 text-center select-none">
                    1
                  </span>
                  <button className="px-3.5 py-2 cursor-pointer hover:bg-neutral-800 transition duration-150 flex items-center justify-center">
                    <FaPlus size={9} />
                  </button>
                </div>
              </div>

              {/* Call-to-Action Link Button [1] */}
              <button className="primary-bg cursor-pointer w-full sm:w-max px-6 py-3.5 mt-5 rounded-full font-bold text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition duration-150 flex items-center justify-center gap-2">
                <span>Browse All Products</span> 
                <IoChevronForward size={14} />
              </button>
            </div>

          </div>

          {/* DYNAMIC INTERACTIVE CARDS */}
          {productsData.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-neutral-200/60 rounded-lg overflow-hidden flex flex-col group transition-all duration-300 hover:border-neutral-300/60"
              onMouseEnter={() => setHoveredCardId(product.id)}
              onMouseLeave={() => setHoveredCardId(null)}
            >
              {/* Product Image Area with Hover Overlay */}
              <div className="relative aspect-square w-full bg-neutral-100 overflow-hidden cursor-pointer">
                {/* Dual Image Flip Setup */}
                <div className="absolute inset-0 w-full h-full transition-transform duration-500 ease-out group-hover:scale-105">
                  <Image
                    src={hoveredCardId === product.id ? product.hoverImage : product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 30vw, 22vw"
                    className="object-cover transition-all duration-300"
                  />
                </div>

                {/* Sliding Overlay containing the CTAs [1] */}
                <div className={`absolute inset-0 bg-black/30 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 gap-3 transition-opacity duration-300 ${
                  hoveredCardId === product.id ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}>
                  <button className="primary-bg cursor-pointer px-6 py-3.5 rounded-full font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition duration-150">
                    Start Designing
                  </button>
                  <button className="bg-white/95 text-neutral-800 cursor-pointer px-6 py-2.5 rounded-full font-bold text-xs shadow-sm hover:bg-white transition duration-150">
                    Product Details
                  </button>
                </div>

                {/* Category Pill Tag (Positioned elegantly at top left) */}
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-neutral-800 text-[10px] font-black px-3 py-1 rounded-full shadow-sm tracking-wider uppercase">
                  {product.category}
                </span>
              </div>

              {/* Product Metadata & Info area [1] */}
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-sm font-bold text-neutral-800 tracking-tight group-hover:text-[#e9204f] transition duration-150 leading-tight mb-2">
                    {product.title}
                  </h3>

                  {/* Pricing row [1] */}
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase">From</span>
                    <span className="text-sm font-black text-neutral-900">{product.basePrice}</span>
                  </div>
                </div>

                {/* Separator */}
                <div className="h-[1px] bg-neutral-100 w-full mb-3" />

                {/* Variant Selector Details [1] */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1 items-center">
                    {product.colors.slice(0, 6).map((color, idx) => (
                      <span
                        key={idx}
                        className="w-3 h-3 rounded-full border border-black/5 shadow-inner"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  {product.colorCount > 6 && (
                    <span className="text-[10px] font-extrabold text-neutral-400 uppercase">
                      {product.colorCount - 6}+ Colors
                    </span>
                  )}
                </div>
              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}