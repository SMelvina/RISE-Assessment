import React from 'react';
import { Pillar } from '../types';
import { PILLAR_PASTELS } from '../data/dimensions';
import { BrandLogo } from './BrandLogo';
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

  const isLightBg =
    pillar.dimension === 'I' || pillar.dimension === 'E' || pillar.dimension === 'S';

  const highlightColor =
    pillar.dimension === 'I'
      ? 'text-[#724F00]'
      : pillar.dimension === 'E'
        ? 'text-[#8C3A2B]'
        : pillar.dimension === 'S'
          ? 'text-[#A03E06]'
          : 'text-yellow-300';

  const renderPersonalizedHeadline = () => {
    const formattedName = (
      <span
        className={`italic font-normal ${
          isLightBg ? `${highlightColor} font-semibold` : 'text-yellow-300'
        }`}
      >
        {participantName}
      </span>
    );

    if (pillar.number === 1) {
      return (
        <>
          {formattedName}, your journey starts with understanding who you are.
        </>
      );
    }
    if (pillar.number === 6) {
      return (
        <>
          {formattedName}, this is where vision meets real-world execution.
        </>
      );
    }
    if (pillar.number === 9) {
      return (
        <>
          {formattedName}, the final stage explores building beyond yourself.
        </>
      );
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
          <strong
            key={i}
            className={`font-bold italic ${
              isLightBg ? `${highlightColor} underline decoration-black/20 underline-offset-4` : 'text-yellow-300'
            }`}
          >
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col justify-between select-none transition-colors duration-500 ${
        isLightBg ? 'text-charcoal' : 'text-white'
      }`}
      style={{ backgroundColor: pastel.introBg || '#024F28' }}
    >
      {/* Top Header: Brand Logo on TOP LEFT + Previous action on RIGHT */}
      <header
        className={`w-full px-5 py-5 sm:px-8 md:px-14 lg:px-20 flex items-center justify-between border-b backdrop-blur-xs ${
          isLightBg ? 'border-black/10' : 'border-white/15'
        }`}
      >
        <BrandLogo variant={isLightBg ? 'dark' : 'white'} size="md" showSubtitle={true} onClick={onHomeClick} />

        <button
          type="button"
          onClick={onBack}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-[16px] text-xs font-semibold tracking-wider uppercase transition-all group backdrop-blur-md cursor-pointer ${
            isLightBg
              ? 'bg-black/10 hover:bg-black/20 text-charcoal border border-black/15'
              : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Previous</span>
        </button>
      </header>

      {/* Main Center Content: Focused Editorial Narrative */}
      <main className="w-full px-5 sm:px-8 md:px-14 lg:px-20 my-auto py-8 lg:py-16 animate-screen-in flex flex-col justify-center">
        <div className="max-w-3xl lg:max-w-4xl w-full mx-auto space-y-6 sm:space-y-8">
          {/* Level Title Tag with verified contrast */}
          <div
            className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border backdrop-blur-md text-xs sm:text-sm font-bold tracking-widest uppercase self-start shadow-sm ${
              isLightBg
                ? 'bg-black/10 border-black/15'
                : 'bg-black/30 border-white/15'
            }`}
            style={{
              color: isLightBg
                ? pillar.dimension === 'I'
                  ? '#6B4600'
                  : pillar.dimension === 'S'
                    ? '#A03E06'
                    : '#8C3A2B'
                : pastel.bg,
              borderColor: isLightBg ? 'rgba(0,0,0,0.15)' : `${pastel.bg}50`,
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: isLightBg
                  ? pillar.dimension === 'I'
                    ? '#724F00'
                    : pillar.dimension === 'S'
                      ? '#A03E06'
                      : '#8C3A2B'
                  : pastel.bg,
              }}
            />
            <span>{pillar.name}</span>
          </div>

          <h1
            className={`font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.15] ${
              isLightBg ? 'text-charcoal' : 'text-white'
            }`}
          >
            {renderPersonalizedHeadline()}
          </h1>

          <p
            className={`font-serif text-2xl sm:text-3xl italic font-normal ${
              isLightBg ? 'text-charcoal/90' : 'text-white/95'
            }`}
          >
            "{pillar.governingQuestion}"
          </p>

          <p
            className={`text-base sm:text-lg leading-relaxed font-sans font-normal max-w-3xl pt-2 ${
              isLightBg ? 'text-charcoal/80' : 'text-white/85'
            }`}
          >
            {renderHighlightedIntroBody(pillar.introductionBody, pillar.name)}
          </p>

          <div className="pt-4 sm:pt-6">
            <button
              type="button"
              onClick={onBeginPillar}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-[16px] font-bold text-base transition-all shadow-2xl group cursor-pointer ${
                isLightBg
                  ? 'bg-charcoal hover:bg-black text-white'
                  : 'bg-white hover:bg-warm-100 text-charcoal'
              }`}
            >
              <span>Begin {pillar.name} Assessment</span>
              <div
                className={`w-7 h-7 rounded-[10px] flex items-center justify-center transition-transform group-hover:translate-x-0.5 shadow-sm ${
                  isLightBg ? 'bg-white text-charcoal' : 'bg-charcoal text-white'
                }`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* Minimal Footer matching First Page Spacing */}
      <footer
        className={`w-full px-5 py-4 sm:px-8 md:px-14 lg:px-20 border-t text-xs font-serif italic flex items-center justify-between ${
          isLightBg ? 'border-black/10 text-charcoal/70' : 'border-white/15 text-white/75'
        }`}
      >
        <span>{pillar.philosophy}</span>
        <span
          className={`font-sans text-[11px] not-italic ${
            isLightBg ? 'text-charcoal/80' : 'text-white/80'
          }`}
        >
          Phoszade Toolkit · Stage 0{pillar.number}
        </span>
      </footer>
    </div>
  );
};
