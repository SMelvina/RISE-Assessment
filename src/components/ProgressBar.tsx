import React from 'react';
import { BrandLogo } from './BrandLogo';

interface ProgressBarProps {
  currentQuestionOverall: number; // 1 to 63
  totalQuestionsOverall?: number; // 63
  currentQuestionInPillar: number; // 1 to 7
  totalQuestionsInPillar?: number; // 7
  pillarName: string;
  dimensionHex: string;
  onHomeClick?: () => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentQuestionOverall,
  totalQuestionsOverall = 63,
  currentQuestionInPillar,
  totalQuestionsInPillar = 7,
  pillarName,
  dimensionHex,
  onHomeClick,
}) => {
  const overallPercentage = Math.round((currentQuestionOverall / totalQuestionsOverall) * 100);
  const pillarPercentage = Math.round((currentQuestionInPillar / totalQuestionsInPillar) * 100);

  return (
    <div className="w-full bg-warm-100/90 border-b border-warm-300/80 backdrop-blur-sm sticky top-0 z-30 px-5 py-2 sm:py-2.5 md:px-14 lg:px-20 transition-all">
      <div className="w-full flex flex-col gap-1.5 sm:gap-2">
        {/* Top Nav Row: Brand Logo on TOP LEFT + Stage & Overall Progress on RIGHT */}
        <div className="flex items-center justify-between gap-4">
          <BrandLogo variant="dark" size="sm" showSubtitle={true} onClick={onHomeClick} />

          <div className="flex items-center gap-3 sm:gap-4 text-xs tracking-wider uppercase text-charcoal-muted font-medium">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: dimensionHex }}
              />
              <span className="text-charcoal font-semibold">{pillarName}</span>
              <span className="text-charcoal-muted hidden sm:inline">·</span>
              <span className="hidden sm:inline">
                Stage {currentQuestionInPillar} of {totalQuestionsInPillar}
              </span>
            </div>

            <div className="flex items-center gap-1.5 tabular-nums text-charcoal">
              <span className="text-charcoal-muted font-normal hidden md:inline">Progress</span>
              <span className="font-semibold">{currentQuestionOverall}</span>
              <span className="text-charcoal-muted">/</span>
              <span className="text-charcoal-muted">{totalQuestionsOverall}</span>
              <span className="text-charcoal-muted ml-1 font-mono font-medium">({overallPercentage}%)</span>
            </div>
          </div>
        </div>

        {/* Dual Progress Bars */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-charcoal-muted font-medium">
            <span>Stage progress</span>
            <span className="font-mono">{pillarPercentage}%</span>
          </div>
          <div className="relative w-full h-2 bg-warm-300 border border-warm-400/50 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full transition-all duration-300 ease-out rounded-full shadow-xs"
              style={{
                width: `${overallPercentage}%`,
                backgroundColor: dimensionHex,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
