export type DimensionId = 'R' | 'I' | 'S' | 'E';

export interface DimensionInfo {
  id: DimensionId;
  name: string;
  theme: string;
  colorName: string;
  tailwindBorder: string;
  tailwindBgLight: string;
  tailwindText: string;
  tailwindBadge: string;
  tailwindAccent: string;
  hex: string;
  lightHex: string;
}

export interface Pillar {
  id: string; // e.g. 'identity'
  number: number; // 1 - 9
  dimension: DimensionId;
  name: string; // e.g. 'Identity'
  governingQuestion: string; // e.g. 'Who am I?'
  philosophy: string; // e.g. 'Discover yourself.'
  headline: string; // e.g. 'First, discover yourself.'
  introductionBody: string; // 50-90 words
  completionMessage: string;
  imageUrl: string;
  imageAlt: string;
  gradientTint: string;
  badgeLabel: string;
}

export interface DiagnosticQuestion {
  id: string; // e.g. 'identity-q1'
  pillarId: string;
  pillarNumber: number;
  questionNumber: number; // 1 - 7
  text: string;
  active: boolean;
}

export type ScoreValue = 1 | 2 | 3 | 4 | 5;

export interface ScoreBand {
  min: number;
  max: number;
  percentageRange: string;
  label: 'Critical development area' | 'Emerging development' | 'Developing capability' | 'Strong development';
  description: string;
}

export interface PillarResult {
  pillar: Pillar;
  score: number; // 7 - 35
  percentage: number; // 20% - 100%
  band: ScoreBand;
  answers: Record<number, number>; // questionNumber -> score (1-5)
  insight: string;
}

export interface DevelopmentPriority {
  pillar: Pillar;
  pillarScore: number;
  whyItMatters: string;
  focusArea: string;
  practicalAction: string;
}

export type StageProgressStatus = 'consolidated' | 'current_frontier' | 'horizon';

export interface JourneyDiagnosis {
  currentStage: Pillar;
  stageNumber: number; // 1 to 9
  headline: string;
  summary: string;
  consolidatedStages: Pillar[];
  activeFrontier: Pillar;
  horizonStages: Pillar[];
  stageStatuses: Record<string, StageProgressStatus>;
  whatYouHaveBuilt: string;
  currentBottleneck: string;
  unlockRequirement: string;
}

export interface AssessmentResult {
  participantName: string;
  startedAt: string;
  completedAt: string;
  totalScore: number; // 63 - 315
  overallPercentage: number;
  overallBand: ScoreBand;
  pillarResults: Record<string, PillarResult>; // keyed by pillarId
  strengths: PillarResult[]; // Top performing pillars
  developmentGaps: PillarResult[]; // Lowest performing pillars
  priorities: DevelopmentPriority[]; // Top prioritized actions
  journeyDiagnosis: JourneyDiagnosis; // The primary position in the 9-stage journey
}

export type ScreenState = 
  | 'welcome'
  | 'personalisation'
  | 'pillar_intro'
  | 'question'
  | 'pillar_transition'
  | 'processing'
  | 'results'
  | 'admin';

export interface AssessmentState {
  currentScreen: ScreenState;
  participantName: string;
  currentPillarIndex: number; // 0 - 8 (representing pillars 1 - 9)
  currentQuestionIndex: number; // 0 - 6 (representing questions 1 - 7 of current pillar)
  responses: Record<string, ScoreValue>; // questionId -> 1..5
  startedAt: string | null;
  completedAt: string | null;
}

