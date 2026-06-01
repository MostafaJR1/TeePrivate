"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoLocationOutline, IoWalletOutline } from "react-icons/io5";

interface MoroccanHub {
  id: string;
  cityName: string;
  deliveryTime: string;
  codFulfillment: string;
  topPercent: string; // Adjusted specifically for the new high-fidelity map coordinates
  leftPercent: string;
  details: string;
}

const moroccoHubs: MoroccanHub[] = [
  {
    id: "hub-tangier",
    cityName: "Tangier",
    deliveryTime: "24h - 48h",
    codFulfillment: "Immediate COD",
    topPercent: "6.6%",
    leftPercent: "70%",
    details: "Northern gateway hub connecting Mediterranean logistics and localized printing facilities.",
  },
  {
    id: "hub-oujda",
    cityName: "Oujda",
    deliveryTime: "48h",
    codFulfillment: "COD Support",
    topPercent: "12.5%",
    leftPercent: "90%",
    details: "Eastern region warehouse optimizing distributions across Oujda, Nador, and Berkane.",
  },
  {
    id: "hub-rabat",
    cityName: "Rabat",
    deliveryTime: "24h",
    codFulfillment: "Same-Day Cashout",
    topPercent: "21.6%",
    leftPercent: "54%",
    details: "Administrative capital hub facilitating instant express shipments to Rabat-Salé-Kénitra.",
  },
  {
    id: "hub-casablanca",
    cityName: "Casablanca",
    deliveryTime: "24h Same-Day",
    codFulfillment: "Same-Day Cashout",
    topPercent: "25%",
    leftPercent: "50%",
    details: "Our central print house and primary dispatch warehouse. Serves as the primary logistics heart of Morocco.",
  },
  {
    id: "hub-marrakech",
    cityName: "Marrakech",
    deliveryTime: "24h - 48h",
    codFulfillment: "Immediate COD",
    topPercent: "35%",
    leftPercent: "44%",
    details: "Southern-central gateway hub servicing local tourism businesses, creators, and regional deliveries.",
  },
  {
    id: "hub-agadir",
    cityName: "Agadir",
    deliveryTime: "24h - 48h",
    codFulfillment: "COD Support",
    topPercent: "46.6%",
    leftPercent: "37%",
    details: "Souss-Massa hub enabling streamlined print-on-demand delivery paths to southwest coastal markets.",
  },
  {
    id: "hub-laayoune",
    cityName: "Laayoune",
    deliveryTime: "48h - 72h",
    codFulfillment: "COD Support",
    topPercent: "68.3%",
    leftPercent: "23%",
    details: "Southern provinces distribution center managing regional package forwarding and courier lines.",
  },
  {
    id: "hub-dakhla",
    cityName: "Dakhla",
    deliveryTime: "48h - 72h",
    codFulfillment: "COD Support",
    topPercent: "85%",
    leftPercent: "12%",
    details: "Farthest southern port-side dispatch terminal serving local fashion brands and Saharan e-commerce stores.",
  },
];

export function MoroccoFulfillmentMap() {
  const [hoveredHub, setHoveredHub] = useState<MoroccanHub | null>(null);
  const [selectedHub, setSelectedHub] = useState<MoroccanHub>(moroccoHubs[3]); // Casablanca by default

  return (
    <section className="black-bg py-20 md:py-28 text-white overflow-hidden relative">
      
      {/* Background radial accent glow */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#e9204f]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[1300px] mx-auto px-6 md:px-12">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black tracking-tight mb-4"
          >
            No inventory, no upfront investment, no hassles...
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-neutral-400 font-medium text-sm md:text-base"
          >
            ...just premium local fulfillment & rapid nationwide delivery across Morocco
          </motion.p>
        </div>

        {/* LOGISTICS MAP & METRIC SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: High-Fidelity Morocco Outline Map */}
          <div className="lg:col-span-7 flex justify-center relative w-full h-[550px] md:h-[650px] bg-white/3 rounded-[2.5rem] border border-white/5 p-6 md:p-10 backdrop-blur-sm shadow-inner">
            
            <div className="relative w-full h-full max-w-[400px]">
              
              {/* High-Fidelity Path Map including Sahara steps and eastern border bends */}
              <svg
                viewBox="0 0 500 600"
                className="w-full h-full text-[#4a5568]/40 fill-current stroke-white/10 stroke-[1.5px]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M 350 40 
                         C 370 50, 390 60, 420 65 
                         L 450 75 
                         L 460 140 
                         L 420 180 
                         L 430 220 
                         L 410 240 
                         L 380 230 
                         L 350 260 
                         L 360 290 
                         L 330 310 
                         L 345 350 
                         L 260 350 
                         L 260 410 
                         L 150 410 
                         L 150 580 
                         L 40 580 
                         C 42 560, 55 525, 60 510 
                         C 75 470, 95 440, 115 410 
                         C 122 400, 126 390, 130 380 
                         C 145 350, 160 330, 170 310 
                         C 178 295, 182 290, 185 280 
                         C 190 265, 192 250, 195 240 
                         C 202 225, 205 220, 210 210 
                         C 225 185, 238 170, 250 150 
                         C 260 138, 265 134, 270 130 
                         C 280 120, 285 115, 290 110 
                         C 305 95, 312 85, 320 70 
                         Z" />
              </svg>

              {/* DYNAMIC CITY PULSATING HOTSPOTS */}
              {moroccoHubs.map((hub) => (
                <div
                  key={hub.id}
                  className="absolute cursor-pointer select-none group"
                  style={{ top: hub.topPercent, left: hub.leftPercent }}
                  onMouseEnter={() => setHoveredHub(hub)}
                  onMouseLeave={() => setHoveredHub(null)}
                  onClick={() => setSelectedHub(hub)}
                >
                  <div className="relative">
                    {/* Inner Core Solid Node */}
                    <span className={`block w-3.5 h-3.5 rounded-full transition-transform duration-200 group-hover:scale-125 shadow-md ${
                      selectedHub.id === hub.id ? "primary-bg" : "bg-white"
                    }`} />
                    
                    {/* Outer Radar Pulsating Ring */}
                    <motion.span
                      animate={{ scale: [1, 2.4], opacity: [0.75, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                      className={`absolute w-9 h-9 rounded-full border -left-[11px] -top-[11px] pointer-events-none ${
                        selectedHub.id === hub.id ? "border-[#e9204f]" : "border-white"
                      }`}
                    />
                  </div>

                  {/* Floating Micro-Tooltip */}
                  <AnimatePresence>
                    {hoveredHub?.id === hub.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 10, x: "-50%" }}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-white text-black text-[11px] font-extrabold px-3 py-1.5 rounded-lg shadow-xl border border-neutral-100 whitespace-nowrap"
                      >
                        {hub.cityName} ({hub.deliveryTime})
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

            </div>
          </div>

          {/* RIGHT: Selected Hub Logistics Details Panel */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedHub.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl p-8 md:p-10 text-black shadow-2xl flex flex-col gap-6"
              >
                {/* City name heading */}
                <div>
                  <span className="text-[10px] font-black tracking-widest text-[#e9204f] uppercase block mb-1">
                    SELECTED FULFILLMENT CENTER
                  </span>
                  <h3 className="text-3xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
                    <span>{selectedHub.cityName}</span>
                    <span className="text-sm bg-neutral-100 text-neutral-500 font-bold px-3 py-1 rounded-full border border-neutral-200">
                      Active Hub
                    </span>
                  </h3>
                </div>

                {/* Logistics Metrics Details */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                      <IoLocationOutline size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-400 uppercase">Transit Delivery Speed</p>
                      <p className="text-sm font-extrabold text-neutral-800">{selectedHub.deliveryTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                      <IoWalletOutline size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-400 uppercase">Cash on Delivery (COD)</p>
                      <p className="text-sm font-extrabold text-neutral-800">{selectedHub.codFulfillment}</p>
                    </div>
                  </div>
                </div>

                {/* Substantive Description */}
                <p className="text-neutral-500 text-sm md:text-base leading-relaxed">
                  {selectedHub.details}
                </p>

                {/* Action Button */}
                <div className="mt-2">
                  <button className="primary-bg cursor-pointer w-full py-4 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition duration-150">
                    Connect Store to {selectedHub.cityName} Hub
                  </button>
                  <p className="text-[10px] text-neutral-400 text-center mt-3 font-medium">
                    Integrated directly with leading domestic couriers.
                  </p>
                </div>

              </motion.div>
            </AnimatePresence>

            {/* Quick-switch list links */}
            <div className="flex flex-wrap gap-2 mt-6 justify-center lg:justify-start">
              {moroccoHubs.map((hub) => (
                <button
                  key={hub.id}
                  onClick={() => setSelectedHub(hub)}
                  className={`px-3 py-1.5 text-xs rounded-full font-bold cursor-pointer transition border ${
                    selectedHub.id === hub.id
                      ? "primary-bg border-transparent"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  {hub.cityName}
                </button>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}