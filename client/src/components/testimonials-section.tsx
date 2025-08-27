import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Michael Rodriguez",
      role: "BMW M3 Owner",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64",
      rating: 5,
      review: "CarTunez transformed my BMW with an incredible matte black wrap. The attention to detail and quality is unmatched. I get compliments everywhere I go!"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Tesla Model S Owner",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64",
      rating: 5,
      review: "The real-time customization tool is amazing! I could see exactly how my car would look before committing. The final result exceeded my expectations."
    },
    {
      id: 3,
      name: "David Chen",
      role: "Ford Mustang GT Owner",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64",
      rating: 5,
      review: "Professional service from start to finish. The racing stripes on my Mustang look perfect, and the installation was flawless. Highly recommended!"
    }
  ];

  const stats = [
    { value: "500+", label: "Cars Transformed", color: "text-primary" },
    { value: "99%", label: "Customer Satisfaction", color: "text-accent" },
    { value: "24h", label: "Average Turnaround", color: "text-destructive" },
    { value: "5★", label: "Average Rating", color: "text-chart-4" }
  ];

  return (
    <section className="py-20 bg-background" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="testimonials-title">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground" data-testid="testimonials-description">
            Real reviews from satisfied car enthusiasts
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              className="hover:bg-card/80 transition-colors"
              data-testid={`testimonial-${testimonial.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-muted-foreground">5.0</span>
                </div>
                <blockquote className="text-foreground mb-4" data-testid={`testimonial-review-${testimonial.id}`}>
                  "{testimonial.review}"
                </blockquote>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar}
                    alt={`${testimonial.name} profile picture`}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                    data-testid={`testimonial-avatar-${testimonial.id}`}
                  />
                  <div>
                    <div className="font-semibold text-foreground" data-testid={`testimonial-name-${testimonial.id}`}>
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground" data-testid={`testimonial-role-${testimonial.id}`}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center" data-testid={`stat-${index}`}>
              <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`} data-testid={`stat-value-${index}`}>
                {stat.value}
              </div>
              <div className="text-muted-foreground" data-testid={`stat-label-${index}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
