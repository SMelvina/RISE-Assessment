import React from 'react';
import { Pillar } from '../types';
import { PILLAR_PASTELS } from '../data/dimensions';
import { BrandLogo } from './BrandLogo';
import { ArtisticLevelGraphic } from './ArtisticLevelGraphic';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PillarIntroScreenProps {
  pillar: Pillar;
  participantName: string;
  onBeginPillar: () => void;
  onBack: () => void;
  onHomeClick?: () => void;
}

export const PillarIntroScreen: React.FC<PillarIntroScreenProps> = ({
  pillar,
  participantName,
  onBeginPillar,
  onBack,
  onHomeClick,
}) => {
  const pastel = PILLAR_PASTELS[pillar.number] || {
    bg: '#6FB995',
    text: '#0C2819',
    name: pillar.name,
    dimensionId: pillar.dimension,
  };

  const getPersonalizedHeadline = () => {
    if (pillar.number === 1) {
      return `${participantName}, your journey starts with understanding who you are.`;
    }
    if (pillar.number === 6) {
      return `${participantName}, this is where vision meets real-world execution.`;
    }
    if (pillar.number === 9) {
      return `${participantName}, the final stage explores building beyond yourself.`;
    }
    return pillar.headline;
  };

  const renderHighlightedIntroBody = (text: string, levelName: string) => {
    if (!text || !levelName) return text;
    const regex = new RegExp(`\\b(${levelName})\\b`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => {
      if (part.toLowerCase() === levelName.toLowerCase()) {
        return (
          <strong key={i} className="font-bold italic text-yellow-300">
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between select-none transition-colors duration-500 text-white"
      style={{ backgroundColor: pastel.introBg || '#024F28' }}
    >
      {/* Top Header: Brand Logo on TOP LEFT + Previous action on RIGHT */}
      <header className="w-full px-5 py-5 sm:px-8 md:px-14 lg:px-20 flex items-center justify-between border-b border-white/15 backdrop-blur-xs">
        <BrandLogo variant="white" size="md" showSubtitle={true} onClick={onHomeClick} />

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[16px] bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold tracking-wider uppercase transition-all group backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Previous</span>
        </button>
      </header>

      {/* Main Center Content matching First Page Spacing */}
      <main className="w-full px-5 sm:px-8 md:px-14 lg:px-20 my-auto py-8 lg:py-12 animate-screen-in grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
        {/* Left Column: Editorial Narrative & Action with White Typography Variants */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-xs font-semibold tracking-wide uppercase self-start">
            <span>Stage 0{pillar.number} · {pillar.dimension}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.15] text-white">
            {getPersonalizedHeadline()}
          </h1>

          <p className="font-serif text-2xl sm:text-3xl italic font-normal text-white/95">
            "{pillar.governingQuestion}"
          </p>

          <p className="text-base sm:text-lg leading-relaxed font-sans font-normal max-w-2xl pt-2 text-white/85">
            {renderHighlightedIntroBody(pillar.introductionBody, pillar.name)}
          </p>

          <div className="pt-6">
            <button
              type="button"
              onClick={onBeginPillar}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-[16px] bg-white hover:bg-warm-100 text-charcoal font-bold text-base transition-all shadow-2xl group cursor-pointer"
            >
              <span>Begin {pillar.name} Assessment</span>
              <div className="w-7 h-7 rounded-[10px] bg-charcoal text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5 shadow-sm">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Unique Artistic Graphic Level Text using Luminous White Accent */}
        <div className="lg:col-span-5 xl:col-span-5 flex items-center justify-center lg:justify-end">
          <ArtisticLevelGraphic pillar={pillar} textColor="#FFFFFF" />
        </div>
      </main>

      {/* Minimal Footer matching First Page Spacing */}
      <footer className="w-full px-5 py-4 sm:px-8 md:px-14 lg:px-20 border-t border-white/15 text-xs font-serif italic flex items-center justify-between text-white/75">
        <span>{pillar.philosophy}</span>
        <span className="font-sans text-[11px] not-italic text-white/80">Phoszade Toolkit · Stage 0{pillar.number}</span>
      </footer>
    </div>
  );
};
