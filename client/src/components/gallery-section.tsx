import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ZoomIn } from "lucide-react";

export function GallerySection() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All Projects" },
    { id: "wraps", label: "Wraps" },
    { id: "wheels", label: "Wheels" },
    { id: "stripes", label: "Stripes" },
    { id: "custom", label: "Custom" }
  ];

  const galleryItems = [
    {
      id: 1,
      category: "wraps",
      image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      alt: "Sports car with striking chrome wrap finish",
      title: "Chrome Wrap Package",
      subtitle: "Lamborghini Huracán"
    },
    {
      id: 2,
      category: "wheels",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      alt: "Custom painted wheels in bright blue with chrome accents",
      title: "Custom Wheel Paint",
      subtitle: "BMW M3 Wheels"
    },
    {
      id: 3,
      category: "stripes",
      image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      alt: "Muscle car with classic racing stripes down the center",
      title: "Racing Stripes",
      subtitle: "Ford Mustang GT"
    },
    {
      id: 4,
      category: "custom",
      image: "https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      alt: "Car with custom flame graphics and artistic design elements",
      title: "Custom Graphics",
      subtitle: "Chevrolet Camaro"
    },
    {
      id: 5,
      category: "wraps",
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      alt: "Luxury sedan with matte black wrap and red accents",
      title: "Matte Black Wrap",
      subtitle: "Mercedes-Benz S-Class"
    },
    {
      id: 6,
      category: "wheels",
      image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      alt: "Close-up of custom forged wheels with intricate spoke design",
      title: "Forged Wheels",
      subtitle: "Custom 20\" Set"
    }
  ];

  const filteredItems = activeFilter === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <section id="gallery" className="py-20 bg-card/30" data-testid="gallery-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="gallery-title">
            Our Work Gallery
          </h2>
          <p className="text-xl text-muted-foreground" data-testid="gallery-description">
            Explore our portfolio of stunning car transformations
          </p>
        </div>
        
        {/* Gallery Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "secondary"}
              onClick={() => setActiveFilter(filter.id)}
              className="font-medium"
              data-testid={`filter-${filter.id}`}
            >
              {filter.label}
            </Button>
          ))}
        </div>
        
        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="group cursor-pointer"
              data-testid={`gallery-item-${item.id}`}
            >
              <div className="relative overflow-hidden rounded-xl">
                <img 
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold" data-testid={`gallery-item-title-${item.id}`}>
                      {item.title}
                    </h3>
                    <p className="text-sm opacity-90" data-testid={`gallery-item-subtitle-${item.id}`}>
                      {item.subtitle}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button 
            variant="secondary" 
            size="lg"
            className="hover:bg-primary hover:text-primary-foreground transition-colors"
            data-testid="button-load-more"
          >
            Load More Projects
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
