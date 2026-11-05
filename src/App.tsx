import { useState, useEffect, useCallback } from 'react';
import { AssessmentState, ScoreValue } from './types';
import { PILLARS } from './data/pillars';
import { getQuestionsByPillar, getOverallQuestionNumber, QUESTION_BANK } from './data/questionBank';
import { calculateAssessmentResults } from './utils/scoring';
import {
  loadAssessmentState,
  saveAssessmentState,
  clearAssessmentState,
  INITIAL_STATE,
} from './utils/storage';

import { WelcomeScreen } from './components/WelcomeScreen';
import { PersonalisationScreen } from './components/PersonalisationScreen';
import { PillarIntroScreen } from './components/PillarIntroScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { ProcessingScreen } from './components/ProcessingScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { AdminDashboard } from './components/AdminDashboard';
import {
  loadAllSubmissions,
  recordNewSubmission,
  saveAllSubmissions,
  getInitialSubmissions,
  ParticipantSubmission,
} from './data/adminSubmissions';

// Benchmark sample response set for instant prototype results preview
function getBenchmarkResponses(): Record<string, ScoreValue> {
  const sampleResponses: Record<string, ScoreValue> = {};
  const pattern = [
    5, 4, 4, 5, 4, 4, 5, // Pillar 1 (Identity): 31 (Strong)
    4, 4, 3, 4, 5, 4, 4, // Pillar 2 (Clarify): 28 (Developing)
    4, 4, 4, 3, 4, 4, 4, // Pillar 3 (Crystallize): 27 (Developing)
    3, 4, 3, 4, 3, 3, 4, // Pillar 4 (Articulate): 24 (Developing)
    3, 3, 3, 4, 3, 2, 3, // Pillar 5 (Architect): 21 (Emerging - Active Stage)
    2, 3, 2, 3, 2, 3, 2, // Pillar 6 (Launch): 17 (Emerging)
    2, 2, 3, 2, 2, 2, 2, // Pillar 7 (Build): 15 (Emerging)
    2, 1, 2, 2, 2, 1, 2, // Pillar 8 (Scale): 12 (Critical)
    1, 2, 1, 2, 1, 1, 2, // Pillar 9 (Lead): 10 (Critical)
  ];
  QUESTION_BANK.forEach((q, idx) => {
    sampleResponses[q.id] = (pattern[idx] || 3) as ScoreValue;
  });
  return sampleResponses;
}

export function App() {
  const [state, setState] = useState<AssessmentState>(() => {
    const loaded = loadAssessmentState();
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const view =
        urlParams.get('view') ||
        urlParams.get('screen') ||
        window.location.hash.replace('#', '');

      if (view === 'admin') {
        return {
          ...loaded,
          currentScreen: 'admin',
        };
      }

      if (view === 'results') {
        return {
          ...loaded,
          participantName: loaded.participantName || 'Somtochukwu',
          startedAt: loaded.startedAt || new Date(Date.now() - 3600000).toISOString(),
          completedAt: new Date().toISOString(),
          responses: getBenchmarkResponses(),
          currentScreen: 'results',
        };
      }
    }
    return loaded;
  });

  // Automatically save state on changes
  useEffect(() => {
    saveAssessmentState(state);
  }, [state]);

  // Support direct dynamic switching via URL hash or search param (?view=results / #results)
  useEffect(() => {
    const handleUrlNavigation = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const view =
        urlParams.get('view') ||
        urlParams.get('screen') ||
        window.location.hash.replace('#', '');

      if (view === 'admin') {
        setState((prev) => ({
          ...prev,
          currentScreen: 'admin',
        }));
        return;
      }

      if (view === 'results') {
        setState((prev) => ({
          ...prev,
          participantName: prev.participantName || 'Somtochukwu',
          startedAt: prev.startedAt || new Date(Date.now() - 3600000).toISOString(),
          completedAt: new Date().toISOString(),
          responses: getBenchmarkResponses(),
          currentScreen: 'results',
        }));
      } else if (view === 'welcome') {
        setState((prev) => ({
          ...prev,
          currentScreen: 'welcome',
        }));
      }
    };

    window.addEventListener('popstate', handleUrlNavigation);
    window.addEventListener('hashchange', handleUrlNavigation);
    return () => {
      window.removeEventListener('popstate', handleUrlNavigation);
      window.removeEventListener('hashchange', handleUrlNavigation);
    };
  }, []);

  const hasExistingProgress =
    Boolean(state.participantName && Object.keys(state.responses).length > 0) &&
    state.currentScreen !== 'welcome' &&
    state.currentScreen !== 'results' &&
    state.currentScreen !== 'admin';

  // Cohort submissions recorded for the Admin Dashboard
  const [submissions, setSubmissions] = useState<ParticipantSubmission[]>(() => loadAllSubmissions());
  const [adminPreviewActive, setAdminPreviewActive] = useState<boolean>(false);

  // State for restart confirmation modal triggered by clicking the Brand Logo
  const [showHomeConfirmModal, setShowHomeConfirmModal] = useState(false);

  // Admin Navigation Handlers
  const handleOpenAdmin = useCallback(() => {
    setAdminPreviewActive(false);
    setState((prev) => ({
      ...prev,
      currentScreen: 'admin',
    }));
  }, []);

  const handleOpenUserAssessment = useCallback(() => {
    setAdminPreviewActive(false);
    setState((prev) => ({
      ...prev,
      currentScreen: 'welcome',
    }));
  }, []);

  const handlePreviewSubmission = useCallback((sub: ParticipantSubmission) => {
    setAdminPreviewActive(true);
    setState((prev) => ({
      ...prev,
      participantName: sub.participantName,
      responses: sub.responses,
      startedAt: sub.startedAt,
      completedAt: sub.completedAt,
      currentScreen: 'results',
    }));
  }, []);

  const handleReturnToAdmin = useCallback(() => {
    setAdminPreviewActive(false);
    setState((prev) => ({
      ...prev,
      currentScreen: 'admin',
    }));
  }, []);

  const handleResetCohortData = useCallback(() => {
    const fresh = getInitialSubmissions();
    saveAllSubmissions(fresh);
    setSubmissions(fresh);
  }, []);

  // Logo click handler: Return to home, prompting confirmation if responses exist
  const handleLogoClick = useCallback(() => {
    if (state.currentScreen === 'welcome') {
      return; // Already on home screen
    }

    const hasResponses = Object.keys(state.responses).length > 0;
    if (hasResponses) {
      setShowHomeConfirmModal(true);
    } else {
      setState((prev) => ({
        ...prev,
        currentScreen: 'welcome',
      }));
    }
  }, [state.currentScreen, state.responses]);

  const handleConfirmResetToHome = useCallback(() => {
    setShowHomeConfirmModal(false);
    clearAssessmentState();
    setState(INITIAL_STATE);
  }, []);

  // Navigation handlers
  const handleStartWelcome = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'personalisation',
    }));
  }, []);

  const handleResume = useCallback(() => {
    // Keep currentScreen as loaded
  }, []);

  const handleReset = useCallback(() => {
    clearAssessmentState();
    setState(INITIAL_STATE);
  }, []);

  const handlePersonalisationContinue = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      participantName: name,
      startedAt: prev.startedAt || new Date().toISOString(),
      currentScreen: 'pillar_intro',
      currentPillarIndex: 0,
      currentQuestionIndex: 0,
    }));
  }, []);

  const handlePersonalisationBack = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'welcome',
    }));
  }, []);

  const handleBeginPillar = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'question',
      currentQuestionIndex: 0,
    }));
  }, []);

  const handlePillarIntroBack = useCallback(() => {
    setState((prev) => {
      if (prev.currentPillarIndex === 0) {
        return {
          ...prev,
          currentScreen: 'personalisation',
        };
      }
      return {
        ...prev,
        currentPillarIndex: prev.currentPillarIndex - 1,
        currentQuestionIndex: 6,
        currentScreen: 'question',
      };
    });
  }, []);

  const handleSelectScore = useCallback((questionId: string, score: ScoreValue) => {
    setState((prev) => ({
      ...prev,
      responses: {
        ...prev.responses,
        [questionId]: score,
      },
    }));
  }, []);

  const handleQuestionContinue = useCallback(() => {
    setState((prev) => {
      const currentQuestions = getQuestionsByPillar(PILLARS[prev.currentPillarIndex].id);
      const currentQ = currentQuestions[prev.currentQuestionIndex];

      // Strictly require a response before moving to the next question!
      if (!prev.responses[currentQ.id]) {
        return prev;
      }

      if (prev.currentQuestionIndex < currentQuestions.length - 1) {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
        };
      }

      // Completed all 7 questions in this pillar -> advance straight to next pillar intro screen
      if (prev.currentPillarIndex < PILLARS.length - 1) {
        return {
          ...prev,
          currentPillarIndex: prev.currentPillarIndex + 1,
          currentQuestionIndex: 0,
          currentScreen: 'pillar_intro',
        };
      }

      // Completed final pillar
      return {
        ...prev,
        completedAt: new Date().toISOString(),
        currentScreen: 'processing',
      };
    });
  }, []);

  const handleQuestionBack = useCallback(() => {
    setState((prev) => {
      if (prev.currentQuestionIndex > 0) {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex - 1,
        };
      }
      return {
        ...prev,
        currentScreen: 'pillar_intro',
      };
    });
  }, []);

  const handleProcessingComplete = useCallback(() => {
    // Automatically record participant submission into admin telemetry
    const newSub = recordNewSubmission(
      state.participantName || 'Participant',
      state.responses,
      state.startedAt
    );
    setSubmissions((prev) => [newSub, ...prev.filter((s) => s.id !== newSub.id)]);

    setState((prev) => ({
      ...prev,
      completedAt: new Date().toISOString(),
      currentScreen: 'results',
    }));
  }, [state.participantName, state.responses, state.startedAt]);

  // ==========================================
  // GLOBAL KEYBOARD NAVIGATION (ArrowLeft & ArrowRight)
  // Allows testing the entire prototype screen by screen using arrow keys!
  // ==========================================
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isInputFocused = ['INPUT', 'TEXTAREA'].includes(
        (document.activeElement as HTMLElement)?.tagName
      );

      // Navigate Forward on Right Arrow
      if (e.key === 'ArrowRight') {
        if (isInputFocused) return; // Allow normal cursor movement in input
        e.preventDefault();

        setState((prev) => {
          switch (prev.currentScreen) {
            case 'welcome':
              return {
                ...prev,
                currentScreen: 'personalisation',
              };

            case 'personalisation':
              return {
                ...prev,
                participantName: prev.participantName.trim() || 'Somtochukwu',
                startedAt: prev.startedAt || new Date().toISOString(),
                currentScreen: 'pillar_intro',
                currentPillarIndex: 0,
                currentQuestionIndex: 0,
              };

            case 'pillar_intro':
              return {
                ...prev,
                currentScreen: 'question',
                currentQuestionIndex: 0,
              };

            case 'question': {
              const currentPillar = PILLARS[prev.currentPillarIndex];
              const questions = getQuestionsByPillar(currentPillar.id);
              const currentQ = questions[prev.currentQuestionIndex];

              // Require response: cannot advance forward unless the question has been answered!
              if (!prev.responses[currentQ.id]) {
                return prev;
              }

              if (prev.currentQuestionIndex < questions.length - 1) {
                return {
                  ...prev,
                  currentQuestionIndex: prev.currentQuestionIndex + 1,
                };
              }

              // Completed all 7 questions in this pillar -> go directly to next pillar intro
              if (prev.currentPillarIndex < PILLARS.length - 1) {
                return {
                  ...prev,
                  currentPillarIndex: prev.currentPillarIndex + 1,
                  currentQuestionIndex: 0,
                  currentScreen: 'pillar_intro',
                };
              }

              // Completed 63rd question
              return {
                ...prev,
                completedAt: new Date().toISOString(),
                currentScreen: 'processing',
              };
            }

            case 'processing':
              return {
                ...prev,
                currentScreen: 'results',
              };

            case 'results':
              return prev;

            default:
              return prev;
          }
        });
      }

      // Navigate Backward on Left Arrow
      else if (e.key === 'ArrowLeft') {
        if (isInputFocused) return;
        e.preventDefault();

        setState((prev) => {
          switch (prev.currentScreen) {
            case 'welcome':
              return prev;

            case 'personalisation':
              return {
                ...prev,
                currentScreen: 'welcome',
              };

            case 'pillar_intro':
              if (prev.currentPillarIndex === 0) {
                return {
                  ...prev,
                  currentScreen: 'personalisation',
                };
              }
              return {
                ...prev,
                currentPillarIndex: prev.currentPillarIndex - 1,
                currentQuestionIndex: 6,
                currentScreen: 'question',
              };

            case 'question':
              if (prev.currentQuestionIndex > 0) {
                return {
                  ...prev,
                  currentQuestionIndex: prev.currentQuestionIndex - 1,
                };
              }
              return {
                ...prev,
                currentScreen: 'pillar_intro',
              };

            case 'processing':
              return {
                ...prev,
                currentPillarIndex: 8,
                currentQuestionIndex: 6,
                currentScreen: 'question',
              };

            case 'results':
              return {
                ...prev,
                currentScreen: 'processing',
              };

            default:
              return prev;
          }
        });
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Scroll to top on screen or pillar change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [state.currentScreen, state.currentPillarIndex]);

  // Current pillar & question calculations
  const currentPillar = PILLARS[state.currentPillarIndex] || PILLARS[0];
  const currentQuestions = getQuestionsByPillar(currentPillar.id);
  const currentQuestion = currentQuestions[state.currentQuestionIndex] || currentQuestions[0];
  const overallQuestionNumber = getOverallQuestionNumber(
    state.currentPillarIndex,
    state.currentQuestionIndex
  );

  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'admin':
        return (
          <AdminDashboard
            submissions={submissions}
            onPreviewSubmission={handlePreviewSubmission}
            onOpenUserAssessment={handleOpenUserAssessment}
            onResetCohortData={handleResetCohortData}
          />
        );

      case 'welcome':
        return (
          <WelcomeScreen
            onStart={handleStartWelcome}
            hasExistingProgress={hasExistingProgress}
            onResume={handleResume}
            onReset={handleReset}
            onHomeClick={handleLogoClick}
            onOpenAdmin={handleOpenAdmin}
          />
        );

      case 'personalisation':
        return (
          <PersonalisationScreen
            initialName={state.participantName}
            onContinue={handlePersonalisationContinue}
            onBack={handlePersonalisationBack}
            onHomeClick={handleLogoClick}
          />
        );

      case 'pillar_intro':
        return (
          <PillarIntroScreen
            pillar={currentPillar}
            participantName={state.participantName || 'Participant'}
            onBeginPillar={handleBeginPillar}
            onBack={handlePillarIntroBack}
            onHomeClick={handleLogoClick}
          />
        );

      case 'question': {
        const currentScore = state.responses[currentQuestion.id];
        return (
          <QuestionScreen
            question={currentQuestion}
            pillar={currentPillar}
            overallQuestionNumber={overallQuestionNumber}
            totalQuestionsOverall={63}
            currentScore={currentScore}
            onSelectScore={(score) => handleSelectScore(currentQuestion.id, score)}
            onContinue={handleQuestionContinue}
            onBack={handleQuestionBack}
            onHomeClick={handleLogoClick}
          />
        );
      }

      case 'pillar_transition':
        // Graceful fallback: automatically route directly to the pillar intro screen
        return (
          <PillarIntroScreen
            pillar={currentPillar}
            participantName={state.participantName || 'Participant'}
            onBeginPillar={handleBeginPillar}
            onBack={handlePillarIntroBack}
            onHomeClick={handleLogoClick}
          />
        );

      case 'processing': {
        const results = calculateAssessmentResults(
          state.participantName || 'Participant',
          state.responses,
          state.startedAt || new Date().toISOString()
        );
        return (
          <ProcessingScreen
            participantName={state.participantName || 'Participant'}
            results={results}
            onComplete={handleProcessingComplete}
            onHomeClick={handleLogoClick}
          />
        );
      }

      case 'results': {
        const results = calculateAssessmentResults(
          state.participantName || 'Participant',
          state.responses,
          state.startedAt || new Date().toISOString()
        );
        return (
          <ResultsScreen
            results={results}
            onRetake={handleReset}
            onHomeClick={handleLogoClick}
            isAdminPreview={adminPreviewActive}
            onReturnToAdmin={handleReturnToAdmin}
          />
        );
      }

      default:
        return (
          <WelcomeScreen
            onStart={handleStartWelcome}
            hasExistingProgress={hasExistingProgress}
            onResume={handleResume}
            onReset={handleReset}
            onHomeClick={handleLogoClick}
            onOpenAdmin={handleOpenAdmin}
          />
        );
    }
  };

  const screenTransitionKey =
    state.currentScreen === 'pillar_intro'
      ? `pillar_intro-${currentPillar.id}`
      : state.currentScreen === 'question'
      ? `question-${currentPillar.id}`
      : state.currentScreen;

  return (
    <>
      <div key={screenTransitionKey} className="w-full min-h-screen animate-screen-in flex flex-col">
        {renderScreen()}
      </div>

      {/* Confirmation Modal when clicking logo with active assessment responses */}
      {showHomeConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-warm-300 space-y-4 text-charcoal">
            <h3 className="font-serif text-xl font-bold text-charcoal">
              Restart Assessment?
            </h3>
            <p className="text-sm text-charcoal-muted leading-relaxed font-sans">
              You have active responses recorded in your diagnostic assessment. Returning to the home page will reset your progress. Are you sure you wish to restart?
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowHomeConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl border border-warm-300 text-charcoal text-xs font-semibold tracking-wide uppercase hover:bg-warm-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmResetToHome}
                className="px-5 py-2.5 rounded-xl bg-red-700 text-white text-xs font-semibold tracking-wide uppercase hover:bg-red-800 transition-colors shadow-sm cursor-pointer"
              >
                Reset and Return Home
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
