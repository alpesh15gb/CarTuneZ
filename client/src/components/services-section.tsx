import { Card, CardContent } from "@/components/ui/card";
import { 
  Layers, 
  Settings, 
  Zap, 
  Shield, 
  Sun, 
  Palette,
  Check 
} from "lucide-react";

export function ServicesSection() {
  const services = [
    {
      icon: Layers,
      title: "Vinyl Wraps & Films",
      description: "Premium quality vinyl wraps in hundreds of colors and finishes including matte, gloss, satin, and carbon fiber textures.",
      features: [
        "Full vehicle wraps",
        "Partial wraps & accents",
        "3M & Avery Dennison films"
      ],
      gradient: "from-primary to-accent"
    },
    {
      icon: Settings,
      title: "Wheel Customization",
      description: "Transform your wheels with custom colors, finishes, and protective coatings for both style and durability.",
      features: [
        "Powder coating",
        "Custom paint jobs",
        "Protective ceramic coatings"
      ],
      gradient: "from-accent to-destructive"
    },
    {
      icon: Zap,
      title: "Racing Stripes & Decals",
      description: "Classic racing stripes, custom graphics, and performance-inspired decals to give your car that competitive edge.",
      features: [
        "Classic racing stripes",
        "Custom graphics design",
        "Performance decals"
      ],
      gradient: "from-destructive to-primary"
    },
    {
      icon: Shield,
      title: "Paint Protection Film",
      description: "Invisible protection that preserves your car's finish while maintaining its original appearance and value.",
      features: [
        "Clear protective film",
        "Self-healing technology",
        "10-year warranty"
      ],
      gradient: "from-chart-4 to-chart-2"
    },
    {
      icon: Sun,
      title: "Window Tinting",
      description: "Professional window tinting for privacy, UV protection, and enhanced style with various tint levels available.",
      features: [
        "Ceramic tint films",
        "UV & heat protection",
        "Lifetime warranty"
      ],
      gradient: "from-chart-5 to-chart-1"
    },
    {
      icon: Palette,
      title: "Custom Design Studio",
      description: "Work with our designers to create completely unique graphics, patterns, and styling that reflects your personality.",
      features: [
        "One-on-one consultation",
        "3D mockups included",
        "Unlimited revisions"
      ],
      gradient: "from-chart-3 to-chart-4"
    }
  ];

  return (
    <section id="services" className="py-20 bg-background" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="services-title">
            Complete Customization Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="services-description">
            From subtle enhancements to complete transformations, we offer every service to make your car unique
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="hover:bg-card/80 transition-all duration-300 transform hover:scale-105 group"
              data-testid={`service-card-${index}`}
            >
              <CardContent className="p-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2" data-testid={`service-title-${index}`}>
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-4" data-testid={`service-description-${index}`}>
                  {service.description}
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {service.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex} 
                      className="flex items-center"
                      data-testid={`service-feature-${index}-${featureIndex}`}
                    >
                      <Check className="w-4 h-4 text-accent mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
