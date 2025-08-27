import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Play, ChevronDown } from "lucide-react";

export function HeroSection() {
  const scrollToCustomizer = () => {
    const element = document.querySelector('#customizer');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
      {/* Background with car video */}
      <div className="absolute inset-0 z-0">
        <video 
          src="/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          data-testid="hero-background-video"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/70"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main Logo and Branding */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <Logo size="lg" showText={false} />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold gradient-text tracking-wide" data-testid="hero-title">
              CAR TUNEZ
            </h1>
            <p className="text-xl md:text-2xl text-accent font-medium" data-testid="hero-tagline">
              GET YOUR CAR ROLLING IN STYLE
            </p>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground" data-testid="hero-subtitle">
              Where Dream Cars Become Reality
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="hero-description">
              Your all-in-one car customization and styling solution. Transform your vehicle with premium decor, custom vinyl wraps, and professional installations.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 transform hover:scale-105 transition-all duration-300"
              data-testid="button-watch-demo"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Demo
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={scrollToCustomizer}
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300"
              data-testid="button-start-customizing"
            >
              Start Customizing
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="text-accent text-2xl" />
      </div>
    </section>
  );
}
