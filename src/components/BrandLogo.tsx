import React from 'react';
import brandLogoWhiteSvg from '../assets/brand-logo-white.svg';
import brandLogoGreenSvg from '../assets/brand-logo-green.svg';

interface BrandLogoProps {
  variant?: 'white' | 'dark' | 'badge';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'white',
  size = 'md',
  showSubtitle = true,
  className = '',
  onClick,
}) => {
  const isDarkText = variant === 'dark';
  const logoSrc = isDarkText ? brandLogoGreenSvg : brandLogoWhiteSvg;
  const subtitleColor = isDarkText ? 'text-[#024F28]/80' : 'text-white/80';
  const dividerColor = isDarkText ? 'bg-[#024F28]/25' : 'bg-white/25';

  // Responsive sizing adjustments (sm: h-7, md: h-9, lg: h-12)
  const imgHeight =
    size === 'sm'
      ? 'h-6 sm:h-7'
      : size === 'lg'
      ? 'h-10 sm:h-12'
      : 'h-8 sm:h-9';

  const subtitleSize =
    size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[10px]';

  // Badge variant: displayed inside a dark brand green (#024F28) capsule
  if (variant === 'badge') {
    const badgeContent = (
      <>
        <img
          src={brandLogoWhiteSvg}
          alt="Phoszade"
          className={`${imgHeight} w-auto object-contain select-none drop-shadow-xs`}
          loading="eager"
        />

        {showSubtitle && (
          <>
            <div className="w-px h-4 bg-white/25" />
            <span className={`${subtitleSize} font-sans uppercase tracking-widest font-semibold text-white/90`}>
              Toolkit
            </span>
          </>
        )}
      </>
    );

    if (onClick) {
      return (
        <button
          type="button"
          onClick={onClick}
          aria-label="Phoszade - Return to Home"
          style={{ outline: 'none', boxShadow: 'none' }}
          className={`inline-flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-[#024F28] border border-[#036534] text-white cursor-pointer hover:brightness-110 transition-all outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:outline-none active:ring-0 border-0 ${className}`}
        >
          {badgeContent}
        </button>
      );
    }

    return (
      <div
        className={`inline-flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-[#024F28] border border-[#036534] shadow-sm text-white ${className}`}
      >
        {badgeContent}
      </div>
    );
  }

  // Standard representation:
  // variant="white": crisp white letters with authentic yellow light line on dark / brand green backgrounds
  // variant="dark": brand green letters with authentic yellow light line on light / white backgrounds
  const standardContent = (
    <>
      <img
        src={logoSrc}
        alt="Phoszade"
        className={`${imgHeight} w-auto object-contain select-none drop-shadow-xs`}
        loading="eager"
      />

      {showSubtitle && (
        <>
          <div className={`w-px h-4 ${dividerColor}`} />
          <span
            className={`${subtitleSize} font-sans uppercase tracking-widest font-semibold ${subtitleColor}`}
          >
            THE RISE Framework
          </span>
        </>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Phoszade - Return to Home"
        style={{ outline: 'none', boxShadow: 'none' }}
        className={`inline-flex items-center gap-3 sm:gap-3.5 select-none text-left cursor-pointer group outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:outline-none active:ring-0 border-0 transition-transform hover:scale-[1.01] ${className}`}
      >
        {standardContent}
      </button>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 sm:gap-3.5 select-none ${className}`}>
      {standardContent}
    </div>
  );
};
