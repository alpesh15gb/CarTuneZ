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
      {/* Background with car image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&h=1200" 
          alt="Luxury sports car with custom modifications" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80"></div>
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
