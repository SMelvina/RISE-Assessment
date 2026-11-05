import React from 'react';
import { Pillar } from '../types';
import { PILLAR_PASTELS } from '../data/dimensions';
import { BrandLogo } from './BrandLogo';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PillarTransitionScreenProps {
  completedPillar: Pillar;
  nextPillar: Pillar;
  completedPillarScore: number;
  participantName: string;
  onProceed: () => void;
  onBackToQuestions: () => void;
  onHomeClick?: () => void;
}

export const PillarTransitionScreen: React.FC<PillarTransitionScreenProps> = ({
  completedPillar,
  nextPillar,
  completedPillarScore,
  participantName,
  onProceed,
  onBackToQuestions,
  onHomeClick,
}) => {
  const nextPastel = PILLAR_PASTELS[nextPillar.number] || {
    bg: '#6FB995',
    text: '#0C2819',
    name: nextPillar.name,
    dimensionId: nextPillar.dimension,
  };
  const completedPercentage = Math.round((completedPillarScore / 35) * 100);

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between select-none transition-colors duration-500 text-white"
      style={{ backgroundColor: nextPastel.introBg || '#024F28' }}
    >
      {/* Top Header: Brand Logo on TOP LEFT + Review Control on RIGHT */}
      <header className="w-full px-5 py-5 sm:px-8 md:px-14 lg:px-20 flex items-center justify-between border-b border-white/15 backdrop-blur-xs">
        <BrandLogo variant="white" size="md" showSubtitle={true} onClick={onHomeClick} />

        <button
          type="button"
          onClick={onBackToQuestions}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[16px] bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold tracking-wider uppercase transition-all group backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Review Question 7</span>
        </button>
      </header>

      {/* Main Center Content: Clean, Minimal, Typographic & Focused with White Typography Variants */}
      <main className="w-full px-5 sm:px-8 md:px-14 lg:px-20 my-auto py-12 flex flex-col items-center">
        <div className="max-w-3xl w-full animate-fade-in space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-xs font-semibold tracking-wide uppercase self-start">
            <span>Stage Complete · Advancing to Stage 0{nextPillar.number}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.15] text-white">
            Well done, {participantName}.
          </h1>

          <p className="font-serif text-2xl sm:text-3xl italic font-normal text-white/95">
            "{nextPillar.governingQuestion}"
          </p>

          <p className="text-base sm:text-lg leading-relaxed font-sans font-normal max-w-2xl pt-2 text-white/85">
            You have completed Stage 0{completedPillar.number}: <strong className="font-bold italic text-yellow-300">{completedPillar.name}</strong> with a score of <strong className="text-white">{completedPillarScore} / 35</strong> ({completedPercentage}%). Next, you step into Stage 0{nextPillar.number}: <strong className="font-bold italic text-yellow-300">{nextPillar.name}</strong> to {nextPillar.philosophy.toLowerCase()}
          </p>

          <div className="pt-6">
            <button
              type="button"
              onClick={onProceed}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-[16px] bg-white hover:bg-warm-100 text-charcoal font-bold text-base transition-all shadow-2xl group cursor-pointer"
            >
              <span>Proceed to Stage 0{nextPillar.number}: {nextPillar.name}</span>
              <div className="w-7 h-7 rounded-[10px] bg-charcoal text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5 shadow-sm">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* Minimal Footer Spacer matching First Page Spacing */}
      <footer className="w-full px-5 py-4 sm:px-8 md:px-14 lg:px-20 border-t border-white/15 text-xs font-serif italic flex items-center justify-between text-white/75">
        <span>{nextPillar.philosophy}</span>
        <span className="font-sans text-[11px] not-italic text-white/80">Phoszade Toolkit · Stage 0{nextPillar.number}</span>
      </footer>
    </div>
  );
};
