"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { IoChevronForward } from "react-icons/io5";

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
    basePrice: "$8.20",
    colors: ["#1b1b1b", "#ffffff", "#e9204f", "#3b82f6", "#10b981"],
    colorCount: 24,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    hoverImage: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "p2",
    title: "Everyday Heavy Canvas Tote",
    category: "Accessories",
    basePrice: "$5.95",
    colors: ["#d2b48c", "#1b1b1b", "#ffffff"],
    colorCount: 6,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
    hoverImage: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "p3",
    title: "Minimalist Two-Tone Mug",
    category: "Home & Living",
    basePrice: "$4.50",
    colors: ["#ef4444", "#f97316", "#3b82f6"],
    colorCount: 8,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    hoverImage: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "p4",
    title: "Embroidered Champion Hoodie",
    category: "Embroidery",
    basePrice: "$21.90",
    colors: ["#1b1b1b", "#e5e7eb", "#1e3a8a", "#7c3aed"],
    colorCount: 14,
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
    hoverImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "p5",
    title: "Eco-Friendly Matte Case",
    category: "Phone Cases",
    basePrice: "$9.15",
    colors: ["#ffffff", "#1b1b1b", "#a78bfa", "#f472b6"],
    colorCount: 18,
    image: "https://images.unsplash.com/photo-1580870013141-3b13c5100c15?w=600&auto=format&fit=crop&q=80",
    hoverImage: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "p6",
    title: "High-Waist Athletic Leggings",
    category: "Apparel",
    basePrice: "$16.50",
    colors: ["#1b1b1b", "#4b5563", "#1e3a8a"],
    colorCount: 5,
    image: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=600&auto=format&fit=crop&q=80",
    hoverImage: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80",
  },
];

export function ProductGrid() {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  return (
    <section className="bg-neutral-50 py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-[1300px] mx-auto">
        
        {/* Dynamic Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* LEAD PROMO CARD (Spans 2 columns on larger viewports) */}
          <div className="sm:col-span-2 lg:col-span-2 relative rounded-3xl overflow-hidden bg-[#0d2137] text-white p-8 md:p-12 flex flex-col justify-between min-h-[340px] md:min-h-none shadow-sm">
            {/* Soft grid/glow details backing the card */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#e9204f33,transparent_45%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            <div className="max-w-md z-10">
              <span className="text-xs font-bold tracking-widest text-[#e9204f] uppercase mb-4 block">
                CATALOG PREVIEW
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none mb-6">
                Choose from 500+ premium products
              </h2>
              <p className="text-sm md:text-base text-neutral-300 leading-relaxed font-medium">
                Find customizable essentials suited to your store. Add original graphics, tags, and custom embroidery instantly.
              </p>
            </div>

            <div className="z-10 mt-8 sm:mt-0">
              <button className="primary-bg cursor-pointer px-6 py-3.5 rounded-full font-bold text-sm inline-flex items-center gap-2 transition shadow-md hover:shadow-lg active:scale-95 duration-150">
                <span>See all products</span>
                <IoChevronForward size={16} />
              </button>
            </div>
          </div>

          {/* DYNAMIC INTERACTIVE CARDS */}
          {productsData.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-neutral-200/60 rounded-3xl overflow-hidden shadow-sm flex flex-col group transition-all duration-300 hover:shadow-lg hover:border-neutral-300/60"
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
                <div className={`absolute inset-0 bg-black/30 backdrop-blur-xs flex flex-col items-center justify-center p-4 gap-3 transition-opacity duration-300 ${
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
                  <h3 className="text-sm font-extrabold text-neutral-800 tracking-tight group-hover:text-[#e9204f] transition duration-150 leading-tight mb-2">
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
                  <div className="flex gap-1.5 items-center">
                    {product.colors.map((color, idx) => (
                      <span
                        key={idx}
                        className="w-3 h-3 rounded-full border border-black/5 shadow-inner"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-extrabold text-neutral-400 uppercase">
                    {product.colorCount}+ Colors
                  </span>
                </div>
              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}