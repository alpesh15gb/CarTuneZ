import { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
  title: string;
  description: string;
}

function BeforeAfterSlider({ 
  beforeImage, 
  afterImage, 
  beforeAlt, 
  afterAlt, 
  title, 
  description 
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  return (
    <div className="space-y-4">
      <div 
        ref={sliderRef}
        className="relative before-after-slider rounded-xl overflow-hidden cursor-col-resize select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        data-testid="before-after-slider"
      >
        {/* Before Image */}
        <img 
          src={beforeImage}
          alt={beforeAlt}
          className="w-full h-auto"
          draggable={false}
          data-testid="before-image"
        />
        
        {/* After Image */}
        <img 
          src={afterImage}
          alt={afterAlt}
          className="absolute inset-0 w-full h-auto"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
          }}
          draggable={false}
          data-testid="after-image"
        />
        
        {/* Slider Control */}
        <div 
          className="absolute inset-y-0 w-1 bg-white cursor-col-resize"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleMouseDown}
          data-testid="slider-control"
        >
          <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div className="flex space-x-1">
              <div className="w-0.5 h-4 bg-gray-700"></div>
              <div className="w-0.5 h-4 bg-gray-700"></div>
            </div>
          </div>
        </div>
        
        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
          Before
        </div>
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
          After
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground" data-testid="transformation-title">{title}</h3>
        <p className="text-muted-foreground" data-testid="transformation-description">{description}</p>
      </div>
    </div>
  );
}

export function BeforeAfterShowcase() {
  const transformations = [
    {
      beforeImage: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      afterImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      beforeAlt: "Regular sedan car before customization",
      afterAlt: "Sedan with custom racing stripes and modifications",
      title: "Racing Stripe Package",
      description: "Complete transformation with custom racing stripes and accent colors"
    },
    {
      beforeImage: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      afterImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      beforeAlt: "SUV before modification in standard configuration",
      afterAlt: "SUV with complete custom wrap and wheel modifications",
      title: "Full Wrap Transformation",
      description: "Complete vehicle wrap with custom wheels and detailing"
    }
  ];

  return (
    <section className="py-20 bg-card/30" data-testid="before-after-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="showcase-title">
            Amazing Transformations
          </h2>
          <p className="text-xl text-muted-foreground" data-testid="showcase-description">
            See the incredible before and after results of our car customizations
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {transformations.map((transformation, index) => (
            <BeforeAfterSlider
              key={index}
              {...transformation}
            />
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 transform hover:scale-105 transition-all duration-300"
            data-testid="button-see-more-transformations"
          >
            See More Transformations
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
