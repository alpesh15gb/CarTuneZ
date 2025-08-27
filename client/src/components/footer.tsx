import { Logo } from "./logo";
import { Facebook, Instagram, Youtube, Send, Heart } from "lucide-react";

export function Footer() {
  const serviceLinks = [
    "Vinyl Wraps & Films",
    "Wheel Customization",
    "Racing Stripes & Decals",
    "Paint Protection Film",
    "Window Tinting",
    "Custom Design Studio"
  ];

  const companyLinks = [
    "About Us",
    "Our Team", 
    "Gallery",
    "Testimonials",
    "Careers",
    "Contact"
  ];

  const supportLinks = [
    "FAQ",
    "Warranty",
    "Care Instructions",
    "Financing Options",
    "Privacy Policy",
    "Terms of Service"
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Send, href: "#", label: "TikTok" }
  ];

  return (
    <footer className="bg-card border-t border-border" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Logo size="sm" className="mb-4" />
            <p className="text-muted-foreground text-sm mb-4" data-testid="footer-description">
              Premium car customization and styling services. Transform your vehicle with our expert craftsmanship and cutting-edge technology.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  data-testid={`footer-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="font-semibold text-foreground mb-4" data-testid="footer-services-title">
              Services
            </h3>
            <ul className="space-y-2 text-sm">
              {serviceLinks.map((service, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`footer-service-link-${index}`}
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4" data-testid="footer-company-title">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`footer-company-link-${index}`}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4" data-testid="footer-support-title">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`footer-support-link-${index}`}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm" data-testid="footer-copyright">
            © 2024 CarTunez. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-muted-foreground text-sm" data-testid="footer-tagline">
              Built with precision and passion
            </span>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4 text-destructive" />
              <span className="text-muted-foreground text-sm">by CarTunez Team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
