"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { ServerUser } from "@/utils/supabase/server-auth";
import { 
  IoHomeOutline, IoHome,
  IoGridOutline, IoGrid,
  IoCartOutline, IoCart,
  IoCompassOutline, IoCompass,
  IoNotificationsOutline,
  IoSchoolOutline, IoLogOutOutline,
  IoSettingsOutline,
  IoCloudUploadOutline, // Imported for Admin Designs Upload [1]
  IoCloudUpload,
  IoShirtOutline, // Imported for Admin Products Upload [1]
  IoShirt
} from "react-icons/io5";
import Image from "next/image";

const supabase = createClient();

// Primary Visible Navigation Hub
const sidebarRoutes = [
  { tooltip: "Overview", href: "/u/dashboard", iconOutline: <IoHomeOutline size={20} />, iconSolid: <IoHome size={20} /> },
  { tooltip: "Product Catalog", href: "/u/catalog", iconOutline: <IoGridOutline size={20} />, iconSolid: <IoGrid size={20} /> },
  { tooltip: "Orders", href: "/u/orders", iconOutline: <IoCartOutline size={20} />, iconSolid: <IoCart size={20} /> },
  { tooltip: "Shipping Hubs", href: "/u/hubs", iconOutline: <IoCompassOutline size={20} />, iconSolid: <IoCompass size={20} /> },
];

// Dropdown Secondary Navigation Links
const dropdownRoutes = [
  { name: "Settings", href: "/u/settings", icon: <IoSettingsOutline size={16} /> },
  { name: "Guides & Help", href: "/u/guides", icon: <IoSchoolOutline size={16} /> },
];

export function SideBar({ user }: { user: ServerUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Safely check if the active user session has an admin role [1]
  const isAdmin = user?.role === "admin";

  // Dynamically append admin tools if authorized, maintaining original rendering array [1]
  const activeRoutes = [
    ...sidebarRoutes,
    ...(isAdmin
      ? [
          {
            tooltip: "Upload Designs",
            href: "/admin/designs",
            iconOutline: <IoCloudUploadOutline size={20} />,
            iconSolid: <IoCloudUpload size={20} />,
          },
          {
            tooltip: "Upload Products",
            href: "/admin/products",
            iconOutline: <IoShirtOutline size={20} />,
            iconSolid: <IoShirt size={20} />,
          },
        ]
      : []),
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  const getInitials = () => {
    if (!user) return "TP";
    return (user.storeName || user.email || "").substring(0, 2).toUpperCase();
  };

  return (
    <aside className="hidden lg:flex flex-col justify-between items-center w-[72px] h-screen bg-[#0e0e10] border-r border-white/5 text-neutral-400 py-5 select-none shrink-0 z-40 relative">
      
      {/* TOP: Brand Logo & Floating Add Button */}
      <div className="flex flex-col items-center gap-4 w-full">
        {/* TeePrivate Compact Geometric Logo */}
        <Link href="/u/dashboard">
          <Image src="/TeeDrop-Logo.png" alt="TeeDrop Logo" width={40} height={40} className="inline-block" />
        </Link>

        {/* Squircle Action Plus Button */}
        {/* <div className="relative group">
          <Link href="/u/editor" className="w-11 h-11 rounded-xl primary-bg text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer">
            <BiPlus size={20} />
          </Link>
          <div className="absolute left-16 ml-3 top-1/2 -translate-y-1/2 scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 transition-all duration-150 z-50 bg-[#1c1c1e] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-white/5 shadow-md whitespace-nowrap">
            Create Design
          </div>
        </div> */}

        <div className="w-[1px] h-6 bg-white/10 rounded-full my-1" />
      </div>

      {/* MIDDLE: Primary Navigation Icon Docks (Dynamically maps active routes depending on role) [1] */}
      <nav className="flex-1 flex flex-col gap-3.5 items-center w-full justify-start py-2">
        {activeRoutes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <div key={route.href} className="relative group">
              <Link
                href={route.href}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? "bg-white/10 text-white border border-white/5 shadow-sm" 
                    : "text-neutral-500 hover:text-neutral-100 hover:bg-white/5"
                }`}
              >
                {isActive ? route.iconSolid : route.iconOutline}
              </Link>
              {/* Tooltip now floats cleanly over the main page content [1] */}
              <div className="absolute left-16 ml-3 top-1/2 -translate-y-1/2 scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 transition-all duration-150 z-50 bg-[#1c1c1e] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-white/5 shadow-md whitespace-nowrap">
                {route.tooltip}
              </div>
            </div>
          );
        })}
      </nav>

      {/* BOTTOM: Notifications & Profile Dropdown */}
      <div className="flex flex-col items-center gap-3.5 w-full py-4 border-t border-white/5">
        
        {/* Notification Bell */}
        <div className="relative group">
          <Link href="#" className="w-11 h-11 rounded-xl flex items-center justify-center text-neutral-500 hover:text-neutral-100 hover:bg-white/5 transition duration-150 cursor-pointer relative">
            <IoNotificationsOutline size={20} />
            <span className="absolute -top-0.5 -right-0.5 bg-[#e9204f] text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-[#0e0e10]">
              14
            </span>
          </Link>
          <div className="absolute left-16 ml-3 top-1/2 -translate-y-1/2 scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 transition-all duration-150 z-50 bg-[#1c1c1e] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-white/5 shadow-md whitespace-nowrap">
            Notifications
          </div>
        </div>

      </div>

      {/* PROFILE DROPDOWN WRAPPER [1] */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full black-bg text-white flex items-center justify-center font-bold text-xs border border-white/5 shadow-sm cursor-pointer hover:border-white/25 transition"
              aria-label="User menu"
            >
              {getInitials()}
            </button>

            {/* UPWARD-SLIDING COMPACT DROPDOWN CARD [1] */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -10, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute left-16 bottom-0 w-56 bg-[#141416] border border-white/5 rounded-lg shadow-2xl p-2 z-50 flex flex-col gap-1 text-neutral-300"
                >
                  <div className="px-3 py-2.5 flex flex-col leading-tight border-b border-white/5 mb-1.5">
                    <span className="font-extrabold text-xs text-white truncate">{user.storeName || "My Store"}</span>
                    <span className="text-[9px] font-bold text-neutral-500 truncate mt-0.5">{user.email}</span>
                  </div>

                  {/* Dropdown Navigation mapped cleanly */}
                  {dropdownRoutes.map((route) => {
                    const isActive = pathname === route.href;
                    return (
                      <Link
                        key={route.href}
                        href={route.href}
                        onClick={() => setIsDropdownOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg border border-transparent hover:border-neutral-800 text-xs font-extrabold transition duration-150 ${
                          isActive ? "text-[#e9204f] bg-white/[0.02]" : "hover:text-white hover:bg-white/[0.02]"
                        }`}
                      >
                        <span className={isActive ? "text-[#e9204f]" : "text-neutral-500"}>{route.icon}</span>
                        <span>{route.name}</span>
                      </Link>
                    );
                  })}

                  <div className="h-[1px] bg-white/5 my-1" />

                  {/* Sign-Out option */}
                  <button
                    onClick={handleSignOut}
                    className="group flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg text-xs border border-transparent hover:border-red-500/10 font-extrabold text-neutral-500 hover:bg-red-500/5 hover:text-[#e9204f] transition duration-150 cursor-pointer"
                  >
                    <IoLogOutOutline size={16} className="group-hover:text-[#e9204f] text-neutral-500" />
                    <span>Log Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
    </aside>
  );
}