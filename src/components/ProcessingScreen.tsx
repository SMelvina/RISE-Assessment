import React, { useState, useEffect } from 'react';
import { AssessmentResult } from '../types';
import { ArrowRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface ProcessingScreenProps {
  participantName: string;
  results: AssessmentResult;
  onComplete: () => void;
  onHomeClick?: () => void;
}

const PHASES = [
  { min: 0, max: 15, message: 'Bringing your responses together.' },
  { min: 16, max: 30, message: 'Examining your nine development dimensions.' },
  { min: 31, max: 45, message: 'Identifying areas of strength.' },
  { min: 46, max: 60, message: 'Pinpointing where you stand in the 9-stage journey.' },
  { min: 61, max: 75, message: 'Mapping your development profile.' },
  { min: 76, max: 90, message: 'Preparing your personalised insights.' },
  { min: 91, max: 100, message: 'Your Phoszade RISE profile is ready.' },
];

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({
  participantName,
  onComplete,
  onHomeClick,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Deliberate, graceful progression across the 100% threshold
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.floor(Math.random() * 4) + 2;
        return Math.min(prev + increment, 100);
      });
    }, 180);

    return () => clearInterval(interval);
  }, []);

  const currentPhase =
    PHASES.find((p) => progress >= p.min && progress <= p.max) || PHASES[PHASES.length - 1];

  return (
    <div className="min-h-screen w-full bg-warm-50 text-charcoal flex flex-col justify-between select-none">
      {/* Top Header with Brand Logo on TOP LEFT */}
      <header className="w-full px-5 py-5 sm:px-8 md:px-14 lg:px-20 flex items-center justify-between border-b border-warm-300">
        <BrandLogo variant="dark" size="md" showSubtitle={true} onClick={onHomeClick} />
        <span className="text-xs uppercase tracking-wider font-semibold text-charcoal-muted font-mono">
          Diagnostic Analysis
        </span>
      </header>

      {/* Main Processing Box matching First Page Spacing */}
      <main className="w-full px-5 sm:px-8 md:px-14 lg:px-20 my-auto py-12 flex flex-col items-center text-center animate-screen-in">
        <div className="max-w-lg w-full">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-charcoal tracking-tight mb-4">
            Your journey so far, <span className="italic font-normal">coming into focus.</span>
          </h1>

          <p className="text-base sm:text-lg text-charcoal-muted leading-relaxed font-sans font-normal mb-10 max-w-md mx-auto">
            We're synthesising your responses, {participantName}, to diagnose exactly where you stand across the nine stages of the Phoszade RISE framework.
          </p>

          {/* Animated Progress Bar */}
          <div className="w-full bg-warm-200 h-2.5 rounded-full overflow-hidden mb-4 border border-warm-300/80">
            <div
              className="h-full bg-[#024F28] transition-all duration-200 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Phase Message */}
          <div className="flex items-center justify-between text-xs text-charcoal-muted font-mono mb-10">
            <span className="animate-fade-in">{currentPhase.message}</span>
            <span className="font-bold tabular-nums text-charcoal">{progress}%</span>
          </div>

          {/* Completion Button */}
          {progress === 100 && (
            <div className="animate-fade-up">
              <button
                type="button"
                onClick={onComplete}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-[16px] bg-[#024F28] hover:bg-[#013D1F] text-white font-semibold text-base transition-all shadow-lg group cursor-pointer"
              >
                <span>View Your Personalised Diagnostic Report</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer matching First Page Spacing */}
      <footer className="w-full px-5 py-4 sm:px-8 md:px-14 lg:px-20 border-t border-warm-300 flex items-center justify-between text-xs text-charcoal-muted">
        <span>Phoszade &copy; {new Date().getFullYear()} · THE RISE Framework</span>
        <span>Diagnostic Analysis</span>
      </footer>
    </div>
  );
};
