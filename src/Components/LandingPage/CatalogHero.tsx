"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IoSearchOutline, 
  IoChevronDown, 
  IoCheckmarkOutline
} from "react-icons/io5";

interface CatalogFiltersProps {
  initialCategory: string;
  initialGender: string;
  initialSearch: string;
}

const categories = ["All Categories", "Apparel", "Accessories", "Home & Living", "Phone Cases"];
const genders = ["All Genders", "Unisex", "Men", "Women"];

export function CatalogFilters({ initialCategory, initialGender, initialSearch }: CatalogFiltersProps) {
  const router = useRouter();
  
  const [category, setCategory] = useState(initialCategory === "All" ? "All Categories" : initialCategory);
  const [gender, setGender] = useState(initialGender === "All" ? "All Genders" : initialGender);
  const [search, setSearch] = useState(initialSearch);

  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);

  const catRef = useRef<HTMLDivElement>(null);
  const genderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
        setCategory(initialCategory === "All" ? "All Categories" : initialCategory);
        setGender(initialGender === "All" ? "All Genders" : initialGender);
        setSearch(initialSearch);
    },0)
  }, [initialCategory, initialGender, initialSearch]);

  // Click Outside Detector [2]
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setIsCatOpen(false);
      }
      if (genderRef.current && !genderRef.current.contains(e.target as Node)) {
        setIsGenderOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyFilters = (newCat: string, newGen: string, newQuery: string) => {
    const catParam = newCat === "All Categories" ? "All" : newCat;
    const genParam = newGen === "All Genders" ? "All" : newGen;
    
    const params = new URLSearchParams();
    if (catParam !== "All") params.set("category", catParam);
    if (genParam !== "All") params.set("gender", genParam);
    if (newQuery.trim() !== "") params.set("search", newQuery);

    router.push(`/u/catalog?${params.toString()}`);
  };

  const handleCategorySelect = (selected: string) => {
    setCategory(selected);
    setIsCatOpen(false);
    applyFilters(selected, gender, search);
  };

  const handleGenderSelect = (selected: string) => {
    setGender(selected);
    setIsGenderOpen(false);
    applyFilters(category, selected, search);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(category, gender, search);
  };

  return (
    // STICKY GLASSMORPHIC HEADER: Floats cleanly on scroll underneath the main header [1]
    <div className="sticky top-6 z-30 w-full flex items-center justify-center px-6 transition-all duration-300">
      <div className="w-full max-w-3xl bg-white/[0.03] backdrop-blur-md rounded-full border border-white/10 shadow-xl p-2 flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full flex flex-col sm:flex-row items-center gap-2 relative">
          
          {/* Custom Category Dropdown [2] */}
          <div className="relative w-full sm:w-1/3" ref={catRef}>
            <button
              type="button"
              onClick={() => {
                setIsCatOpen(!isCatOpen);
                setIsGenderOpen(false);
              }}
              className="w-full bg-[#141416]/80 border border-white/5 hover:bg-[#1a1a1c] hover:border-white/10 px-5 py-2.5 text-xs font-black text-neutral-300 rounded-full flex items-center justify-between transition cursor-pointer select-none"
            >
              <span className="truncate">{category}</span>
              <IoChevronDown size={14} className={`text-neutral-500 transition-transform duration-200 ${isCatOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isCatOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute left-0 mt-3 w-full min-w-[200px] bg-[#141416] border border-white/5 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 text-neutral-300"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      className="flex items-center justify-between w-full px-4 py-2.5 text-xs font-bold text-left text-neutral-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition duration-150 cursor-pointer"
                    >
                      <span>{cat}</span>
                      {category === cat && <IoCheckmarkOutline size={14} className="text-[#e9204f]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Custom Gender Dropdown [2] */}
          <div className="relative w-full sm:w-1/3" ref={genderRef}>
            <button
              type="button"
              onClick={() => {
                setIsGenderOpen(!isGenderOpen);
                setIsCatOpen(false);
              }}
              className="w-full bg-[#141416]/80 border border-white/5 hover:bg-[#1a1a1c] hover:border-white/10 px-5 py-2.5 text-xs font-black text-neutral-300 rounded-full flex items-center justify-between transition cursor-pointer select-none"
            >
              <span className="truncate">{gender}</span>
              <IoChevronDown size={14} className={`text-neutral-500 transition-transform duration-200 ${isGenderOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isGenderOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute left-0 mt-3 w-full min-w-[200px] bg-[#141416] border border-white/5 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 text-neutral-300"
                >
                  {genders.map((gen) => (
                    <button
                      key={gen}
                      type="button"
                      onClick={() => handleGenderSelect(gen)}
                      className="flex items-center justify-between w-full px-4 py-2.5 text-xs font-bold text-left text-neutral-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition duration-150 cursor-pointer"
                    >
                      <span>{gen}</span>
                      {gender === gen && <IoCheckmarkOutline size={14} className="text-[#e9204f]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Query Text Input */}
          <form onSubmit={handleSearchSubmit} className="w-full sm:w-1/3 flex items-center bg-[#141416]/80 border border-white/5 rounded-full px-1.5 py-1">
            <input 
              type="text" 
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-3 pr-2 py-1 bg-transparent text-xs font-bold text-white placeholder-neutral-500 outline-none"
            />
            <button type="submit" className="primary-bg cursor-pointer p-2.5 rounded-full flex items-center justify-center shrink-0">
              <IoSearchOutline size={12} className="text-white" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}