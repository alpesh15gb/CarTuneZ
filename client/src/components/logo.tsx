interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className = "" }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-6xl'
  };

  const wingSizes = {
    sm: { width: 'w-3', height: 'h-1.5', offset: '-left-1 -right-1' },
    md: { width: 'w-6', height: 'h-3', offset: '-left-2 -right-2' },
    lg: { width: 'w-16', height: 'h-8', offset: '-left-6 -right-6' }
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-5xl md:text-7xl'
  };

  const taglineSizes = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-xl md:text-2xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${sizeClasses[size]} relative logo-glow ${size === 'lg' ? 'float-animation' : ''}`}>
        {/* Main turbo body */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-red-500 rounded-full opacity-30"></div>
        
        {/* Turbo fan icon */}
        <div className={`${iconSizes[size]} text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" opacity="0.8" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <path d="M12 6V2M18 12H22M12 18V22M6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        
        {/* Left wing */}
        <div className={`absolute ${wingSizes[size].offset.split(' ')[0]} top-1/2 transform -translate-y-1/2`}>
          <div className={`${wingSizes[size].width} ${wingSizes[size].height} bg-gradient-to-r from-blue-500 to-transparent rounded-l-full`}></div>
        </div>
        
        {/* Right wing */}
        <div className={`absolute ${wingSizes[size].offset.split(' ')[1]} top-1/2 transform -translate-y-1/2`}>
          <div className={`${wingSizes[size].width} ${wingSizes[size].height} bg-gradient-to-l from-red-500 to-transparent rounded-r-full`}></div>
        </div>
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
