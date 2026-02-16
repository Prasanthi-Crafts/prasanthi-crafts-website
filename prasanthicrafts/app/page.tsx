"use client";

import MaintenancePage from "./components/MaintenancePage";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategorySection from "./components/CategorySection";
import ProductSection from "./components/ProductSection";
import ReviewSection from "./components/ReviewSection";
import Footer from "./components/Footer";

export default function Home() {
  // Set this to true to show the maintenance page
  const isUnderMaintenance = true;

  if (isUnderMaintenance) {
    return <MaintenancePage />;
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />
      <Hero />
      <CategorySection />
      <ProductSection />
      <ReviewSection />
      <Footer />
    </main>
  );
}
