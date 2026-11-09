import React, { useEffect, useCallback, useRef } from 'react';
import { DiagnosticQuestion, Pillar, ScoreValue } from '../types';
import { DIMENSIONS, PILLAR_PASTELS } from '../data/dimensions';
import { ProgressBar } from './ProgressBar';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface QuestionScreenProps {
  question: DiagnosticQuestion;
  pillar: Pillar;
  overallQuestionNumber: number; // 1 to 63
  totalQuestionsOverall?: number; // 63
  currentScore: ScoreValue | undefined;
  onSelectScore: (score: ScoreValue) => void;
  onContinue: () => void;
  onBack: () => void;
  onHomeClick?: () => void;
  isAdminMode?: boolean;
}

// 5-point Likert response scale (1 = Not true of me to 5 = Completely true of me, left-to-right)
const SCALE_OPTIONS: { value: ScoreValue; label: string; subtext: string }[] = [
  { value: 1, label: 'Not true of me', subtext: 'No demonstrated evidence or activity' },
  { value: 2, label: 'Rarely true of me', subtext: 'Rare or very inconsistent practice' },
  { value: 3, label: 'Somewhat true of me', subtext: 'Partial progress or neutral status' },
  { value: 4, label: 'Mostly true of me', subtext: 'Regular, demonstrated capability' },
  { value: 5, label: 'Completely true of me', subtext: 'Mature, consistent and proven practice' },
];

const DIMENSION_LEVEL_NUMBERS: Record<string, number> = {
  R: 1,
  I: 2,
  S: 3,
  E: 4,
};

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  question,
  pillar,
  overallQuestionNumber,
  totalQuestionsOverall = 63,
  currentScore,
  onSelectScore,
  onContinue,
  onBack,
  onHomeClick,
}) => {
  const dim = DIMENSIONS[pillar.dimension];
  const pastel = PILLAR_PASTELS[pillar.number] || {
    bg: dim.hex,
    text: '#0C2819',
    name: pillar.name,
    dimensionId: pillar.dimension,
  };
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clears any pending auto-advance timer
  const clearAutoAdvanceTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Cleanup timer on unmount or question change
  useEffect(() => {
    return () => {
      clearAutoAdvanceTimer();
    };
  }, [question.id, clearAutoAdvanceTimer]);

  // Handler for selecting a score (with 1.2s / 1200ms auto-advance)
  const handleScoreClick = useCallback(
    (score: ScoreValue) => {
      onSelectScore(score);

      clearAutoAdvanceTimer();
      timerRef.current = setTimeout(() => {
        onContinue();
      }, 1200); // 1.2s auto-advance delay after option selection
    },
    [onSelectScore, onContinue, clearAutoAdvanceTimer]
  );

  const handleManualContinue = useCallback(() => {
    clearAutoAdvanceTimer();
    onContinue();
  }, [clearAutoAdvanceTimer, onContinue]);

  const handleManualBack = useCallback(() => {
    clearAutoAdvanceTimer();
    onBack();
  }, [clearAutoAdvanceTimer, onBack]);

  // Keyboard shortcut listener: 1-5 to select + auto-advance, Enter to continue immediately
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 5) {
        e.preventDefault();
        handleScoreClick(num as ScoreValue);
      } else if (e.key === 'Enter' && currentScore !== undefined) {
        e.preventDefault();
        handleManualContinue();
      }
    },
    [currentScore, handleScoreClick, handleManualContinue]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen w-full bg-warm-50 text-charcoal flex flex-col justify-between">
      {/* Sticky Top Progress Bar */}
      <ProgressBar
        currentQuestionOverall={overallQuestionNumber}
        totalQuestionsOverall={totalQuestionsOverall}
        currentQuestionInPillar={question.questionNumber}
        totalQuestionsInPillar={7}
        pillarName={pillar.name}
        dimensionHex={pastel.contrastColor || dim.hex}
        onHomeClick={onHomeClick}
      />

      {/* Main Question Area - Snug Vertical Proportions Fitted Above The Fold */}
      <main className="flex-1 flex flex-col justify-center px-4 py-2 sm:py-4 md:px-14 lg:px-20 w-full">
        <div key={question.id} className="max-w-2xl mx-auto w-full animate-screen-in">
          {/* Clear Accessibility & Hierarchical Level Heading */}
          <div className="text-center mb-2.5 sm:mb-4 flex flex-col items-center">
            {/* Stage Eyebrow Pill - Matches the button colour */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest font-mono mb-2 shadow-xs border transition-colors"
              style={{
                backgroundColor: pastel.bg,
                color: pastel.text,
                borderColor: pastel.contrastColor,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: pastel.contrastColor }}
              />
              <span>
                {dim.name.toUpperCase()} - LEVEL {DIMENSION_LEVEL_NUMBERS[pillar.dimension]}
              </span>
            </div>

            {/* Authoritative Level Heading in the signature section colour */}
            <h1
              className="font-sans text-2xl sm:text-3xl md:text-4xl font-black tracking-widest uppercase drop-shadow-xs mb-1"
              style={{ color: pastel.contrastColor || dim.hex }}
            >
              {pillar.name}
            </h1>

            <span className="text-[11px] sm:text-xs text-charcoal-muted uppercase tracking-widest font-mono font-medium">
              Question {question.questionNumber} of 7
            </span>
          </div>

          {/* Diagnostic Question Statement */}
          <h2 className="font-serif text-lg sm:text-2xl md:text-3xl font-normal text-charcoal leading-snug tracking-tight mb-3 sm:mb-5 text-center max-w-xl mx-auto">
            "{question.text}"
          </h2>

          {/* Number Circles Row (Matching User's Reference Style: 1 to 5 from Left to Right) */}
          <div className="max-w-xl mx-auto w-full my-2 sm:my-3">
            <div
              className="flex items-center justify-between gap-2 sm:gap-3"
              role="radiogroup"
              aria-label="5-point response scale"
            >
              {SCALE_OPTIONS.map((option) => {
                const isSelected = currentScore === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleScoreClick(option.value)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-[14px] flex items-center justify-center text-base sm:text-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${
                      isSelected
                        ? 'shadow-lg scale-105 ring-2 ring-offset-2 font-bold'
                        : 'bg-white hover:bg-warm-100 text-charcoal border-2 border-warm-300 hover:border-charcoal/50 shadow-xs'
                    }`}
                    style={{
                      backgroundColor: isSelected ? pastel.bg : undefined,
                      borderColor: isSelected ? pastel.contrastColor : undefined,
                      color: isSelected ? pastel.text : undefined,
                      boxShadow: isSelected ? `0 10px 25px -5px ${pastel.contrastColor}40` : undefined,
                    }}
                  >
                    {option.value}
                  </button>
                );
              })}
            </div>

            {/* Left, Center & Right Labels (Fidelity scale: Not true of me -> Completely true of me) */}
            <div className="flex items-center justify-between mt-2 px-1 text-xs sm:text-sm font-semibold text-charcoal">
              <span className="text-left leading-tight">Not true of me</span>
              <span className="text-center text-xs text-charcoal-muted font-normal hidden sm:inline">
                Somewhat true of me
              </span>
              <span className="text-right leading-tight">Completely true of me</span>
            </div>
          </div>

          {/* Action Navigation - Positioned with snug, balanced spacing directly under response options */}
          <nav
            aria-label="Assessment Navigation"
            className="max-w-xl mx-auto w-full mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-warm-300 flex items-center justify-between gap-4"
          >
            <button
              type="button"
              onClick={handleManualBack}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[14px] border border-warm-300 bg-white hover:bg-warm-200 text-charcoal hover:text-black text-xs sm:text-sm font-medium transition-colors group cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={handleManualContinue}
              disabled={currentScore === undefined}
              className={`inline-flex items-center gap-2 px-6 sm:px-7 py-2.5 rounded-[14px] text-xs sm:text-sm font-semibold transition-all shadow-sm group cursor-pointer border ${
                currentScore === undefined
                  ? 'bg-warm-300 text-charcoal-muted cursor-not-allowed opacity-60 border-warm-300'
                  : 'hover:opacity-95'
              }`}
              style={{
                backgroundColor: currentScore !== undefined ? pastel.bg : undefined,
                borderColor: currentScore !== undefined ? pastel.contrastColor : undefined,
                color: currentScore !== undefined ? pastel.text : undefined,
              }}
            >
              <span>{overallQuestionNumber === totalQuestionsOverall ? 'Complete Assessment' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </nav>
        </div>
      </main>

      {/* Footer matching standard platform page layout */}
      <footer className="w-full px-5 py-3 sm:px-8 md:px-14 lg:px-20 border-t border-warm-300 flex items-center justify-between text-xs text-charcoal-muted">
        <span>Phoszade &copy; {new Date().getFullYear()} · THE RISE Framework</span>
        <span className="font-mono text-[11px] text-charcoal-muted">
          Question {overallQuestionNumber} of {totalQuestionsOverall}
        </span>
      </footer>
    </div>
  );
};
