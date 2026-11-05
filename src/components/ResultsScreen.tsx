import React, { useState } from 'react';
import { AssessmentResult } from '../types';
import { DIMENSIONS } from '../data/dimensions';
import { PILLARS } from '../data/pillars';
import { RadarChart } from './RadarChart';
import { BrandLogo } from './BrandLogo';
import {
  Printer,
  RotateCcw,
  Award,
  AlertCircle,
  Target,
  Sparkles,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Compass,
} from 'lucide-react';

interface ResultsScreenProps {
  results: AssessmentResult;
  onRetake: () => void;
  onHomeClick?: () => void;
  isAdminPreview?: boolean;
  onReturnToAdmin?: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  results,
  onRetake,
  onHomeClick,
  isAdminPreview = false,
  onReturnToAdmin,
}) => {
  const [showRetakeConfirm, setShowRetakeConfirm] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen w-full bg-warm-50 text-charcoal flex flex-col justify-between">
      {/* Top Header & Actions matching First Page Spacing */}
      <header className="w-full px-5 py-5 sm:px-8 md:px-14 lg:px-20 flex flex-col sm:flex-row sm:items-center justify-between border-b border-warm-300 gap-4 print:hidden">
        <BrandLogo variant="dark" size="md" showSubtitle={true} onClick={onHomeClick} />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[16px] border border-warm-300 bg-white hover:bg-warm-100 text-charcoal text-xs font-semibold tracking-wide uppercase transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-charcoal-muted" />
            <span>Print / Save PDF</span>
          </button>

          <button
            type="button"
            onClick={() => setShowRetakeConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[16px] border border-warm-300 bg-warm-200/80 hover:bg-warm-300 text-charcoal text-xs font-semibold tracking-wide uppercase transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-charcoal-muted" />
            <span>Retake Assessment</span>
          </button>
        </div>
      </header>

      {/* Admin Preview Floating Navigation Bar */}
      {isAdminPreview && onReturnToAdmin && (
        <div className="bg-[#024F28] text-white px-5 py-3 sm:px-8 md:px-14 lg:px-20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md print:hidden sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-[8px] bg-white/20 font-bold uppercase font-mono tracking-wider">
              Admin Preview
            </span>
            <span>
              Viewing participant diagnosis for: <strong>{results.participantName}</strong> (Score: {results.totalScore}/315 · Stage 0{results.journeyDiagnosis.activeFrontier.number}: {results.journeyDiagnosis.activeFrontier.name})
            </span>
          </div>
          <button
            type="button"
            onClick={onReturnToAdmin}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-white text-[#024F28] font-bold uppercase tracking-wider text-[11px] hover:bg-warm-100 transition-all cursor-pointer shadow-xs"
          >
            <span>&larr; Return to Admin Dashboard</span>
          </button>
        </div>
      )}

      {/* Main Results Body matching First Page Spacing */}
      <main className="w-full px-5 sm:px-8 md:px-14 lg:px-20 py-8 md:py-12 flex-1 animate-screen-in">
        <div className="max-w-5xl mx-auto space-y-14 md:space-y-16">
        {/* Executive Print Document Header (Visible only in PDF / Print) */}
        <div className="hidden print:flex items-center justify-between pb-6 mb-8 border-b-2 border-charcoal">
          <BrandLogo variant="dark" size="md" showSubtitle={true} />
          <div className="text-right text-xs font-mono text-charcoal">
            <span className="font-bold uppercase tracking-wider block">Vision Capacity Diagnosis</span>
            <span className="text-charcoal-muted block">Prepared for: {results.participantName}</span>
            <span className="text-charcoal-muted block text-[11px]">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* ==========================================
            SECTION 01: PERSONAL INTRODUCTION
            ========================================== */}
        <section aria-labelledby="section-intro" className="animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warm-200 border border-warm-300 text-charcoal text-xs font-semibold tracking-wide uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-charcoal-muted" />
            Personalised Diagnostic Report
          </div>

          <h1
            id="section-intro"
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-charcoal tracking-tight mb-4 leading-tight"
          >
            {results.participantName}, here is your RISE profile.
          </h1>

          <p className="text-base sm:text-lg text-charcoal-muted leading-relaxed font-sans font-normal max-w-3xl">
            Your responses reveal your current standing across the nine pillars of Vision Capacity Diagnosis. Explore your strengths, identify where development is needed and understand the next steps in your journey.
          </p>
        </section>

        {/* ==========================================
            PRIMARY DIAGNOSTIC HIGHLIGHT: WHERE IN THE 9-STEP JOURNEY ARE YOU?
            ========================================== */}
        <section
          aria-labelledby="section-journey-position"
          className="bg-white rounded-2xl border-2 border-charcoal/20 p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden animate-fade-in"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-warm-200/40 rounded-full blur-3xl pointer-events-none -z-0" />

          <div className="relative z-10">
            {/* Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-warm-200">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal text-warm-50 text-xs font-semibold tracking-wide uppercase">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Primary Diagnostic Finding</span>
              </div>

              <span className="text-xs uppercase font-mono font-semibold text-charcoal-muted">
                Your 9-Stage Vision Capacity Diagnosis
              </span>
            </div>

            <h2
              id="section-journey-position"
              className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-charcoal tracking-tight mb-2"
            >
              Where You Stand in the Journey
            </h2>

            <p className="text-base text-charcoal-muted leading-relaxed font-sans mb-8 max-w-2xl">
              The goal of the RISE diagnostic is to pinpoint your active frontier across the sequential 9-stage progression—from internal discovery to enduring legacy.
            </p>

            {/* 9-Stage Step Journey Tracker */}
            <div className="mb-10 overflow-x-auto print:overflow-visible pt-6 pb-6 no-scrollbar">
              <div className="min-w-[700px] print:min-w-0 print:w-full flex items-center justify-between relative px-2">
                {/* Horizontal connector track */}
                <div className="absolute left-6 right-6 top-5 h-1 bg-warm-200 print:bg-warm-300 -z-0" />

                {PILLARS.map((p) => {
                  const status = results.journeyDiagnosis.stageStatuses[p.id];
                  const isCurrent = status === 'current_frontier';
                  const isConsolidated = status === 'consolidated';
                  const dim = DIMENSIONS[p.dimension];

                  return (
                    <div
                      key={p.id}
                      className="flex flex-col items-center relative z-10 text-center w-20 print:w-auto print:flex-1 group"
                    >
                      {/* Step Circle Marker */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all border-2 ${
                          isCurrent
                            ? 'text-white shadow-xl scale-110 z-20 print:scale-100'
                            : isConsolidated
                            ? 'text-white shadow-xs'
                            : 'text-xs'
                        }`}
                        style={{
                          backgroundColor: isCurrent || isConsolidated ? dim.hex : dim.lightHex,
                          borderColor: dim.hex,
                          boxShadow: isCurrent
                            ? `0 0 0 3px #FAF8F5, 0 0 0 7px ${dim.hex}40, 0 8px 16px -2px ${dim.hex}30`
                            : undefined,
                          color: isCurrent || isConsolidated ? '#FFFFFF' : dim.hex,
                        }}
                      >
                        {isConsolidated ? (
                          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                        ) : isCurrent ? (
                          <MapPin className="w-5 h-5 text-white animate-icon-float drop-shadow-xs" />
                        ) : (
                          `0${p.number}`
                        )}
                      </div>

                      {/* Stage Name */}
                      <span
                        className={`text-xs font-semibold mt-2.5 block leading-tight ${
                          isCurrent
                            ? 'text-charcoal font-bold underline decoration-2'
                            : isConsolidated
                            ? 'text-charcoal'
                            : 'text-charcoal-muted'
                        }`}
                      >
                        {p.name}
                      </span>

                      {/* Status Tag */}
                      <span
                        className={`text-[9px] uppercase font-mono tracking-wider mt-1 px-1.5 py-0.5 rounded transition-colors ${
                          isCurrent
                            ? 'bg-charcoal text-white font-bold shadow-xs'
                            : isConsolidated
                            ? 'font-bold border'
                            : 'font-medium border border-warm-300'
                        }`}
                        style={{
                          backgroundColor: isConsolidated ? dim.lightHex : undefined,
                          color: isConsolidated ? dim.hex : !isCurrent ? dim.hex : undefined,
                          borderColor: isConsolidated ? `${dim.hex}40` : undefined,
                        }}
                      >
                        {isCurrent ? 'Active' : isConsolidated ? 'Proven' : 'Horizon'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Spotlight Callout Card: Detailed Stage Analysis */}
            <div
              className="p-6 sm:p-8 rounded-2xl border transition-all"
              style={{
                backgroundColor: DIMENSIONS[results.journeyDiagnosis.currentStage.dimension].lightHex,
                borderColor: `${DIMENSIONS[results.journeyDiagnosis.currentStage.dimension].hex}40`,
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <span
                  className="text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full text-white"
                  style={{
                    backgroundColor:
                      DIMENSIONS[results.journeyDiagnosis.currentStage.dimension].hex,
                  }}
                >
                  YOU ARE CURRENTLY AT STAGE 0{results.journeyDiagnosis.stageNumber}: {results.journeyDiagnosis.currentStage.name.toUpperCase()}
                </span>

                <span className="text-xs font-serif italic text-charcoal-muted">
                  "{results.journeyDiagnosis.currentStage.governingQuestion}"
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal mb-3">
                {results.journeyDiagnosis.headline}
              </h3>

              <p className="text-sm sm:text-base text-charcoal leading-relaxed font-sans mb-6">
                {results.journeyDiagnosis.summary}
              </p>

              {/* 3 Pillars of Diagnostic Understanding */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-black/10 text-xs">
                {/* 1. Ground Behind You */}
                <div className="p-4 rounded-xl bg-white/80 border border-black/10 text-charcoal">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-800 mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ground Behind You</span>
                  </div>
                  <p className="text-charcoal-muted leading-relaxed font-sans">
                    {results.journeyDiagnosis.whatYouHaveBuilt}
                  </p>
                </div>

                {/* 2. The Current Frontier */}
                <div className="p-4 rounded-xl bg-white/80 border border-black/10 text-charcoal">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-800 mb-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-600" />
                    <span>The Active Frontier</span>
                  </div>
                  <p className="text-charcoal-muted leading-relaxed font-sans">
                    {results.journeyDiagnosis.currentBottleneck}
                  </p>
                </div>

                {/* 3. Key to Advance */}
                <div className="p-4 rounded-xl bg-white/80 border border-black/10 text-charcoal">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-charcoal mb-1.5">
                    <Target className="w-3.5 h-3.5 text-charcoal" />
                    <span>Key to Advance Next</span>
                  </div>
                  <p className="text-charcoal font-medium leading-relaxed font-sans">
                    {results.journeyDiagnosis.unlockRequirement}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            SECTION 02: YOUR NINE-PILLAR PROFILE (RADAR)
            ========================================== */}
        <section
          aria-labelledby="section-radar"
          className="bg-white rounded-2xl border border-warm-300 p-6 sm:p-8 md:p-10 shadow-xs"
        >
          <div className="max-w-2xl mb-8">
            <span className="text-xs uppercase font-bold tracking-wider text-charcoal-muted font-mono">
              Section 02 · Visual Matrix
            </span>
            <h2 id="section-radar" className="font-serif text-2xl sm:text-3xl font-medium text-charcoal mt-1 mb-2">
              Nine-Pillar Radar Diagnostic
            </h2>
            <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed">
              The chart below maps your percentage scores across all nine pillars on a consistent 0–100% scale. Color groupings delineate the four dimensions: Realise, Imagine, Start, and Expand.
            </p>
          </div>

          <RadarChart pillarResults={results.pillarResults} />

          {/* Dimension Colour Family Legend */}
          <div className="mt-8 pt-6 border-t border-warm-200 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.values(DIMENSIONS).map((dim) => (
              <div key={dim.id} className="flex items-start gap-2.5">
                <div
                  className="w-3.5 h-3.5 rounded-full mt-0.5 flex-shrink-0"
                  style={{ backgroundColor: dim.hex }}
                />
                <div>
                  <span className="text-xs font-bold text-charcoal block leading-tight">
                    {dim.id} — {dim.name}
                  </span>
                  <span className="text-[11px] text-charcoal-muted font-normal block mt-0.5">
                    {dim.theme}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================
            SECTION 03: YOUR STRENGTHS
            ========================================== */}
        <section
          aria-labelledby="section-strengths"
          className="bg-white rounded-2xl border border-warm-300 p-6 sm:p-8 md:p-10 shadow-xs print-avoid-break"
        >
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-emerald-700" />
            <span className="text-xs uppercase font-bold tracking-wider text-charcoal-muted font-mono">
              Section 03 · Anchors of Mastery
            </span>
          </div>

          <h2 id="section-strengths" className="font-serif text-2xl sm:text-3xl font-medium text-charcoal mb-3">
            Your Demonstrable Strengths
          </h2>

          <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed mb-6 max-w-2xl">
            These top-scoring pillars represent areas where you have demonstrated consistent capability and operational discipline. They serve as foundational anchors for your journey.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.strengths.map((st, idx) => {
              const dim = DIMENSIONS[st.pillar.dimension];

              return (
                <div
                  key={st.pillar.id}
                  className="p-5 rounded-xl border bg-warm-50/80 flex flex-col justify-between"
                  style={{ borderColor: `${dim.hex}40` }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-charcoal-muted">
                        Strength #{idx + 1}
                      </span>
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded"
                        style={{ backgroundColor: dim.lightHex, color: dim.hex }}
                      >
                        {st.score}/35 ({st.percentage}%)
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-charcoal mb-1">
                      {st.pillar.name}
                    </h3>
                    <p className="text-xs text-charcoal-muted font-serif italic mb-3">
                      "{st.pillar.governingQuestion}"
                    </p>

                    <p className="text-xs text-charcoal-muted leading-relaxed font-sans">
                      {st.insight}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-warm-200/80 text-[11px] font-semibold text-charcoal flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Anchor Capability</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ==========================================
            SECTION 04: AREAS REQUIRING ATTENTION
            ========================================== */}
        <section
          aria-labelledby="section-gaps"
          className="bg-white rounded-2xl border border-warm-300 p-6 sm:p-8 md:p-10 shadow-xs print-avoid-break"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-700" />
            <span className="text-xs uppercase font-bold tracking-wider text-charcoal-muted font-mono">
              Section 04 · Growth Opportunities
            </span>
          </div>

          <h2 id="section-gaps" className="font-serif text-2xl sm:text-3xl font-medium text-charcoal mb-3">
            Areas Requiring Attention
          </h2>

          <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed mb-6 max-w-2xl">
            These pillars reflect your lowest recorded scores. Rather than personal limitations, they indicate specific developmental frontiers where intentional effort will yield substantial breakthroughs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.developmentGaps.map((gap, idx) => {
              const dim = DIMENSIONS[gap.pillar.dimension];

              return (
                <div
                  key={gap.pillar.id}
                  className="p-5 rounded-xl border bg-warm-50/80 border-warm-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-charcoal-muted">
                        Gap #{idx + 1}
                      </span>
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded"
                        style={{ backgroundColor: dim.lightHex, color: dim.hex }}
                      >
                        {gap.score}/35 ({gap.percentage}%)
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-charcoal mb-1">
                      {gap.pillar.name}
                    </h3>
                    <p className="text-xs text-charcoal-muted font-serif italic mb-3">
                      "{gap.pillar.governingQuestion}"
                    </p>

                    <p className="text-xs text-charcoal-muted leading-relaxed font-sans">
                      {gap.insight}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-warm-200 text-[11px] font-medium text-charcoal-muted">
                    Development Band: {gap.band.label}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ==========================================
            SECTION 05: YOUR NEXT DEVELOPMENT PRIORITIES
            ========================================== */}
        <section
          aria-labelledby="section-priorities"
          className="bg-white rounded-2xl border border-warm-300 p-6 sm:p-8 md:p-10 shadow-xs print-avoid-break"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-charcoal" />
            <span className="text-xs uppercase font-bold tracking-wider text-charcoal-muted font-mono">
              Section 05 · Strategic Roadmap
            </span>
          </div>

          <h2 id="section-priorities" className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-charcoal mb-3">
            Your Next Development Priorities
          </h2>

          <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed mb-8 max-w-2xl font-sans">
            Addressing bottlenecks sequentially according to framework dependencies produces enduring progress. Here are your top three recommended areas of deliberate focus:
          </p>

          <div className="space-y-6">
            {results.priorities.map((item, idx) => {
              const dim = DIMENSIONS[item.pillar.dimension];

              return (
                <div
                  key={item.pillar.id}
                  className="p-6 rounded-xl bg-warm-50/90 border border-warm-300 space-y-4 print-avoid-break shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-warm-200">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-charcoal text-warm-50 font-bold text-xs flex items-center justify-center font-mono">
                        0{idx + 1}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal">
                        {item.pillar.name}
                      </h3>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border"
                        style={{
                          backgroundColor: dim.lightHex,
                          color: dim.hex,
                          borderColor: `${dim.hex}30`,
                        }}
                      >
                        {item.pillar.dimension} · {dim.name}
                      </span>
                    </div>

                    <span className="text-xs font-mono text-charcoal-muted font-medium">
                      Current Score: <strong className="text-charcoal font-semibold">{item.pillarScore} / 35</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                    <div>
                      <span className="uppercase tracking-wider font-bold text-charcoal-muted block mb-1">
                        Why It Matters
                      </span>
                      <p className="text-charcoal leading-relaxed">{item.whyItMatters}</p>
                    </div>

                    <div>
                      <span className="uppercase tracking-wider font-bold text-charcoal-muted block mb-1">
                        What to Focus On
                      </span>
                      <p className="text-charcoal leading-relaxed">{item.focusArea}</p>
                    </div>

                    <div>
                      <span className="uppercase tracking-wider font-bold text-charcoal-muted block mb-1">
                        Practical Next Action
                      </span>
                      <div className="p-3 rounded-lg bg-white border border-warm-300 text-charcoal font-medium leading-relaxed shadow-xs">
                        {item.practicalAction}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ==========================================
            SECTION 06: CLOSING MESSAGE
            ========================================== */}
        <section
          aria-labelledby="section-closing"
          className="bg-white rounded-2xl border border-warm-300 p-8 sm:p-10 md:p-12 text-center max-w-3xl mx-auto print-avoid-break"
        >
          <span className="text-xs uppercase font-bold tracking-wider text-charcoal-muted font-mono mb-3 block">
            Section 06 · The Journey Ahead
          </span>

          <h2
            id="section-closing"
            className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-charcoal mb-4"
          >
            Your RISE journey does not end with this assessment.
          </h2>

          <p className="font-serif text-lg sm:text-xl italic text-charcoal-muted mb-6 leading-relaxed">
            "It begins with a clearer understanding of where you are and what needs to happen next."
          </p>

          <p className="text-sm sm:text-base text-charcoal-muted font-sans leading-relaxed max-w-xl mx-auto mb-8">
            The next step is to turn these insights into deliberate action. Use your diagnostic profile and prioritized recommendations to structure your commitments over the coming quarter.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[16px] bg-charcoal text-warm-50 text-sm font-medium hover:bg-charcoal/90 transition-all shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Save Full Report as PDF</span>
            </button>
          </div>
        </section>

        {/* Print Document Footer */}
        <div className="hidden print:flex items-center justify-between pt-6 border-t border-warm-300 text-xs text-charcoal-muted font-mono">
          <span>Phoszade © {new Date().getFullYear()} · THE RISE Framework · Confidential Diagnostic Report</span>
          <span>Prepared for: {results.participantName}</span>
        </div>
        </div>
      </main>

      {/* Confirmation Modal for Retake Assessment */}
      {showRetakeConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-xl border border-warm-300 space-y-4">
            <h3 className="font-serif text-xl font-bold text-charcoal">
              Retake Assessment?
            </h3>
            <p className="text-sm text-charcoal-muted leading-relaxed font-sans">
              This will reset your saved answers and return you to the beginning of the RISE assessment. Are you sure you wish to restart?
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowRetakeConfirm(false)}
                className="px-4 py-2.5 rounded-[16px] border border-warm-300 text-charcoal text-xs font-semibold tracking-wide uppercase hover:bg-warm-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRetakeConfirm(false);
                  onRetake();
                }}
                className="px-5 py-2.5 rounded-[16px] bg-red-700 text-white text-xs font-semibold tracking-wide uppercase hover:bg-red-800 transition-colors shadow-sm cursor-pointer"
              >
                Reset and Retake
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer matching First Page Spacing */}
      <footer className="w-full px-5 py-4 sm:px-8 md:px-14 lg:px-20 border-t border-warm-300 text-xs text-charcoal-muted flex flex-col sm:flex-row items-center justify-between gap-2 print:hidden">
        <span>Phoszade &copy; {new Date().getFullYear()} · THE RISE Framework · Confidential Personal Report</span>
        <span>Generated for {results.participantName}</span>
      </footer>
    </div>
  );
};
