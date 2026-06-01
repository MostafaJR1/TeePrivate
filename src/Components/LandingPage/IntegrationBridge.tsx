"use client";

import { motion } from "framer-motion";
import { IoSyncOutline, IoFlashOutline, IoShieldCheckmarkOutline } from "react-icons/io5";

interface IntegrationPlatform {
  name: string;
  logoText: string;
  colorClass: string;
  borderClass: string;
}

const platforms: IntegrationPlatform[] = [
  { name: "Shopify", logoText: "S", colorClass: "text-emerald-500 bg-emerald-500/10", borderClass: "border-emerald-500/20" },
  { name: "YouCan.shop", logoText: "Y", colorClass: "text-amber-500 bg-amber-500/10", borderClass: "border-amber-500/20" },
  { name: "Storeino", logoText: "St", colorClass: "text-blue-500 bg-blue-500/10", borderClass: "border-blue-500/20" },
  { name: "WooCommerce", logoText: "W", colorClass: "text-purple-500 bg-purple-500/10", borderClass: "border-purple-500/20" },
];

export function IntegrationBridge() {
  return (
    <section className="black-bg py-12 relative overflow-hidden">
      
      {/* Decorative center division lines representing connection tracks */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 opacity-20 pointer-events-none">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#e9204f] to-transparent w-full" />
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white to-transparent w-full" />
      </div>

      <div className="max-w-[1300px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* INNER CONTAINER (Floating glassmorphic transition panel) */}
        <div className="bg-white/[0.02] backdrop-blur-md rounded-[2.5rem] border border-white/5 p-8 md:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT COLUMN: Visual Sync Animation */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[220px] md:min-h-[260px]">
            
            {/* Pulsating Center Hub (TeePrivate) */}
            <div className="relative z-20 bg-[#1b1b1b] border-2 border-[#e9204f] w-20 h-20 rounded-full flex items-center justify-center shadow-lg shadow-[#e9204f]/20">
              <span className="font-black text-xs tracking-tight">TeeP</span>
              
              {/* Pulsating core rings */}
              <motion.span
                animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border border-[#e9204f]/60 pointer-events-none"
              />
            </div>

            {/* Orbiting Platforms (Representing 1-Click Connection) */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
              {platforms.map((platform, idx) => {
                // Trigonometric layout positions to spread them evenly around the hub
                const angle = (idx * Math.PI) / 2; 
                const radius = 100; // Orbit distance
                const xPos = Math.cos(angle) * radius;
                const yPos = Math.sin(angle) * radius;

                return (
                  <div key={platform.name} className="absolute">
                    {/* Glowing Connector Line */}
                    <svg className="absolute inset-0 overflow-visible pointer-events-none">
                      <line
                        x1="0"
                        y1="0"
                        x2={-xPos}
                        y2={-yPos}
                        className="stroke-[#e9204f]/20 stroke-1"
                        strokeDasharray="4 4"
                      />
                    </svg>

                    <motion.div
                      style={{ x: xPos, y: yPos }}
                      whileHover={{ scale: 1.1 }}
                      className={`relative z-10 w-12 h-12 rounded-full border flex items-center justify-center font-black text-sm select-none shadow-md ${platform.colorClass} ${platform.borderClass}`}
                      title={platform.name}
                    >
                      {platform.logoText}
                    </motion.div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT COLUMN: Value Propositions & Call-to-Action */}
          <div className="lg:col-span-6 flex flex-col justify-center gap-6">
            <div>
              <span className="text-[10px] font-black tracking-widest text-[#e9204f] uppercase block mb-1">
                AUTOMATION BRIDGE
              </span>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-tight mb-3">
                Connect your store, automate your hustle
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed font-medium">
                Once integrated, TeePrivate syncs directly with your catalog. We pull orders in real-time, print them on-demand, and dispatch them directly to our Moroccan shipping hubs.
              </p>
            </div>

            {/* Quick value rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="flex gap-3 items-start">
                <div className="text-[#e9204f] mt-0.5 p-1.5 bg-[#e9204f]/5 rounded-lg border border-[#e9204f]/10">
                  <IoSyncOutline size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-neutral-200">Instant Sync</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Orders flow automatically without manual file uploads.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="text-[#e9204f] mt-0.5 p-1.5 bg-[#e9204f]/5 rounded-lg border border-[#e9204f]/10">
                  <IoFlashOutline size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-neutral-200">Rapid COD Cashout</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Seamless cash-on-delivery settlements across major courier systems.</p>
                </div>
              </div>

            </div>

            {/* Bottom mini-action */}
            <div className="h-[1px] bg-white/5 w-full my-1" />
            
            <div className="flex items-center gap-2">
              <span className="text-[#e9204f]"><IoShieldCheckmarkOutline size={16} /></span>
              <span className="text-[11px] font-bold text-neutral-400">
                Works seamlessly with YouCan, Storeino, Shopify, and WooCommerce.
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}