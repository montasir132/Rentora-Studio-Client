import HeroSection from "@/components/banner";
import { CategoriesSection } from "@/components/categories-section";
import { BookingSteps } from "@/components/booking-steps";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background font-sans">
      <HeroSection />
      <CategoriesSection />
      <BookingSteps />

    </div>
  );
}
