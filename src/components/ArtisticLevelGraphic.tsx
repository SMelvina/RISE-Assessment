import React from 'react';
import { Pillar } from '../types';

interface ArtisticLevelGraphicProps {
  pillar: Pillar;
  className?: string;
  textColor?: string;
}

interface PillarPosterTheme {
  bgStart: string;
  bgEnd: string;
  letterColor: string;
  letterOpacity: number;
  glowColor: string;
}

// Distinct, rich poster palettes for each stage inspired by graphic art typography
const POSTER_THEMES: Record<number, PillarPosterTheme> = {
  // Dimension R (Realize - Deep emerald / forest greens)
  1: { bgStart: '#064624', bgEnd: '#0A6133', letterColor: '#022412', letterOpacity: 0.36, glowColor: '#6FB995' }, // Identity
  2: { bgStart: '#084C27', bgEnd: '#0C6A37', letterColor: '#032B16', letterOpacity: 0.36, glowColor: '#81C8A5' }, // Clarify
  3: { bgStart: '#09522B', bgEnd: '#0E723D', letterColor: '#042F19', letterOpacity: 0.36, glowColor: '#94D7B5' }, // Crystallize

  // Dimension I (Illuminate - Warm golden amber & yellow)
  4: { bgStart: '#573F05', bgEnd: '#785808', letterColor: '#2B1E02', letterOpacity: 0.38, glowColor: '#EED468' }, // Articulate
  5: { bgStart: '#5E4406', bgEnd: '#805D09', letterColor: '#2F2103', letterOpacity: 0.38, glowColor: '#F7E082' }, // Architect

  // Dimension S (Start - Vibrant bright orange)
  6: { bgStart: '#C44304', bgEnd: '#E65100', letterColor: '#2B0E02', letterOpacity: 0.36, glowColor: '#FF8A4C' }, // Launch
  7: { bgStart: '#CC4A07', bgEnd: '#EF6C00', letterColor: '#2B0E02', letterOpacity: 0.36, glowColor: '#FFA66E' }, // Build

  // Dimension E (Expand - Warm luminous peach)
  8: { bgStart: '#5C261B', bgEnd: '#7A3324', letterColor: '#2B0E02', letterOpacity: 0.36, glowColor: '#F6A890' }, // Scale
  9: { bgStart: '#4E1F16', bgEnd: '#6B2B1E', letterColor: '#2B0E02', letterOpacity: 0.36, glowColor: '#F6A890' }, // Lead
};

// Available photography assets for pillars
const PILLAR_IMAGES: Record<string, string> = {
  build: '/pillars/build.png',
  // identity: '/pillars/identity.png',
  // clarify: '/pillars/clarify.png',
  // crystallize: '/pillars/crystallize.png',
  // articulate: '/pillars/articulate.png',
  // architect: '/pillars/architect.png',
  // launch: '/pillars/launch.png',
  // scale: '/pillars/scale.png',
  // lead: '/pillars/lead.png',
};

export const ArtisticLevelGraphic: React.FC<ArtisticLevelGraphicProps> = ({
  pillar,
  className = '',
  textColor = '#FFFFFF',
}) => {
  const theme = POSTER_THEMES[pillar.number] || POSTER_THEMES[1];
  const customImage = PILLAR_IMAGES[pillar.id];

  if (customImage) {
    return (
      <div
        className={`relative w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[440px] aspect-square flex items-center justify-center select-none ${className}`}
      >
        {/* Ambient background glow matching pillar theme & brand gold */}
        <div
          className="absolute inset-0 rounded-[32px] blur-3xl opacity-35 pointer-events-none transform scale-95"
          style={{
            background: `radial-gradient(circle, #E39F00 0%, ${theme.glowColor} 60%, transparent 100%)`,
          }}
        />

        <div className="relative z-10 w-full h-full overflow-hidden rounded-[24px] sm:rounded-[28px] shadow-2xl border border-white/20 bg-charcoal">
          <img
            src={customImage}
            alt={`Stage 0${pillar.number} · ${pillar.name}`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  const nameUpper = pillar.name.toUpperCase();
  const letters = nameUpper.split('');
  const numLetters = letters.length;

  // ViewBox dimensions: 500w x 580h (sleek poster aspect ratio ~ 5:6)
  const width = 500;
  const height = 580;
  const colWidth = width / numLetters;

  // Hero foreground font sizing tailored to word length for maximum punch & balance
  let heroFontSize = 56;
  let heroLetterSpacing = 8;
  if (nameUpper.length >= 11) {
    heroFontSize = 38;
    heroLetterSpacing = 4;
  } else if (nameUpper.length >= 9) {
    heroFontSize = 44;
    heroLetterSpacing = 5;
  } else if (nameUpper.length >= 7) {
    heroFontSize = 50;
    heroLetterSpacing = 6;
  }

  return (
    <div
      className={`relative w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[460px] aspect-[500/580] flex items-center justify-center select-none ${className}`}
    >
      {/* Ambient background glow matching pillar theme & brand gold */}
      <div
        className="absolute inset-0 rounded-[36px] blur-3xl opacity-30 pointer-events-none transform scale-95"
        style={{
          background: `radial-gradient(circle, #E39F00 0%, ${theme.glowColor} 60%, transparent 100%)`,
        }}
      />

      {/* Main Poster SVG Composition */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full relative z-10 overflow-hidden rounded-[32px] sm:rounded-[36px] shadow-2xl"
        aria-label={pillar.name}
        role="img"
      >
        <defs>
          {/* Rich poster linear gradient */}
          <linearGradient id={`posterBg-${pillar.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.bgStart} />
            <stop offset="100%" stopColor={theme.bgEnd} />
          </linearGradient>

          {/* Central radial glow providing depth behind the bold typography */}
          <radialGradient id={`posterGlow-${pillar.id}`} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor={theme.glowColor} stopOpacity="0.22" />
            <stop offset="70%" stopColor={theme.bgEnd} stopOpacity="0.05" />
            <stop offset="100%" stopColor={theme.bgEnd} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Card Base */}
        <rect width={width} height={height} rx="36" fill={`url(#posterBg-${pillar.id})`} />

        {/* Depth Ambient Center Glow */}
        <rect width={width} height={height} rx="36" fill={`url(#posterGlow-${pillar.id})`} />

        {/* Typographic Background (Monumental Stretched Letters Spanning Canvas Top-to-Bottom) */}
        <g aria-hidden="true">
          {letters.map((char, idx) => {
            const x = (idx + 0.5) * colWidth;
            return (
              <text
                key={`${char}-${idx}`}
                x={x}
                y="290"
                textAnchor="middle"
                dominantBaseline="central"
                fill={theme.letterColor}
                fillOpacity={theme.letterOpacity}
                fontFamily="'Plus Jakarta Sans', Impact, 'Arial Black', -apple-system, sans-serif"
                fontWeight="900"
                fontSize="440"
                transform={`translate(${x}, 290) scale(1, 1.38) translate(${-x}, -290)`}
              >
                {char}
              </text>
            );
          })}
        </g>

        {/* Crisp Card Border */}
        <rect
          x="2"
          y="2"
          width={width - 4}
          height={height - 4}
          rx="34"
          fill="none"
          stroke="rgba(255, 255, 255, 0.22)"
          strokeWidth="2.5"
        />

        {/* Hero Foreground: JUST the bold text, with no other decorative elements */}
        <text
          x="250"
          y="290"
          textAnchor="middle"
          dominantBaseline="central"
          fill={textColor}
          fontFamily="'Plus Jakarta Sans', -apple-system, sans-serif"
          fontWeight="900"
          fontSize={heroFontSize}
          letterSpacing={heroLetterSpacing}
          className="uppercase select-none"
          style={{
            filter: 'drop-shadow(0 6px 20px rgba(0, 0, 0, 0.65))',
          }}
        >
          {pillar.name}
        </text>
      </svg>
    </div>
  );
};
