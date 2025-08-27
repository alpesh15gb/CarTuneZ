import logoImage from "@assets/Screenshot 2025-08-23 020426 - Edited_1756324728085.png";

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className = "" }: LogoProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24 md:w-32 md:h-32'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-3xl md:text-5xl'
  };

  const taglineSizes = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-lg md:text-xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${sizeClasses[size]} relative logo-glow ${size === 'lg' ? 'float-animation' : ''}`}>
        <img 
          src={logoImage} 
          alt="CarTunez Logo - Turbo with wings" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {showText && (
        <div>
          <div className={`${textSizes[size]} font-bold gradient-text tracking-wide`}>
            CAR TUNEZ
          </div>
          {size !== 'sm' && (
            <div className={`${taglineSizes[size]} text-muted-foreground ${size === 'lg' ? 'mt-2' : '-mt-1'}`}>
              GET YOUR CAR ROLLING IN STYLE
            </div>
          )}
        </div>
      )}
    </div>
  );
}
