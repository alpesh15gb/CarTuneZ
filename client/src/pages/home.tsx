import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { CustomizerTool } from "@/components/customizer-tool";
import { BeforeAfterShowcase } from "@/components/before-after-slider";
import { ServicesSection } from "@/components/services-section";
import { GallerySection } from "@/components/gallery-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="home-page">
      <Navigation />
      <HeroSection />
      <CustomizerTool />
      <BeforeAfterShowcase />
      <ServicesSection />
      <GallerySection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
