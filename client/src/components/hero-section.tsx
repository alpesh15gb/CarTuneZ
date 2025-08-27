export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
      {/* Background with car video */}
      <div className="absolute inset-0 z-0">
        <video 
          src="/hero-video.mp4"
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
          data-testid="hero-background-video"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/70"></div>
      </div>
    </section>
  );
}
