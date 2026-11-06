import HeroSection from "@/components/home/banner";
import { CategoriesSection } from "@/components/home/categories-section";
import { BookingSteps } from "@/components/home/booking-steps";
import { HostGuarantee } from "@/components/home/host-guarantee";
import FeaturedStudios from "@/components/home/FeaturedStudios";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background font-sans">
      <HeroSection />
      <FeaturedStudios />
      <CategoriesSection />
      <BookingSteps />
      <HostGuarantee />
    </div>
  );
}
