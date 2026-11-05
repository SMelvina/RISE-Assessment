import { AssessmentState } from '../types';

const STORAGE_KEY = 'rise_assessment_state_v1';

export const INITIAL_STATE: AssessmentState = {
  currentScreen: 'welcome',
  participantName: '',
  currentPillarIndex: 0,
  currentQuestionIndex: 0,
  responses: {},
  startedAt: null,
  completedAt: null,
};

export function saveAssessmentState(state: AssessmentState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save assessment state to localStorage:', error);
  }
}

export function loadAssessmentState(): AssessmentState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_STATE,
      ...parsed,
    };
  } catch (error) {
    console.error('Failed to load assessment state from localStorage:', error);
    return INITIAL_STATE;
  }
}

export function clearAssessmentState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear assessment state:', error);
  }
}

