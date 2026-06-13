"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IoChevronForward } from "react-icons/io5";
import { DatabaseProduct } from "@/utils/supabase/products";
import { useProductStore } from "@/store/useProductStore";

interface ProductGridProps {
  initialProducts: DatabaseProduct[];
}

export function ProductGrid({ initialProducts }: ProductGridProps) {
  const router = useRouter();
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Read state and realtime hooks from our Zustand store [1.2.6]
  const { products, subscribeToRealtime } = useProductStore();

  // Hybrid Hydration and Real-Time sync setup [1.1.8, 1.2.6]
  useEffect(() => {
    // If the local session cache is empty, instantly hydrate it with the server pre-render payload [1.1.2, 1.1.8]
    if (useProductStore.getState().products.length === 0 && initialProducts.length > 0) {
      useProductStore.setState({ products: initialProducts, isLoaded: true });
    }

    // Subscribe to database changes (updates local state instantly on insert/delete) [1.2.6]
    const unsubscribe = subscribeToRealtime();
    return () => unsubscribe();
  }, [initialProducts, subscribeToRealtime]);

  // Fallback to the active memory-managed list [1.1.2]
  const activeProducts = products.length > 0 ? products : initialProducts;

  const handleStartDesigning = (imageUrl: string) => {
    router.push(`/u/editor?img=${encodeURIComponent(imageUrl)}`);
  };

  return (
    <section className="bg-neutral-50 py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-[1300px] mx-auto">
        
        {/* Dynamic Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          
          {/* LEAD PROMO CARD */}
          <div className="sm:col-span-2 lg:col-span-2 relative rounded-3xl overflow-hidden black-bg text-white p-8 md:p-12 flex flex-col justify-between min-h-[340px] md:min-h-none shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#e9204f33,transparent_45%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff09_1px,transparent_1px),linear-gradient(to_bottom,#ffffff09_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            <div className="max-w-md z-10">
              <span className="text-xs font-bold tracking-widest text-[#e9204f] uppercase mb-4 block">
                CATALOG PREVIEW
              </span>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-none mb-6">
                Choose from 500+ premium products
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed font-medium">
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

          {/* DYNAMIC PRODUCTS (Reads from local session memory with 0 network calls) [1.1.2] */}
          {activeProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-neutral-200/60 rounded-3.5xl p-4 shadow-sm flex flex-col group transition-all duration-300 hover:shadow-xl hover:border-neutral-300/60"
              onMouseEnter={() => setHoveredCardId(product.id)}
              onMouseLeave={() => setHoveredCardId(null)}
            >
              {/* Product Image Capsule Area */}
              <div className={`relative aspect-square w-full rounded-2.5xl overflow-hidden cursor-pointer transition-all duration-500 ${product.backdrop_bg}`}>
                
                {/* Image Transition setup with slight scale-up on hover */}
                <div className="absolute inset-0 w-full h-full p-6 transition-transform duration-500 ease-out group-hover:scale-105">
                  <Image
                    src={hoveredCardId === product.id ? product.hover_image : product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 30vw, 22vw"
                    className="object-contain transition-all duration-300"
                  />
                </div>

                {/* Sliding Overlay containing the CTAs [1] */}
                <div className={`absolute inset-0 bg-black/35 backdrop-blur-xs flex flex-col items-center justify-center p-4 gap-2.5 transition-opacity duration-300 ${
                  hoveredCardId === product.id ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}>
                  <button 
                    onClick={() => handleStartDesigning(product.image)}
                    className="primary-bg cursor-pointer px-6 py-3 rounded-full font-extrabold text-xs shadow-md hover:scale-105 active:scale-95 transition duration-150"
                  >
                    Start Designing
                  </button>
                  <button className="bg-white text-neutral-800 cursor-pointer px-6 py-2.5 rounded-full font-extrabold text-[11px] shadow-sm hover:bg-neutral-50 transition duration-150">
                    Quick View
                  </button>
                </div>

                {/* Status Badge */}
                {product.badge_text && (
                  <span className="absolute bottom-4 left-4 bg-[#1b1b1b]/80 backdrop-blur-md text-white text-[10px] font-black px-3.5 py-1.5 rounded-full shadow-sm tracking-wider uppercase flex items-center gap-1.5">
                    {product.badge_text}
                  </span>
                )}

                {/* Micro Category Tag */}
                <span className="absolute top-4 left-4 bg-white/95 text-neutral-800 text-[9px] font-black px-2.5 py-1 rounded-full shadow-xs tracking-wider uppercase">
                  {product.category}
                </span>
              </div>

              {/* Product Metadata & Info area */}
              <div className="pt-4 px-1 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-base font-black text-neutral-900 tracking-tight group-hover:text-[#e9204f] transition duration-150 leading-tight mb-2.5 line-clamp-1">
                    {product.title}
                  </h3>

                  {/* Creator Monogram & Handle Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center font-extrabold text-[8px] uppercase ${product.avatar_bg}`}>
                        TP
                      </div>
                      <span className="text-xs text-neutral-400 font-bold">{product.creator_handle}</span>
                    </div>

                    {/* Color Swatch Dots */}
                    <div className="flex -space-x-1 overflow-hidden">
                      {product.colors.slice(0, 3).map((color, idx) => (
                        <span
                          key={idx}
                          className="w-2.5 h-2.5 rounded-full border border-white"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pricing / Base Cost Bar */}
                <div className="border-t border-neutral-100 pt-3.5 mt-2 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">
                      Base Production Cost
                    </span>
                    <span className="text-[10px] font-extrabold text-neutral-500 uppercase leading-none">
                      {product.color_count}+ Colors available
                    </span>
                  </div>
                  <div className="text-right leading-none">
                    <span className="text-base font-black text-[#e9204f]">{product.base_price.toFixed(2)} DH</span>
                  </div>
                </div>
              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}