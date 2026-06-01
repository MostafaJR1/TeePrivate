"use client";

import { motion } from "framer-motion";

interface TrustItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function TrustBanner() {
  const trustItems: TrustItem[] = [
    {
      id: "trust-1",
      icon: (
        <svg
          className="w-14 h-14 text-[#e9204f]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          {/* Globe Grid lines */}
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20" />
          {/* Superimposed Package Badge */}
          <rect x="13" y="13" width="7" height="7" rx="1.5" fill="white" stroke="#1b1b1b" strokeWidth="1.5" />
          <path d="M16.5 13v7M13 16.5h7" stroke="#1b1b1b" strokeWidth="1" strokeLinecap="round" />
        </svg>
      ),
      title: "Trusted worldwide",
      description: "Over 10 million custom orders printed and successfully delivered across the globe.",
    },
    {
      id: "trust-2",
      icon: (
        <div className="relative">
          <svg
            className="w-14 h-14 text-[#e9204f]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            {/* Cut Diamond Geometry */}
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12l4 6-10 12L2 9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 3L9 9l3 12 3-12-2-6zM2 9h20M6 3l3 6M18 3l-3 6" />
          </svg>
          {/* Custom Sparkle Stars */}
          <span className="absolute -top-1 -right-1 text-xs animate-pulse text-[#e9204f]">✦</span>
          <span className="absolute bottom-2 -left-2 text-[10px] animate-pulse delay-150 text-[#e9204f]">✦</span>
        </div>
      ),
      title: "Unrivalled quality",
      description: "A 99.8% order acceptance rate powered by strict, multi-point color and print checks.",
    },
    {
      id: "trust-3",
      icon: (
        <svg
          className="w-14 h-14 text-[#e9204f]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          {/* Headset Arc */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a9 9 0 00-9 9v3a3 3 0 003 3h1a1 1 0 001-1v-5a1 1 0 00-1-1H4v-1a8 8 0 0116 0v1h-2a1 1 0 00-1 1v5a1 1 0 001 1h1a3 3 0 003-3v-3a9 9 0 00-9-9z" />
          {/* Mic Arm */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 17v2a2 2 0 01-2 2h-2" />
        </svg>
      ),
      title: "24/7 Support",
      description: "Our dedicated team of print-on-demand specialists are here to help you day and night.",
    },
  ];

  // Motion variants for staggering entrance on scroll
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  return (
    <section className="bg-white py-12 md:py-16 px-6 md:px-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-[1300px] mx-auto bg-[#F8F7F4] rounded-[2rem] border border-black/5 px-8 py-12 md:py-16 md:px-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-start">
          {trustItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="flex flex-col items-center text-center px-4"
            >
              {/* Icon Container */}
              <div className="mb-6 flex items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-neutral-100">
                {item.icon}
              </div>

              {/* Bold Title */}
              <h3 className="text-lg md:text-xl font-bold text-neutral-800 mb-2 tracking-tight">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-medium max-w-xs">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}