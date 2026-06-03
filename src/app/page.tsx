import { DesignSlider } from "@/Components/LandingPage/DesignSlider";
import { Footer } from "@/Components/LandingPage/Footer";
import { HeroSection } from "@/Components/LandingPage/HeroSection";
import { ProductGrid } from "@/Components/LandingPage/ProductGrid";
import { ProfitCalculator } from "@/Components/LandingPage/ProfitCalculator";
import { PublicHeader } from "@/Components/LandingPage/PublicHeader";
import { ReviewsSection } from "@/Components/LandingPage/ReviewsSection";
import { StepsSection } from "@/Components/LandingPage/StepsSection";
import { TrustBanner } from "@/Components/LandingPage/TrustBanner";

export default function Home() {
  return (
    <div className="w-full">
        <PublicHeader />
        <HeroSection />
        <DesignSlider />
        <StepsSection />
        <ProductGrid />
        <ReviewsSection />
        <TrustBanner />
        <ProfitCalculator />
        <Footer />
    </div>
  );
}
