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
    // Never persist 'admin' screen to localStorage so refreshing or visiting main link always opens public assessment
    const toSave = state.currentScreen === 'admin'
      ? { ...state, currentScreen: 'welcome' }
      : state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.error('Failed to save assessment state to localStorage:', error);
  }
}

export function loadAssessmentState(): AssessmentState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw);
    const screen = parsed.currentScreen === 'admin' ? 'welcome' : parsed.currentScreen;
    return {
      ...INITIAL_STATE,
      ...parsed,
      currentScreen: screen || 'welcome',
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

