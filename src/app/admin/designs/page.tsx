"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { 
  IoCloudUploadOutline, 
  IoCheckmarkCircleOutline, 
  IoTrashOutline, 
  IoWarningOutline,
  IoSettingsOutline,
  IoImageOutline
} from "react-icons/io5";

const supabase = createClient();

interface StockDesign {
  id: string;
  name: string;
  url: string;
  created_at: string;
}

export default function AdminDesignsPage() {
  const [designName, setDesignName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  
  // Transaction loading and status states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Admin ledger log list
  const [designsList, setDesignsList] = useState<StockDesign[]>([]);

  // 1. Fetch current catalog on mount [1]
  const fetchDesigns = async () => {
    const { data, error } = await supabase
      .from("stock_designs")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setDesignsList(data);
    if (error) console.error("Fails to load catalog:", error);
  };

  useEffect(() => {
    setTimeout(() => {
      fetchDesigns();
    }, 0); // Slight delay to ensure smooth loading experience
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  // 2. Main Cloudinary + Supabase secure upload handler [1.1.4, 1.3.1]
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !designName.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setUploadProgress(10); // Start progress bar

    try {
      // A. REST-based Direct Unsigned Cloudinary Upload [1.3.1]
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const presetName = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !presetName) {
        throw new Error("Cloudinary credentials are not configured in your .env.local file.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", presetName);

      setUploadProgress(40); // Hitting API

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to transmit asset data to Cloudinary.");
      }

      const cloudinaryData = await response.json();
      const secureUrl = cloudinaryData.secure_url; // Captured secure CDN url! [1.3.1]

      setUploadProgress(75); // Writing database row

      // B. Write record to public.stock_designs table [1.1.4]
      const { error: dbError } = await supabase
        .from("stock_designs")
        .insert([
          { name: designName, url: secureUrl }
        ]);

      if (dbError) throw dbError;

      setUploadProgress(100);
      setSuccessMessage("Design template successfully synchronized!");
      setDesignName("");
      setFile(null);
      setFilePreview(null);
      
      // Refresh list ledger
      fetchDesigns();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Logistics upload cycle failed.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setUploadProgress(0), 1000); // Clear progress bar
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this design?")) {
      const { error } = await supabase
        .from("stock_designs")
        .delete()
        .eq("id", id);

      if (!error) {
        fetchDesigns();
      } else {
        alert("Failed to delete design.");
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
          Manage Stock Designs
        </h1>
        <p className="text-neutral-400 text-xs md:text-sm mt-1">
          Upload new transparent PNG/SVG graphics directly to Cloudinary and sync them with Supabase [1.1.4, 1.3.1].
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: Upload Card Form */}
        <div className="lg:col-span-5 bg-[#131315] border border-white/5 p-6 md:p-8 rounded-[2rem] shadow-2xl relative">
          
          <h2 className="text-sm font-black uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-2">
            <IoSettingsOutline size={16} /> Upload New Design
          </h2>

          <AnimatePresence>
            {errorMessage && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2 bg-red-500/5 text-red-500 text-xs font-bold p-4 rounded-xl border border-red-500/10 leading-relaxed mb-6">
                <span className="shrink-0"><IoWarningOutline size={16} /></span>
                <span>{errorMessage}</span>
              </motion.div>
            )}
            {successMessage && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2 bg-emerald-500/5 text-emerald-500 text-xs font-bold p-4 rounded-xl border border-emerald-500/10 leading-relaxed mb-6">
                <span className="shrink-0"><IoCheckmarkCircleOutline size={16} /></span>
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleUpload} className="flex flex-col gap-5">
            
            {/* Design Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-neutral-500 tracking-wider pl-1">
                Design / Artwork Title
              </label>
              <input
                type="text"
                required
                placeholder="Retro Sunset"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 outline-none text-sm font-semibold focus:border-[#e9204f]/40 transition text-white"
              />
            </div>

            {/* File Drag / Drop Dropzone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-neutral-500 tracking-wider pl-1">
                Transparent Image File
              </label>
              <div className="relative border-2 border-dashed border-white/10 hover:border-[#e9204f]/40 bg-white/[0.01] hover:bg-white/[0.02] rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition select-none">
                <input
                  type="file"
                  accept="image/png, image/svg+xml"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {filePreview ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-24 h-24 bg-white/5 rounded-xl border border-white/10 p-2 overflow-hidden">
                      <img src={filePreview} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{file?.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-neutral-500">
                    <IoCloudUploadOutline size={28} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Select PNG / SVG Artwork</span>
                  </div>
                )}
              </div>
            </div>

            {/* Upload progress indicator */}
            {uploadProgress > 0 && (
              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400">
                  <span>Uploading to Cloudinary...</span>
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
              disabled={isSubmitting || !file || !designName.trim()}
              className="primary-bg cursor-pointer w-full py-4 mt-2 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition duration-150 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <span>Synchronizing Assets...</span> : <span>Publish Stock Design</span>}
            </button>

          </form>

        </div>

        {/* RIGHT COLUMN: Active Designs Catalog Log List */}
        <div className="lg:col-span-7 bg-[#131315] border border-white/5 p-6 md:p-8 rounded-[2rem] shadow-2xl flex flex-col gap-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
            <IoImageOutline size={16} /> Active Stock Catalog ({designsList.length})
          </h2>

          <div className="max-h-[500px] overflow-y-auto no-scrollbar flex flex-col gap-3">
            {designsList.map((design) => (
              <div key={design.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-12 h-12 bg-white/5 rounded-xl border border-white/10 p-1.5 flex items-center justify-center shrink-0">
                    <img src={design.url} alt={design.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-extrabold text-sm text-neutral-100 truncate">{design.name}</span>
                    <span className="text-[10px] text-neutral-500 font-bold mt-0.5 truncate">{design.url}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(design.id)}
                  className="p-2.5 rounded-xl hover:bg-red-500/5 text-neutral-500 hover:text-[#e9204f] transition cursor-pointer"
                  title="Remove design"
                >
                  <IoTrashOutline size={16} />
                </button>
              </div>
            ))}

            {designsList.length === 0 && (
              <div className="text-center py-12 text-neutral-500 text-xs font-black uppercase tracking-widest">
                No designs uploaded yet
              </div>
            )}
          </div>
        </div>

      </div>

    </main>
  );
}