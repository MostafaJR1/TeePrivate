"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import Image from "next/image"

interface ImageSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (imageUrl: string) => void
}

const supabase = createClient()

// Mock brand/stock designs
const BRAND_DESIGNS = [
  { id: "b1", url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&auto=format&fit=crop&q=80", name: "Design 1" },
  { id: "b2", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80", name: "Design 2" },
  { id: "b3", url: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&auto=format&fit=crop&q=80", name: "Design 3" },
  { id: "b4", url: "https://images.unsplash.com/photo-1549887534-f35c7c62a16a?w=400&auto=format&fit=crop&q=80", name: "Design 4" },
  { id: "b5", url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format&fit=crop&q=80", name: "Design 5" },
  { id: "b6", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80", name: "Design 6" },
]

// Mock user uploads
const USER_UPLOADS = [
  { id: "u1", url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&auto=format&fit=crop&q=80", name: "Upload 1" },
  { id: "u2", url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=80", name: "Upload 2" },
]

export function ImageSelectorModal({ isOpen, onClose, onSelect }: ImageSelectorModalProps) {
  const [activeTab, setActiveTab] = useState<"brand" | "uploads">("brand")
  const [searchQuery, setSearchQuery] = useState("")
  const [dbStockDesigns, setDbStockDesigns] = useState<any[]>([])
  const modalRef = useRef<HTMLDivElement>(null)

  // Fetch stock designs from database
  useEffect(() => {
    if (activeTab === "brand") {
      const fetchDesigns = async () => {
        const { data } = await supabase
          .from("stock_designs")
          .select("id, url")
          .order("created_at", { ascending: false })
        if (data) setDbStockDesigns(data)
      }
      fetchDesigns()
    }
  }, [activeTab])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const brandImages = dbStockDesigns.length > 0 ? dbStockDesigns : BRAND_DESIGNS
  const filteredBrand = brandImages.filter(img =>
    img.name?.toLowerCase().includes(searchQuery.toLowerCase()) || !searchQuery
  )
  const filteredUploads = USER_UPLOADS.filter(img =>
    img.name?.toLowerCase().includes(searchQuery.toLowerCase()) || !searchQuery
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-3xl max-h-[80vh] rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 p-6">
              <h2 className="text-lg font-semibold text-white">Select Image</h2>
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 px-6 pt-4">
              <button
                onClick={() => setActiveTab("brand")}
                className={`pb-3 px-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === "brand"
                    ? "text-white border-[#e9204f]"
                    : "text-neutral-400 border-transparent hover:text-white"
                }`}
              >
                Brand Designs
              </button>
              <button
                onClick={() => setActiveTab("uploads")}
                className={`pb-3 px-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === "uploads"
                    ? "text-white border-[#e9204f]"
                    : "text-neutral-400 border-transparent hover:text-white"
                }`}
              >
                My Uploads
              </button>
            </div>

            {/* Search */}
            <div className="px-6 py-4 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#e9204f] focus:bg-white/[0.05] transition-all"
                />
              </div>
            </div>

            {/* Image Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-3 gap-4">
                {activeTab === "brand" ? (
                  filteredBrand.length > 0 ? (
                    filteredBrand.map((img) => (
                      <motion.button
                        key={img.id}
                        onClick={() => {
                          onSelect(img.url)
                          onClose()
                        }}
                        className="group relative aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-[#e9204f] transition-all hover:shadow-lg hover:shadow-[#e9204f]/20"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Image
                          src={img.url}
                          alt={img.name}
                          fill
                          className="object-cover group-hover:opacity-80 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                        </div>
                      </motion.button>
                    ))
                  ) : (
                    <div className="col-span-3 py-12 text-center text-neutral-400">No images found</div>
                  )
                ) : (
                  filteredUploads.length > 0 ? (
                    filteredUploads.map((img) => (
                      <motion.button
                        key={img.id}
                        onClick={() => {
                          onSelect(img.url)
                          onClose()
                        }}
                        className="group relative aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-[#e9204f] transition-all hover:shadow-lg hover:shadow-[#e9204f]/20"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Image
                          src={img.url}
                          alt={img.name}
                          fill
                          className="object-cover group-hover:opacity-80 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                        </div>
                      </motion.button>
                    ))
                  ) : (
                    <div className="col-span-3 py-12 text-center text-neutral-400">No uploads yet</div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
