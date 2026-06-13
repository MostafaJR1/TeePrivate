import dynamic from "next/dynamic";
import { PublicHeader } from "@/Components/LandingPage/PublicHeader";
import { HeroSection } from "@/Components/LandingPage/HeroSection";
import { getVerifiedServerUser, ServerUser } from "@/utils/supabase/server-auth";
import { getGlobalProducts } from "@/utils/supabase/products";

// Below-the-fold components are lazy-loaded. 
// setting ssr: true ensures Next.js pre-renders the HTML for SEO, 
// but defers loading their heavy JS bundles until needed [1.1.2].
const DesignSlider = dynamic(() => import("@/Components/LandingPage/DesignSlider").then(mod => mod.DesignSlider), { ssr: true });
const StepsSection = dynamic(() => import("@/Components/LandingPage/StepsSection").then(mod => mod.StepsSection), { ssr: true });
const ProductGrid = dynamic(() => import("@/Components/LandingPage/ProductGrid").then(mod => mod.ProductGrid), { ssr: true });
const ReviewsSection = dynamic(() => import("@/Components/LandingPage/ReviewsSection").then(mod => mod.ReviewsSection), { ssr: true });
const TrustBanner = dynamic(() => import("@/Components/LandingPage/TrustBanner").then(mod => mod.TrustBanner), { ssr: true });
const ProfitCalculator = dynamic(() => import("@/Components/LandingPage/ProfitCalculator").then(mod => mod.ProfitCalculator), { ssr: true });
const Footer = dynamic(() => import("@/Components/LandingPage/Footer").then(mod => mod.Footer), { ssr: true });

export default async function Home() {
  // Pre-render auth state directly on the server to prevent initial layout flickering [1.1.8]
  const user = (await getVerifiedServerUser()) as ServerUser || null;

  const cachedProducts = await getGlobalProducts();
  return (
    <div className="w-full">
      {/* Eagerly loaded elements (Above the fold) */}
      <PublicHeader initialUser={user} />
      <HeroSection />

      {/* Lazy-loaded elements (Below the fold) [1.1.2] */}
      <DesignSlider />
      <StepsSection />
      <ProductGrid initialProducts={cachedProducts} />
      <ReviewsSection />
      <TrustBanner />
      <ProfitCalculator />
      <Footer />
    </div>
  );
}