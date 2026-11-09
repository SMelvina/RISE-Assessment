import React, { useState, useMemo } from 'react';
import { ParticipantSubmission } from '../data/adminSubmissions';
import { DIMENSIONS, PILLAR_PASTELS } from '../data/dimensions';
import { PILLARS } from '../data/pillars';
import { BrandLogo } from './BrandLogo';
import {
  Users,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  Search,
  Eye,
  Download,
  RotateCcw,
  Compass,
} from 'lucide-react';

interface AdminDashboardProps {
  submissions: ParticipantSubmission[];
  onPreviewSubmission: (submission: ParticipantSubmission) => void;
  onOpenUserAssessment: () => void;
  onResetCohortData?: () => void;
  onClearDemoData?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  submissions,
  onPreviewSubmission,
  onOpenUserAssessment,
  onResetCohortData,
  onClearDemoData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDimension, setSelectedDimension] = useState<string>('ALL');

  // Check if any mock demo seed profiles are in the cohort
  const hasDemoSubmissions = useMemo(
    () => submissions.some((s) => s.id.match(/^sub-00[0-9]|^sub-01[0-2]/)),
    [submissions]
  );

  // Aggregated Analytics
  const totalUsers = submissions.length;

  const avgTotalScore = useMemo(() => {
    if (totalUsers === 0) return 0;
    const sum = submissions.reduce((acc, curr) => acc + curr.totalScore, 0);
    return Math.round((sum / totalUsers) * 10) / 10;
  }, [submissions, totalUsers]);

  const avgOverallIndex = useMemo(() => {
    if (totalUsers === 0) return 0;
    const sum = submissions.reduce((acc, curr) => acc + curr.overallIndex, 0);
    return Math.round(sum / totalUsers);
  }, [submissions, totalUsers]);

  // Dimension Averages
  const dimensionAverages = useMemo(() => {
    if (totalUsers === 0) return { R: 0, I: 0, S: 0, E: 0 };
    return {
      R: Math.round(submissions.reduce((acc, s) => acc + s.dimensionPercentages.R, 0) / totalUsers),
      I: Math.round(submissions.reduce((acc, s) => acc + s.dimensionPercentages.I, 0) / totalUsers),
      S: Math.round(submissions.reduce((acc, s) => acc + s.dimensionPercentages.S, 0) / totalUsers),
      E: Math.round(submissions.reduce((acc, s) => acc + s.dimensionPercentages.E, 0) / totalUsers),
    };
  }, [submissions, totalUsers]);

  // Stage Distribution
  const stageDistribution = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    submissions.forEach((s) => {
      counts[s.pinpointedStageNumber] = (counts[s.pinpointedStageNumber] || 0) + 1;
    });
    return counts;
  }, [submissions]);

  // Most common stage
  const mostCommonStage = useMemo(() => {
    if (totalUsers === 0) return null;
    let topStageNum = 1;
    let maxCount = -1;
    Object.entries(stageDistribution).forEach(([stageNum, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topStageNum = Number(stageNum);
      }
    });
    const pillar = PILLARS.find((p) => p.number === topStageNum) || PILLARS[0];
    return { pillar, count: maxCount };
  }, [stageDistribution, totalUsers]);

  // Filtered Submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      const matchesSearch = s.participantName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDim =
        selectedDimension === 'ALL' || s.pinpointedDimension === selectedDimension;
      return matchesSearch && matchesDim;
    });
  }, [submissions, searchTerm, selectedDimension]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Participant Name',
      'Date Completed',
      'Total Score (out of 315)',
      'Index (%)',
      'Pinpointed Stage Number',
      'Pinpointed Stage Name',
      'Dimension',
      'Realize (%)',
      'Illuminate (%)',
      'Start (%)',
      'Expand (%)',
    ];
    const rows = submissions.map((s) => [
      `"${s.participantName.replace(/"/g, '""')}"`,
      new Date(s.completedAt).toLocaleDateString(),
      s.totalScore,
      s.overallIndex,
      s.pinpointedStageNumber,
      `"${s.pinpointedStageName}"`,
      s.pinpointedDimension,
      s.dimensionPercentages.R,
      s.dimensionPercentages.I,
      s.dimensionPercentages.S,
      s.dimensionPercentages.E,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `RISE_Responses_Summary_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen w-full bg-warm-50 text-charcoal flex flex-col justify-between select-none">
      {/* Top Header */}
      <header className="w-full px-5 py-5 sm:px-8 md:px-14 lg:px-20 flex flex-col sm:flex-row sm:items-center justify-between border-b border-warm-300 gap-4 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <BrandLogo variant="dark" size="md" showSubtitle={true} />
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[16px] bg-[#024F28] text-white text-xs font-bold uppercase tracking-wider font-mono">
            Admin Portal
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[16px] border border-warm-300 bg-white hover:bg-warm-100 text-charcoal text-xs font-semibold tracking-wide uppercase transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-charcoal-muted" />
            <span>Export CSV</span>
          </button>

          {hasDemoSubmissions && onClearDemoData && (
            <button
              type="button"
              onClick={onClearDemoData}
              title="Remove sample demo responses to view only real live data"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-[16px] border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold tracking-wide uppercase transition-colors shadow-xs cursor-pointer"
            >
              <span>Clear Demo Data</span>
            </button>
          )}

          {!hasDemoSubmissions && onResetCohortData && (
            <button
              type="button"
              onClick={onResetCohortData}
              title="Refresh submissions"
              className="inline-flex items-center gap-2 px-3 py-2.5 rounded-[16px] border border-warm-300 bg-warm-100 hover:bg-warm-200 text-charcoal text-xs font-semibold tracking-wide uppercase transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-charcoal-muted" />
              <span>Refresh</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenUserAssessment}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[16px] bg-[#024F28] hover:bg-[#013D1F] text-white text-xs font-semibold tracking-wide uppercase transition-colors shadow-sm cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#E39F00]" />
            <span>Standard User View</span>
          </button>
        </div>
      </header>

      {/* Main Admin Dashboard */}
      <main className="w-full px-5 py-8 sm:px-8 md:px-14 lg:px-20 my-auto flex-1 max-w-7xl mx-auto space-y-8 animate-screen-in">
        {/* Title & Introduction */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-warm-300">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-charcoal-muted font-mono mb-2">
              Executive Telemetry & Diagnostic Cohort
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-charcoal">
              Responses & Participant Overview
            </h1>
          </div>
          <p className="text-sm text-charcoal-muted max-w-md">
            Summary of all participant diagnostic submissions to date, aggregated dimension performance, and individual respondent previews.
          </p>
        </div>

        {/* 4 Primary KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Users Responded */}
          <div className="bg-white p-6 rounded-[16px] border border-warm-300 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-charcoal-muted mb-4">
              <span className="text-xs uppercase font-bold tracking-wider font-mono">
                Total Respondents
              </span>
              <div className="w-9 h-9 rounded-[12px] bg-warm-100 flex items-center justify-center text-[#024F28]">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold font-serif text-charcoal mb-1">
                {totalUsers}
              </div>
              <span className="text-xs text-emerald-700 font-semibold inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
                Completed Assessments
              </span>
            </div>
          </div>

          {/* Card 2: Average Overall Index */}
          <div className="bg-white p-6 rounded-[16px] border border-warm-300 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-charcoal-muted mb-4">
              <span className="text-xs uppercase font-bold tracking-wider font-mono">
                Average Capacity Index
              </span>
              <div className="w-9 h-9 rounded-[12px] bg-warm-100 flex items-center justify-center text-[#724F00]">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold font-serif text-charcoal mb-1">
                {avgOverallIndex}%
              </div>
              <span className="text-xs text-charcoal-muted font-medium">
                Avg Score: <strong>{avgTotalScore}</strong> / 315 pts
              </span>
            </div>
          </div>

          {/* Card 3: Most Common Active Stage */}
          <div className="bg-white p-6 rounded-[16px] border border-warm-300 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-charcoal-muted mb-4">
              <span className="text-xs uppercase font-bold tracking-wider font-mono">
                Primary Bottleneck Stage
              </span>
              <div className="w-9 h-9 rounded-[12px] bg-warm-100 flex items-center justify-center text-[#D45711]">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-serif text-charcoal mb-1 truncate">
                {mostCommonStage ? `0${mostCommonStage.pillar.number} · ${mostCommonStage.pillar.name}` : '—'}
              </div>
              <span className="text-xs text-charcoal-muted font-medium">
                {mostCommonStage
                  ? `${mostCommonStage.count} participants (${totalUsers > 0 ? Math.round((mostCommonStage.count / totalUsers) * 100) : 0}%) currently active here`
                  : 'Waiting for live assessment submissions'}
              </span>
            </div>
          </div>

          {/* Card 4: Response Completion Rate */}
          <div className="bg-white p-6 rounded-[16px] border border-warm-300 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-charcoal-muted mb-4">
              <span className="text-xs uppercase font-bold tracking-wider font-mono">
                Completion Rate
              </span>
              <div className="w-9 h-9 rounded-[12px] bg-warm-100 flex items-center justify-center text-[#8C3A2B]">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold font-serif text-charcoal mb-1">
                {totalUsers > 0 ? '100%' : '0%'}
              </div>
              <span className="text-xs text-emerald-700 font-semibold">
                {totalUsers > 0 ? '63 / 63 questions required' : 'Awaiting Submissions'}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Dimension Summary Row */}
        <div className="bg-white p-6 rounded-[16px] border border-warm-300 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase font-bold tracking-widest font-mono text-charcoal-muted">
              Average Performance Across the 4 Dimensions
            </h2>
            <span className="text-xs text-charcoal-muted font-sans font-medium">
              Realize · Illuminate · Start · Expand
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Dimension R */}
            <div className="p-4 rounded-[16px] bg-warm-50 border border-warm-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase" style={{ color: DIMENSIONS.R.hex }}>
                  R · Realize
                </span>
                <span className="text-xs font-bold font-mono">{dimensionAverages.R}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-warm-200 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${dimensionAverages.R}%`, backgroundColor: DIMENSIONS.R.hex }}
                />
              </div>
            </div>

            {/* Dimension I */}
            <div className="p-4 rounded-[16px] bg-warm-50 border border-warm-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase" style={{ color: DIMENSIONS.I.hex }}>
                  I · Illuminate
                </span>
                <span className="text-xs font-bold font-mono">{dimensionAverages.I}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-warm-200 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${dimensionAverages.I}%`, backgroundColor: DIMENSIONS.I.hex }}
                />
              </div>
            </div>

            {/* Dimension S */}
            <div className="p-4 rounded-[16px] bg-warm-50 border border-warm-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase" style={{ color: DIMENSIONS.S.hex }}>
                  S · Start
                </span>
                <span className="text-xs font-bold font-mono">{dimensionAverages.S}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-warm-200 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${dimensionAverages.S}%`, backgroundColor: DIMENSIONS.S.hex }}
                />
              </div>
            </div>

            {/* Dimension E */}
            <div className="p-4 rounded-[16px] bg-warm-50 border border-warm-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase" style={{ color: DIMENSIONS.E.hex }}>
                  E · Expand
                </span>
                <span className="text-xs font-bold font-mono">{dimensionAverages.E}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-warm-200 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${dimensionAverages.E}%`, backgroundColor: DIMENSIONS.E.hex }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 9-Stage Distribution Chart */}
        <div className="bg-white p-6 sm:p-7 rounded-[16px] border border-warm-300 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-serif font-bold text-charcoal">
                Cohort Stage Distribution
              </h2>
              <p className="text-xs text-charcoal-muted">
                Distribution of respondents across the 9 stages of the RISE framework.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-charcoal-muted">
              {totalUsers} Total Submissions Analyzed
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2 pt-2">
            {PILLARS.map((p) => {
              const count = stageDistribution[p.number] || 0;
              const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
              const pastel = PILLAR_PASTELS[p.number];

              return (
                <div
                  key={p.id}
                  className="flex flex-col items-center p-3 rounded-[16px] border border-warm-200 bg-warm-50 text-center"
                >
                  <span className="text-[10px] uppercase font-bold font-mono text-charcoal-muted">
                    0{p.number}
                  </span>
                  <span className="text-xs font-bold text-charcoal truncate w-full my-1">
                    {p.name}
                  </span>
                  <div
                    className="w-full py-2 rounded-[10px] text-center font-bold text-sm my-1"
                    style={{ backgroundColor: pastel.bg, color: pastel.text }}
                  >
                    {count}
                  </div>
                  <span className="text-[11px] text-charcoal-muted font-mono">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submissions Table with Search & Filter */}
        <div className="bg-white rounded-[16px] border border-warm-300 shadow-xs overflow-hidden">
          {/* Table Header Controls */}
          <div className="p-5 sm:p-6 border-b border-warm-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-charcoal">
                Participant Submissions ({filteredSubmissions.length})
              </h2>
              <p className="text-xs text-charcoal-muted">
                Click "Preview Diagnosis" on any respondent to view their personalized 7-section report.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search participants..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-[16px] border border-warm-300 bg-warm-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#024F28] transition-all"
                />
              </div>

              {/* Dimension Filter */}
              <select
                value={selectedDimension}
                onChange={(e) => setSelectedDimension(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-xs rounded-[16px] border border-warm-300 bg-warm-50 focus:outline-none focus:ring-1 focus:ring-[#024F28] text-charcoal font-semibold cursor-pointer"
              >
                <option value="ALL">All Dimensions</option>
                <option value="R">Dimension R (Realize)</option>
                <option value="I">Dimension I (Illuminate)</option>
                <option value="S">Dimension S (Start)</option>
                <option value="E">Dimension E (Expand)</option>
              </select>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-warm-100/70 border-b border-warm-300 text-[11px] font-bold uppercase tracking-wider text-charcoal-muted font-mono">
                  <th className="py-3 px-5 sm:px-6">Participant</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Total Score</th>
                  <th className="py-3 px-4">Active Stage Pinpoint</th>
                  <th className="py-3 px-4">Dimensions</th>
                  <th className="py-3 px-5 sm:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-200 text-sm">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-14 text-center text-charcoal-muted text-sm">
                      <div className="max-w-md mx-auto space-y-2">
                        <div className="w-10 h-10 rounded-full bg-warm-200 text-charcoal flex items-center justify-center mx-auto mb-3">
                          <Users className="w-5 h-5 text-charcoal-muted" />
                        </div>
                        <p className="font-semibold text-charcoal text-base">
                          {totalUsers === 0
                            ? 'No live assessment submissions yet'
                            : 'No participant submissions match your current search criteria'}
                        </p>
                        <p className="text-xs text-charcoal-muted max-w-sm mx-auto leading-relaxed">
                          {totalUsers === 0
                            ? 'Share your public assessment link with candidates. When they complete the assessment, their live diagnostic profiles will automatically appear here.'
                            : 'Try adjusting your search terms or dimension filters.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => {
                    const pastel = PILLAR_PASTELS[sub.pinpointedStageNumber];
                    const dateFormatted = new Date(sub.completedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });

                    return (
                      <tr key={sub.id} className="hover:bg-warm-50/70 transition-colors group">
                        {/* Name */}
                        <td className="py-4 px-5 sm:px-6 font-semibold text-charcoal">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-warm-200 text-charcoal flex items-center justify-center font-bold text-xs flex-shrink-0">
                              {sub.participantName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="block leading-tight">{sub.participantName}</span>
                              <span className="text-[11px] font-normal text-charcoal-muted">
                                {sub.status}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 text-xs text-charcoal-muted whitespace-nowrap font-mono">
                          {dateFormatted}
                        </td>

                        {/* Score & Index */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="font-bold text-charcoal font-mono">
                            {sub.totalScore}
                          </span>
                          <span className="text-xs text-charcoal-muted font-mono"> / 315</span>
                          <span className="ml-2 inline-block text-xs font-bold px-2 py-0.5 rounded-[8px] bg-warm-200 text-charcoal">
                            {sub.overallIndex}%
                          </span>
                        </td>

                        {/* Pinpoint Stage */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[12px] text-xs font-bold border"
                            style={{
                              backgroundColor: pastel.bg,
                              borderColor: `${pastel.contrastColor}40`,
                              color: pastel.text,
                            }}
                          >
                            <span>Stage 0{sub.pinpointedStageNumber}:</span>
                            <span>{sub.pinpointedStageName}</span>
                          </span>
                        </td>

                        {/* Dimension Mini Breakdown */}
                        <td className="py-4 px-4 whitespace-nowrap text-xs font-mono text-charcoal-muted">
                          <div className="flex items-center gap-2">
                            <span title="Realize">R: {sub.dimensionPercentages.R}%</span>
                            <span className="text-warm-300">·</span>
                            <span title="Illuminate">I: {sub.dimensionPercentages.I}%</span>
                            <span className="text-warm-300">·</span>
                            <span title="Start">S: {sub.dimensionPercentages.S}%</span>
                            <span className="text-warm-300">·</span>
                            <span title="Expand">E: {sub.dimensionPercentages.E}%</span>
                          </div>
                        </td>

                        {/* Preview Action Button */}
                        <td className="py-4 px-5 sm:px-6 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => onPreviewSubmission(sub)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[12px] bg-warm-100 hover:bg-[#024F28] text-charcoal hover:text-white border border-warm-300 hover:border-[#024F28] text-xs font-semibold tracking-wide transition-all shadow-2xs group cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-charcoal-muted group-hover:text-white" />
                            <span>Preview Diagnosis</span>
                            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Admin Footer */}
      <footer className="w-full px-5 py-4 sm:px-8 md:px-14 lg:px-20 border-t border-warm-300 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-muted gap-2 bg-white/50">
        <span>Phoszade © {new Date().getFullYear()} · THE RISE Framework · Administrative Console</span>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onOpenUserAssessment}
            className="text-xs text-charcoal hover:underline font-semibold cursor-pointer"
          >
            Switch to User Assessment Mode &rarr;
          </button>
        </div>
      </footer>
    </div>
  );
};

