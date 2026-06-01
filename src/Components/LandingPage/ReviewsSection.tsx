"use client";

import { motion } from "framer-motion";
import { LuBadgeCheck } from "react-icons/lu";

interface Review {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  avatarBg: string;
  content: string;
  date: string;
  isVerified: boolean;
}

const row1Reviews: Review[] = [
  {
    id: "r1-1",
    name: "Sarah Jenkins",
    handle: "sarahj_art",
    avatar: "SJ",
    avatarBg: "bg-blue-100 text-blue-800",
    content: "Uploaded my digital illustration sets on @TeePrivate last week. Already had 14 sales, and my customers are raving about the fabric soft quality! 🎨✨",
    date: "2h ago",
    isVerified: true,
  },
  {
    id: "r1-2",
    name: "Alex Rivera",
    handle: "ariveratech",
    avatar: "AR",
    avatarBg: "bg-emerald-100 text-emerald-800",
    content: "Highly recommend TeePrivate for creators. The 3D builder tool is super intuitive compared to other platforms. Customized a heavy hoodie and it came out clean.",
    date: "5h ago",
    isVerified: false,
  },
  {
    id: "r1-3",
    name: "David K.",
    handle: "davidcreates_co",
    avatar: "DK",
    avatarBg: "bg-purple-100 text-purple-800",
    content: "Moved my entire store apparel inventory here. Margins are significantly better and global fulfillment is taking roughly 3 days less. Absolute gamechanger.",
    date: "1d ago",
    isVerified: true,
  },
  {
    id: "r1-4",
    name: "Elena Rostova",
    handle: "elena_design",
    avatar: "ER",
    avatarBg: "bg-amber-100 text-amber-800",
    content: "If you're an independent artist struggling with POD color accuracy, try this out. The print saturation on tee blanks is insanely accurate. 10/10.",
    date: "2d ago",
    isVerified: true,
  },
];

const row2Reviews: Review[] = [
  {
    id: "r2-1",
    name: "Marcus Brodie",
    handle: "marcus_b",
    avatar: "MB",
    avatarBg: "bg-rose-100 text-rose-800",
    content: "Just designed a matching set for my local run club. No minimum order limit is a huge win for small group custom orders! Appreciate the fast delivery too.",
    date: "3h ago",
    isVerified: false,
  },
  {
    id: "r2-2",
    name: "Chloe Chen",
    handle: "chlo_studio",
    avatar: "CC",
    avatarBg: "bg-indigo-100 text-indigo-800",
    content: "Customer support actually replies within minutes. Had a shipping address issue and they resolved it before the package even went out. Outstanding service.",
    date: "12h ago",
    isVerified: true,
  },
  {
    id: "r2-3",
    name: "Jordan Vance",
    handle: "jv_merch",
    avatar: "JV",
    avatarBg: "bg-teal-100 text-teal-800",
    content: "Zero risk, zero upfront fees. Just set up my custom merch line under 15 minutes. Tees feel ultra-premium. TeePrivate is definitely leading right now.",
    date: "1d ago",
    isVerified: true,
  },
  {
    id: "r2-4",
    name: "Tasha Harris",
    handle: "tash_trend",
    avatar: "TH",
    avatarBg: "bg-orange-100 text-orange-800",
    content: "Customized a gift t-shirt for my sister's graduation. The print quality is crisp and doesn't crack or wash out. Super pleased with how it turned out!",
    date: "3d ago",
    isVerified: false,
  },
];

// Reusable Tweet/Review Card Component
function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex-shrink-0 w-[320px] md:w-[360px] p-5 bg-white rounded-2xl border border-black/5 hover:border-black/10 shadow-sm transition duration-200 flex flex-col justify-between">
      <div>
        {/* Header (User Info + X Logo) */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            {/* Fallback Custom Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${review.avatarBg}`}>
              {review.avatar}
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1">
                <span className="font-bold text-neutral-800 text-sm">{review.name}</span>
                {review.isVerified && (
                  <LuBadgeCheck size={14} className="fill-blue-500 text-white" />
                )}
              </div>
              <span className="text-xs text-neutral-400 font-medium">@{review.handle}</span>
            </div>
          </div>
          {/* Custom SVG X.com Logo */}
          <svg className="w-4.5 h-4.5 text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>

        {/* Content */}
        <p className="text-neutral-600 text-sm text-wrap leading-relaxed mb-4">
          {review.content.length > 90 ? review.content.slice(0, 90) + "..." : review.content}
        </p>
      </div>

      {/* Footer Timestamp */}
      <span className="text-[11px] font-semibold text-neutral-400">{review.date}</span>
    </div>
  );
}

export function ReviewsSection() {
  return (
    <section className="py-16 md:py-24 bg-[#FAF9F6] border-y border-neutral-100 overflow-hidden relative">
      
      {/* Dynamic Keyframe style block for performance loop */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 35s linear infinite;
        }
        .marquee-container:hover .animate-marquee,
        .marquee-container:hover .animate-marquee-reverse {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-[1300px] mx-auto px-6 md:px-12 mb-12 text-center">
        {/* Entrance Animation using Motion */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-extrabold tracking-widest primary-text uppercase mb-2 block">
            SOCIAL PROOF
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-neutral-800 leading-tight mb-4">
            Loved by creators & custom builders
          </h2>
          <p className="text-sm md:text-base text-neutral-500 max-w-xl mx-auto font-medium">
            Real feedback and unsponsored shoutouts pulled directly from our community on X.
          </p>
        </motion.div>
      </div>

      {/* Infinite Scroll Container (Pauses loop natively on hover) */}
      <div className="marquee-container flex flex-col gap-5 w-full relative">
        
        {/* Soft Fades for visual gradient boundaries */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#FAF9F6] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#FAF9F6] to-transparent z-10 pointer-events-none" />

        {/* ROW 1: Right to Left */}
        <div className="flex overflow-hidden w-full">
          <div className="flex gap-5 animate-marquee whitespace-nowrap">
            {/* Render reviews twice for seamless loop */}
            {row1Reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
            {row1Reviews.map((review) => (
              <ReviewCard key={`${review.id}-dup`} review={review} />
            ))}
          </div>
        </div>

        {/* ROW 2: Left to Right */}
        <div className="flex overflow-hidden w-full">
          <div className="flex gap-5 animate-marquee-reverse whitespace-nowrap">
            {row2Reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
            {row2Reviews.map((review) => (
              <ReviewCard key={`${review.id}-dup`} review={review} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}