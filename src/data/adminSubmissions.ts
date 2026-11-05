import { ScoreValue } from '../types';
import { QUESTION_BANK } from './questionBank';
import { calculateAssessmentResults } from '../utils/scoring';
import { syncSubmissionToSupabase, isSupabaseConfigured } from '../utils/supabase';

export interface ParticipantSubmission {
  id: string;
  participantName: string;
  startedAt: string;
  completedAt: string;
  totalScore: number;
  overallIndex: number;
  pinpointedStageNumber: number;
  pinpointedStageName: string;
  pinpointedDimension: 'R' | 'I' | 'S' | 'E';
  status: 'Completed' | 'In Progress';
  dimensionScores: {
    R: number; // max 105
    I: number; // max 70
    S: number; // max 70
    E: number; // max 70
  };
  dimensionPercentages: {
    R: number;
    I: number;
    S: number;
    E: number;
  };
  responses: Record<string, ScoreValue>;
}

// Helper to generate full responses from pillar score profiles
function generateCohortResponses(pillarScores: number[]): Record<string, ScoreValue> {
  const responses: Record<string, ScoreValue> = {};
  QUESTION_BANK.forEach((q) => {
    const pillarIdx = q.pillarNumber - 1;
    const targetPillarAvg = (pillarScores[pillarIdx] || 25) / 7;
    // Introduce natural variance around the pillar target
    const jitter = ((q.questionNumber % 3) - 1) * 0.4;
    const rawVal = Math.round(targetPillarAvg + jitter);
    const score = Math.max(1, Math.min(5, rawVal)) as ScoreValue;
    responses[q.id] = score;
  });
  return responses;
}

// 12 Realistic Seed Submissions across executive personas
const SEED_SUBMISSIONS_DATA: Array<{
  id: string;
  name: string;
  daysAgo: number;
  pillarScores: number[]; // 9 scores (max 35 each)
}> = [
  {
    id: 'sub-001',
    name: 'Somtochukwu Okafor',
    daysAgo: 0,
    pillarScores: [33, 31, 30, 28, 27, 26, 23, 19, 16], // Active Stage 7: Build
  },
  {
    id: 'sub-002',
    name: 'Amara Vance',
    daysAgo: 1,
    pillarScores: [32, 29, 28, 26, 21, 18, 16, 14, 11], // Active Stage 5: Architect
  },
  {
    id: 'sub-003',
    name: 'David Chen',
    daysAgo: 2,
    pillarScores: [35, 34, 34, 33, 32, 31, 30, 24, 20], // Active Stage 8: Scale
  },
  {
    id: 'sub-004',
    name: 'Zainab Al-Mansoor',
    daysAgo: 3,
    pillarScores: [30, 27, 25, 20, 18, 16, 14, 12, 10], // Active Stage 4: Articulate
  },
  {
    id: 'sub-005',
    name: 'Marcus Brody',
    daysAgo: 4,
    pillarScores: [33, 32, 31, 29, 27, 22, 19, 15, 12], // Active Stage 6: Launch
  },
  {
    id: 'sub-006',
    name: 'Elena Rostova',
    daysAgo: 5,
    pillarScores: [28, 26, 19, 16, 15, 13, 11, 10, 9], // Active Stage 3: Crystallize
  },
  {
    id: 'sub-007',
    name: 'Kwame Asante',
    daysAgo: 6,
    pillarScores: [34, 33, 32, 31, 29, 28, 24, 21, 17], // Active Stage 7: Build
  },
  {
    id: 'sub-008',
    name: 'Sarah Jenkins',
    daysAgo: 7,
    pillarScores: [31, 28, 27, 25, 20, 17, 15, 13, 10], // Active Stage 5: Architect
  },
  {
    id: 'sub-009',
    name: 'Tariq Sterling',
    daysAgo: 8,
    pillarScores: [26, 18, 16, 14, 13, 12, 10, 9, 8], // Active Stage 2: Clarify
  },
  {
    id: 'sub-010',
    name: 'Priya Patel',
    daysAgo: 10,
    pillarScores: [33, 31, 30, 29, 28, 22, 20, 17, 14], // Active Stage 6: Launch
  },
  {
    id: 'sub-011',
    name: 'Jonathan Hayes',
    daysAgo: 12,
    pillarScores: [35, 35, 34, 34, 33, 33, 32, 31, 26], // Active Stage 9: Lead
  },
  {
    id: 'sub-012',
    name: 'Fatima Bello',
    daysAgo: 14,
    pillarScores: [29, 27, 26, 21, 19, 17, 15, 12, 10], // Active Stage 4: Articulate
  },
];

function computeDimensionScores(pillarResults: Record<string, { score: number; pillar: { dimension: string } }>) {
  let rScore = 0;
  let iScore = 0;
  let sScore = 0;
  let eScore = 0;
  Object.values(pillarResults).forEach((pr) => {
    if (pr.pillar.dimension === 'R') rScore += pr.score;
    if (pr.pillar.dimension === 'I') iScore += pr.score;
    if (pr.pillar.dimension === 'S') sScore += pr.score;
    if (pr.pillar.dimension === 'E') eScore += pr.score;
  });
  return {
    scores: {
      R: rScore,
      I: iScore,
      S: sScore,
      E: eScore,
    },
    percentages: {
      R: Math.round((rScore / 105) * 100),
      I: Math.round((iScore / 70) * 100),
      S: Math.round((sScore / 70) * 100),
      E: Math.round((eScore / 70) * 100),
    },
  };
}

export function getInitialSubmissions(): ParticipantSubmission[] {
  return SEED_SUBMISSIONS_DATA.map((item) => {
    const responses = generateCohortResponses(item.pillarScores);
    const completedDate = new Date(Date.now() - item.daysAgo * 86400000 - 3600000 * 4);
    const startedDate = new Date(completedDate.getTime() - 25 * 60000);
    const results = calculateAssessmentResults(item.name, responses, startedDate.toISOString());
    const dimData = computeDimensionScores(results.pillarResults);

    return {
      id: item.id,
      participantName: item.name,
      startedAt: startedDate.toISOString(),
      completedAt: completedDate.toISOString(),
      totalScore: results.totalScore,
      overallIndex: results.overallPercentage,
      pinpointedStageNumber: results.journeyDiagnosis.activeFrontier.number,
      pinpointedStageName: results.journeyDiagnosis.activeFrontier.name,
      pinpointedDimension: results.journeyDiagnosis.activeFrontier.dimension,
      status: 'Completed',
      dimensionScores: dimData.scores,
      dimensionPercentages: dimData.percentages,
      responses,
    };
  });
}

const ADMIN_STORAGE_KEY = 'rise_admin_cohort_submissions_v1';

export function loadAllSubmissions(): ParticipantSubmission[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) {
      if (isSupabaseConfigured()) {
        return [];
      }
      const initial = getInitialSubmissions();
      saveAllSubmissions(initial);
      return initial;
    }
    const parsed: ParticipantSubmission[] = JSON.parse(raw);
    if (isSupabaseConfigured()) {
      return parsed.filter((s) => !s.id.match(/^sub-00[0-9]|^sub-01[0-2]/));
    }
    return parsed;
  } catch (e) {
    console.error('Error loading admin submissions:', e);
    return [];
  }
}

export function clearAllDemoSubmissions(): void {
  if (typeof window === 'undefined') return;
  const current = loadAllSubmissions();
  const realOnly = current.filter((s) => !s.id.match(/^sub-00[0-9]|^sub-01[0-2]/));
  saveAllSubmissions(realOnly);
}

export function saveAllSubmissions(submissions: ParticipantSubmission[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(submissions));
  } catch (e) {
    console.error('Error saving admin submissions:', e);
  }
}

export function recordNewSubmission(
  participantName: string,
  responses: Record<string, ScoreValue>,
  startedAt?: string | null
): ParticipantSubmission {
  const started = startedAt || new Date(Date.now() - 20 * 60000).toISOString();
  const results = calculateAssessmentResults(participantName, responses, started);
  const dimData = computeDimensionScores(results.pillarResults);

  const newSubmission: ParticipantSubmission = {
    id: `sub-${Date.now()}`,
    participantName: participantName.trim() || 'Anonymous Participant',
    startedAt: started,
    completedAt: new Date().toISOString(),
    totalScore: results.totalScore,
    overallIndex: results.overallPercentage,
    pinpointedStageNumber: results.journeyDiagnosis.activeFrontier.number,
    pinpointedStageName: results.journeyDiagnosis.activeFrontier.name,
    pinpointedDimension: results.journeyDiagnosis.activeFrontier.dimension,
    status: 'Completed',
    dimensionScores: dimData.scores,
    dimensionPercentages: dimData.percentages,
    responses,
  };

  const existing = loadAllSubmissions();
  const updated = [newSubmission, ...existing.filter((s) => s.participantName !== participantName)];
  saveAllSubmissions(updated);

  // Sync to Supabase cloud if configured
  syncSubmissionToSupabase(newSubmission);

  return newSubmission;
}
