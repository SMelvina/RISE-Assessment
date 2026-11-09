import React from 'react';
import { BrandLogo } from './BrandLogo';
import { RisePyramidArchitecture } from './RisePyramidArchitecture';
import { ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  hasExistingProgress: boolean;
  onResume: () => void;
  onReset: () => void;
  onHomeClick?: () => void;
  onOpenAdmin?: () => void;
  onLaunchAdminDemo?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  hasExistingProgress,
  onResume,
  onReset,
  onHomeClick,
  onOpenAdmin,
  onLaunchAdminDemo,
}) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-[#024F28] text-white select-none">
      {/* Atmospheric Vignette Gradients carrying Phoszade Brand Green #024F28 */}
      <div className="absolute inset-0 z-1 bg-gradient-to-r from-[#012613]/95 via-[#024F28]/90 via-50% to-[#01351A]/85 pointer-events-none" />
      <div className="absolute inset-0 z-2 bg-gradient-to-t from-[#011B0D]/95 via-transparent to-[#011B0D]/70 pointer-events-none" />

      {/* Subtle Golden Amber Brand Accent Lighting */}
      <div
        className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none z-2"
        style={{ background: 'radial-gradient(circle, #E39F00 0%, transparent 70%)' }}
      />

      {/* Top Header with Authentic Phoszade Brand Logo on TOP LEFT */}
      <header className="relative z-10 w-full px-5 py-5 sm:px-8 md:px-14 lg:px-20 flex items-center justify-between border-b border-white/15 backdrop-blur-xs">
        <BrandLogo variant="white" size="md" showSubtitle={true} onClick={onHomeClick} />
      </header>

      {/* Main Content: Left Editorial Narrative + Right Ascending RISE Pyramid Architecture */}
      <main className="relative z-10 w-full px-5 sm:px-8 md:px-14 lg:px-20 my-auto py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center animate-screen-in">
        {/* Left Column: Editorial Headline, Narrative, Dimension Chips & Action */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col space-y-6">
          <h1 className="font-serif text-3xl sm:text-5xl md:text-5xl xl:text-6xl font-medium leading-[1.12] text-white tracking-tight drop-shadow-sm">
            Your vision deserves a <span className="italic font-normal">deliberate journey.</span>
          </h1>

          <div className="space-y-4 text-sm sm:text-base xl:text-lg text-white/90 leading-relaxed font-sans font-normal max-w-xl">
            <p>
              Every meaningful undertaking begins with understanding who you are, defining what matters, and envisioning the future you want to create.
            </p>
            <p>
              The Phoszade RISE framework diagnoses your capacity across nine progressive stages, identifying exactly where you stand in your journey and what is required to advance.
            </p>
          </div>

          {/* Primary CTA Buttons */}
          <div className="pt-2">
            {hasExistingProgress ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onResume}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-[16px] bg-white text-[#024F28] font-bold text-base hover:bg-[#F0F7F3] transition-all shadow-2xl group cursor-pointer"
                >
                  <span>Resume Assessment</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  type="button"
                  onClick={onReset}
                  className="px-6 py-4 rounded-[16px] bg-white/10 border border-white/20 hover:bg-white/20 text-white text-sm font-medium transition-all backdrop-blur-md cursor-pointer"
                >
                  Start Over
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onStart}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-[16px] bg-white text-[#024F28] font-bold text-base hover:bg-[#F0F7F3] transition-all shadow-2xl group cursor-pointer"
              >
                <span>Begin your journey</span>
                <div className="w-7 h-7 rounded-[10px] bg-[#024F28] text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5 shadow-sm">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Grand RISE Stepped Pyramid Architecture Showcase */}
        <div className="lg:col-span-7 xl:col-span-7">
          <div className="relative bg-[#011C0E]/85 border border-white/20 backdrop-blur-xl rounded-[12px] p-2 sm:p-6 md:p-8 shadow-2xl overflow-hidden">
            {/* Ambient inner glow */}
            <div
              className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ background: '#E39F00' }}
            />
            <div
              className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-25 pointer-events-none"
              style={{ background: '#024F28' }}
            />

            {/* The 9-Stage Stepped Pyramid Architecture Component */}
            <div className="relative z-10">
              <RisePyramidArchitecture onSelectPillar={onStart} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-5 py-4 sm:px-8 md:px-14 lg:px-20 border-t border-white/15 flex items-center justify-between text-xs text-white/70">
        <span>Phoszade &copy; {new Date().getFullYear()} · THE RISE Framework</span>
        {(onLaunchAdminDemo || onOpenAdmin) && (
          <div className="flex items-center gap-2">
            {onLaunchAdminDemo && (
              <button
                type="button"
                onClick={onLaunchAdminDemo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-[#E39F00]/20 hover:bg-[#E39F00]/30 border border-[#E39F00]/40 text-[#FFCF55] hover:text-white transition-all text-xs font-semibold cursor-pointer"
              >
                <span>Stakeholder Demo</span>
              </button>
            )}
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white transition-all text-xs font-semibold cursor-pointer"
              >
                <span>Admin Dashboard</span>
              </button>
            )}
          </div>
        )}
      </footer>
    </div>
  );
};
