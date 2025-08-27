import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { SimpleCarCustomizer } from "@/components/simple-car-customizer";
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
      <section id="customizer" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" data-testid="customizer-title">
              3D Car Customizer
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="customizer-description">
              Experience real-time car customization with our advanced 3D technology. 
              Choose colors, adjust materials, and see your dream car come to life instantly.
            </p>
          </div>
          <SimpleCarCustomizer />
        </div>
      </section>
      <BeforeAfterShowcase />
      <ServicesSection />
      <GallerySection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
