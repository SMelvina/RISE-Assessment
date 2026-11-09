import React from 'react';
import { PILLARS } from '../data/pillars';
import { DIMENSIONS, PILLAR_PASTELS } from '../data/dimensions';
import { Pillar } from '../types';

interface RisePyramidArchitectureProps {
  onSelectPillar?: (pillar: Pillar) => void;
  className?: string;
}

export const RisePyramidArchitecture: React.FC<RisePyramidArchitectureProps> = ({
  onSelectPillar,
  className = '',
}) => {
  // Stepped pyramid width progression (Foundation: 100% -> Summit: ~38%)
  const TIER_WIDTHS: Record<number, string> = {
    1: 'w-full', // Foundation: widest
    2: 'w-[94%] sm:w-[92%]',
    3: 'w-[88%] sm:w-[84%]',
    4: 'w-[82%] sm:w-[76%]',
    5: 'w-[76%] sm:w-[68%]',
    6: 'w-[70%] sm:w-[60%]',
    7: 'w-[64%] sm:w-[52%]',
    8: 'w-[58%] sm:w-[44%]',
    9: 'w-[52%] sm:w-[38%]', // Summit: narrowest
  };

  // 4 Dimension Section Boxes (E -> S -> I -> R)
  // Clean headers: E - EXPAND, S - START, I - ILLUMINATE, R - REALIZE
  // Curated brighter dimension jewel tones providing rich framing for the pastel steps
  const dimensionBoxes = [
    {
      dimensionId: 'E' as const,
      label: 'E - EXPAND',
      boxBg: 'bg-[#C8644E]', // Luminous warm peach
      accentColor: '#FFF2EB', // Bright crisp cream-peach
      pillars: [PILLARS[8], PILLARS[7]], // 9 Lead, 8 Scale
    },
    {
      dimensionId: 'S' as const,
      label: 'S - START',
      boxBg: 'bg-[#B85317]', // Deep warm terracotta amber
      accentColor: '#FFF2EB', // Bright crisp pastel orange
      pillars: [PILLARS[6], PILLARS[5]], // 7 Build, 6 Launch
    },
    {
      dimensionId: 'I' as const,
      label: 'I - ILLUMINATE',
      boxBg: 'bg-[#5A4508]', // Deep golden bronze
      accentColor: '#FDF0BA', // Bright crisp pastel yellow
      pillars: [PILLARS[4], PILLARS[3]], // 5 Architect, 4 Articulate
    },
    {
      dimensionId: 'R' as const,
      label: 'R - REALIZE',
      boxBg: 'bg-[#075E31]', // Brighter Phoszade vibrant emerald pine
      accentColor: '#E0F8EE', // Verified WCAG AAA bright mint (7.5:1 contrast)
      pillars: [PILLARS[2], PILLARS[1], PILLARS[0]], // 3 Crystallize, 2 Clarify, 1 Identity
    },
  ];

  return (
    <div className={`flex flex-col select-none ${className}`}>
      {/* 4 Dimension Section Boxes - Zero space between boxes, seamless contiguous frame */}
      <div className="flex flex-col space-y-0 rounded-[12px] overflow-hidden border border-white/25 shadow-2xl divide-y divide-white/15">
        {dimensionBoxes.map((box, boxIdx) => {
          const isFirstBox = boxIdx === 0;
          const isLastBox = boxIdx === dimensionBoxes.length - 1;
          const verticalPadding = isFirstBox
            ? 'pt-3.5 sm:pt-4.5 pb-0'
            : isLastBox
            ? 'pt-0 pb-3.5 sm:pb-4.5'
            : 'py-0';

          return (
            <div
              key={box.dimensionId}
              className={`flex items-center w-full transition-all duration-300 ${box.boxBg} ${verticalPadding}`}
            >
              {/* Left Dimension Section Label: Bold, clean, vertically centered with ~24px extra breathing room from the left edge */}
              <div className="w-24 sm:w-32 md:w-36 lg:w-40 flex-shrink-0 pl-8 sm:pl-9 md:pl-10 py-2 flex items-center">
                <span
                  className="text-[9px] sm:text-[11px] md:text-xs font-sans font-black tracking-wider uppercase drop-shadow-xs leading-tight"
                  style={{ color: box.accentColor }}
                >
                  {box.label}
                </span>
              </div>

              {/* Step Cards with ZERO Space Between Them Inside & Across Boxes - Perfectly Centered */}
              <div className="flex-1 flex flex-col items-center w-full space-y-0 py-0 px-1 sm:px-2">
                {box.pillars.map((pillar) => {
                  const dim = DIMENSIONS[pillar.dimension];
                  const pastel = PILLAR_PASTELS[pillar.number] || { bg: dim.hex, text: '#0A2617' };
                  const widthClass = TIER_WIDTHS[pillar.number] || 'w-full';

                  // Only Step 9 has rounded-t, only Step 1 has rounded-b; all inner steps sit flush with square joints
                  const cornerRadius =
                    pillar.number === 9
                      ? 'rounded-t-lg'
                      : pillar.number === 1
                      ? 'rounded-b-lg'
                      : 'rounded-none';

                  return (
                    <button
                      key={pillar.id}
                      type="button"
                      onClick={() => onSelectPillar?.(pillar)}
                      className={`relative h-10 sm:h-11 md:h-12 ${widthClass} ${cornerRadius} transition-all duration-200 flex items-center justify-center px-2.5 sm:px-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40 group border-t border-black/10 first:border-t-0 shadow-xs hover:brightness-105 hover:scale-[1.01] z-10`}
                      style={{
                        backgroundColor: pastel.bg,
                        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.35)`,
                      }}
                      aria-label={`Stage ${pillar.number}: ${pillar.name} — ${pillar.governingQuestion}`}
                    >
                      {/* Left: Distinctive White Number Circle */}
                      <div className="absolute left-2 sm:left-3 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-white/95 flex items-center justify-center text-[#191817] font-extrabold text-[10px] sm:text-xs md:text-sm shadow-sm flex-shrink-0 transition-transform group-hover:scale-110">
                        {pillar.number}
                      </div>

                      {/* Center: Bold Pillar Name */}
                      <span
                        className="font-sans font-bold text-xs sm:text-sm md:text-base tracking-tight truncate px-7 sm:px-9"
                        style={{ color: pastel.text }}
                      >
                        {pillar.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right Symmetrical Balance Spacer to guarantee exact equal left & right spacing */}
              <div
                className="w-24 sm:w-32 md:w-36 lg:w-40 flex-shrink-0 pr-8 sm:pr-9 md:pr-10 py-2 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
