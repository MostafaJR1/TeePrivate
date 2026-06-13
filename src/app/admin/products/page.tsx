"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { triggerProductsRevalidation } from "@/utils/supabase/products"; // Import our server-side cache revalidator [1.1.2]
import { 
  IoCloudUploadOutline, 
  IoTrashOutline, 
  IoWarningOutline,
  IoSettingsOutline,
  IoShirtOutline,
  IoAddOutline,
  IoCloseOutline,
  IoCheckmarkCircle
} from "react-icons/io5";
import Image from "next/image";

const supabase = createClient();

interface Product {
  id: string;
  title: string;
  category: string;
  base_price: number;
  colors: string[];
  color_count: number;
  image: string;
  hover_image: string;
  badge_text: string | null;
  backdrop_bg: string;
  created_at: string;
}

const categories = ["Apparel", "Accessories", "Home & Living", "Phone Cases"];

const backdropOptions = [
  { name: "Sage Green", value: "bg-[#e8f3f1]" },
  { name: "Warm Sand", value: "bg-[#fbf5ee]" },
  { name: "Slate Blue", value: "bg-[#edf4f9]" },
  { name: "Lavender", value: "bg-[#f3edf9]" },
  { name: "Rose", value: "bg-[#f9edf0]" },
  { name: "Neutral Gray", value: "bg-[#f1f1f3]" },
];

const presetColors = ["#1b1b1b", "#ffffff", "#e9204f", "#3b82f6", "#10b981", "#f59e0b", "#7c3aed"];

export default function AdminProductsPage() {
  // Metadata States
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Apparel");
  const [basePrice, setBasePrice] = useState("");
  const [badgeText, setBadgeText] = useState("");
  const [backdropBg, setBackdropBg] = useState("bg-[#e8f3f1]");
  const [creatorHandle] = useState("@teeprivate");
  const [avatarBg] = useState("bg-neutral-100 text-neutral-800");

  // Interactive Color Swatches state [1]
  const [selectedColors, setSelectedColors] = useState<string[]>(["#1b1b1b", "#ffffff"]);
  const [customColor, setCustomColor] = useState("");

  // Dual File States [1, 1.3.1]
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  // Status & Progress States
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [productsList, setProductsList] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setProductsList(data);
    if (error) console.error("Failed to load products list:", error);
  };

  useEffect(() => {
    setTimeout(() => {
        fetchProducts()
    }, 0);
  }, []);

  const handleFrontFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFrontFile(file);
      setFrontPreview(URL.createObjectURL(file));
    }
  };

  const handleBackFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackFile(file);
      setBackPreview(URL.createObjectURL(file));
    }
  };

  const addColor = (hex: string) => {
    const cleanHex = hex.trim().toLowerCase();
    if (/^#[0-9a-f]{6}$/i.test(cleanHex) && !selectedColors.includes(cleanHex)) {
      setSelectedColors([...selectedColors, cleanHex]);
      setCustomColor("");
    }
  };

  const removeColor = (hex: string) => {
    setSelectedColors(selectedColors.filter((c) => c !== hex));
  };

  // Dual Asset Upload & Database Sync [1, 1.1.4, 1.3.1]
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!frontFile || !backFile || !title.trim() || !basePrice) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setUploadProgress(10); // Initializing

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const presetName = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !presetName) {
        throw new Error("Cloudinary credentials are not configured in your .env.local file.");
      }

      // A. Upload FRONT mockup image [1.3.1]
      setUploadProgress(25);
      const frontData = new FormData();
      frontData.append("file", frontFile);
      frontData.append("upload_preset", presetName);

      const frontRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: frontData,
      });
      if (!frontRes.ok) throw new Error("Failed to upload front mockup image to Cloudinary.");
      const frontCloudinary = await frontRes.json();
      const frontUrl = frontCloudinary.secure_url;

      // B. Upload BACK/HOVER mockup image [1.3.1]
      setUploadProgress(55);
      const backData = new FormData();
      backData.append("file", backFile);
      backData.append("upload_preset", presetName);

      const backRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: backData,
      });
      if (!backRes.ok) throw new Error("Failed to upload back mockup image to Cloudinary.");
      const backCloudinary = await backRes.json();
      const backUrl = backCloudinary.secure_url;

      setUploadProgress(80); // Writing Row to database [1.1.4]

      // C. Insert Product Row in Supabase [1.1.4]
      const { error: dbError } = await supabase
        .from("products")
        .insert([
          {
            title,
            category,
            base_price: Number(basePrice),
            colors: selectedColors,
            color_count: selectedColors.length,
            image: frontUrl,
            hover_image: backUrl,
            badge_text: badgeText.trim() === "" ? null : badgeText,
            creator_handle: creatorHandle,
            avatar_bg: avatarBg,
            backdrop_bg: backdropBg,
          }
        ]);

      if (dbError) throw dbError;

      // D. Trigger on-demand cache revalidation instantly! [1.1.2]
      await triggerProductsRevalidation();

      setUploadProgress(100);
      setSuccessMessage("Product template successfully synchronized!");
      setTitle("");
      setBasePrice("");
      setBadgeText("");
      setFrontFile(null);
      setFrontPreview(null);
      setBackFile(null);
      setBackPreview(null);
      setSelectedColors(["#1b1b1b", "#ffffff"]);

      fetchProducts();
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage((err as Error).message || "Logistics upload cycle failed.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (!error) {
        await triggerProductsRevalidation(); // Revalidate cache instantly [1.1.2]
        fetchProducts();
      } else {
        alert("Deletion failed.");
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white p-6 md:p-12 flex flex-col gap-10">
      
      {/* HEADER */}
      <div className="border-b border-white/5 pb-6">
        <span className="text-[10px] font-black text-[#e9204f] tracking-widest uppercase mb-1 block">
          ADMIN CONSOLE
        </span>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Manage Product Catalog
        </h1>
        <p className="text-neutral-400 text-xs md:text-sm mt-1">
          Create, upload, and synchronize new blank mockups directly to your store catalog [1.1.4, 1.3.1].
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: Upload Card Form */}
        <div className="lg:col-span-5 bg-[#131315] border border-white/5 p-6 md:p-8 rounded-[2rem] shadow-2xl relative flex flex-col gap-6">
          
          <h2 className="text-sm font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
            <IoSettingsOutline size={16} /> New Product Blank
          </h2>

          <AnimatePresence>
            {errorMessage && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2 bg-red-500/5 text-red-500 text-xs font-bold p-4 rounded-xl border border-red-500/10 leading-relaxed">
                <span className="shrink-0"><IoWarningOutline size={16} /></span>
                <span>{errorMessage}</span>
              </motion.div>
            )}
            {successMessage && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2 bg-emerald-500/5 text-emerald-500 text-xs font-bold p-4 rounded-xl border border-emerald-500/10 leading-relaxed">
                <span className="shrink-0"><IoCheckmarkCircle size={16} /></span>
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-neutral-500 tracking-wider pl-1">Product Title</label>
              <input
                type="text"
                required
                placeholder="Classic Heavy Hoodie"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 outline-none text-sm font-semibold focus:border-[#e9204f]/40 transition text-white"
              />
            </div>

            {/* Category & Base Price row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-neutral-500 tracking-wider pl-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3.5 outline-none text-xs font-black uppercase tracking-wider text-neutral-400 focus:border-[#e9204f]/40 cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-neutral-500 tracking-wider pl-1">Base Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="12.50"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 outline-none text-sm font-semibold focus:border-[#e9204f]/40 transition text-white"
                />
              </div>
            </div>

            {/* Badge & Backdrop Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-neutral-500 tracking-wider pl-1">Backdrop Color</label>
                <select
                  value={backdropBg}
                  onChange={(e) => setBackdropBg(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3.5 outline-none text-xs font-black uppercase tracking-wider text-neutral-400 focus:border-[#e9204f]/40 cursor-pointer"
                >
                  {backdropOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-neutral-500 tracking-wider pl-1">Badge Promo Text</label>
                <input
                  type="text"
                  placeholder="🔥 Bestseller"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 outline-none text-sm font-semibold focus:border-[#e9204f]/40 transition text-white"
                />
              </div>
            </div>

            {/* Interactive Color Variant Selector [1] */}
            <div className="flex flex-col gap-2 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">Color Swatches ({selectedColors.length})</span>
              
              {/* Presets and custom text input */}
              <div className="flex flex-wrap gap-1.5 my-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => addColor(color)}
                    style={{ backgroundColor: color }}
                    className="w-5 h-5 rounded-full border border-white/15 cursor-pointer hover:scale-110 active:scale-90 transition-transform duration-100"
                    title={color}
                  />
                ))}
              </div>

              {/* Custom input */}
              <div className="flex items-center gap-2 bg-neutral-900 border border-white/5 rounded-xl px-3 py-1">
                <span className="text-xs text-neutral-500 font-extrabold">#</span>
                <input
                  type="text"
                  placeholder="ffffff"
                  value={customColor.replace("#", "")}
                  onChange={(e) => setCustomColor(`#${e.target.value}`)}
                  className="w-full bg-transparent outline-none text-xs text-white font-extrabold uppercase placeholder-neutral-600"
                />
                <button
                  type="button"
                  onClick={() => addColor(customColor)}
                  className="p-1 rounded-lg bg-white/5 hover:bg-[#e9204f] hover:text-white transition duration-150 cursor-pointer"
                >
                  <IoAddOutline size={16} />
                </button>
              </div>

              {/* Selected colors ledger */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedColors.map((color) => (
                  <div
                    key={color}
                    className="inline-flex items-center gap-1.5 bg-white/5 border border-white/5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-neutral-400">{color}</span>
                    <button
                      type="button"
                      onClick={() => removeColor(color)}
                      className="text-neutral-500 hover:text-[#e9204f] transition cursor-pointer"
                    >
                      <IoCloseOutline size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* DUAL FILE MOCKUP DROPZONES [1, 1.3.1] */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* Front File */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-neutral-500 tracking-wider pl-1">Front Image</label>
                <div className="relative border-2 border-dashed border-white/10 hover:border-[#e9204f]/40 bg-white/[0.01] hover:bg-white/[0.02] rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition select-none h-32">
                  <input type="file" accept="image/png" onChange={handleFrontFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  {frontPreview ? (
                    <div className="relative w-full h-full p-2">
                      <Image fill src={frontPreview} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-neutral-500">
                      <IoCloudUploadOutline size={18} />
                      <span className="text-[8px] font-black uppercase tracking-widest">Select Front</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Back File */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-neutral-500 tracking-wider pl-1">Back Image</label>
                <div className="relative border-2 border-dashed border-white/10 hover:border-[#e9204f]/40 bg-white/[0.01] hover:bg-white/[0.02] rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition select-none h-32">
                  <input type="file" accept="image/png" onChange={handleBackFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  {backPreview ? (
                    <div className="relative w-full h-full p-2">
                      <Image fill src={backPreview} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-neutral-500">
                      <IoCloudUploadOutline size={18} />
                      <span className="text-[8px] font-black uppercase tracking-widest">Select Back</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Progress indicators */}
            {uploadProgress > 0 && (
              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400">
                  <span>Uploading assets...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full primary-bg transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting || !frontFile || !backFile || !title.trim() || !basePrice}
              className="primary-bg cursor-pointer w-full py-4 mt-2 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition duration-150 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <span>Publishing Product...</span> : <span>Publish Product Blank</span>}
            </button>

          </form>

        </div>

        {/* RIGHT COLUMN: Active Catalog Log List */}
        <div className="lg:col-span-7 bg-[#131315] border border-white/5 p-6 md:p-8 rounded-[2rem] shadow-2xl flex flex-col gap-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
            <IoShirtOutline size={16} /> Catalog Products ({productsList.length})
          </h2>

          <div className="max-h-[640px] overflow-y-auto no-scrollbar flex flex-col gap-3">
            {productsList.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="flex items-center gap-4 min-w-0">
                  {/* Image Grid Switcher Preview */}
                  <div className="relative w-12 h-12 bg-white/5 rounded-xl border border-white/10 p-1 flex items-center justify-center shrink-0">
                    <Image fill src={product.image} alt={product.title} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-extrabold text-sm text-neutral-100 truncate">{product.title}</span>
                    <span className="text-[10px] text-neutral-500 font-extrabold mt-0.5 uppercase tracking-wider">{product.category} — {product.base_price.toFixed(2)} USD</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-2.5 rounded-xl hover:bg-red-500/5 text-neutral-500 hover:text-[#e9204f] transition cursor-pointer"
                  title="Delete product"
                >
                  <IoTrashOutline size={16} />
                </button>
              </div>
            ))}

            {productsList.length === 0 && (
              <div className="text-center py-12 text-neutral-500 text-xs font-black uppercase tracking-widest">
                No products in your catalog yet
              </div>
            )}
          </div>
        </div>

      </div>

    </main>
  );
}