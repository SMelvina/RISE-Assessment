import {
  AssessmentResult,
  DevelopmentPriority,
  JourneyDiagnosis,
  Pillar,
  PillarResult,
  ScoreBand,
  ScoreValue,
  StageProgressStatus,
} from '../types';
import { PILLARS } from '../data/pillars';
import { getQuestionsByPillar } from '../data/questionBank';

export const SCORE_BANDS: Record<string, ScoreBand> = {
  critical: {
    min: 7,
    max: 14,
    percentageRange: '20% – 40%',
    label: 'Critical development area',
    description:
      'This area requires urgent and deliberate focus. Gaps here may undermine or destabilize subsequent stages of your journey.',
  },
  emerging: {
    min: 15,
    max: 21,
    percentageRange: '42.9% – 60%',
    label: 'Emerging development',
    description:
      'Foundational elements are beginning to take root, but execution remains inconsistent or lacks formal structure.',
  },
  developing: {
    min: 22,
    max: 28,
    percentageRange: '62.9% – 80%',
    label: 'Developing capability',
    description:
      'Demonstrated competence and regular practice are evident. Further refinement and systematization will establish mastery.',
  },
  strong: {
    min: 29,
    max: 35,
    percentageRange: '82.9% – 100%',
    label: 'Strong development',
    description:
      'A core anchor and competitive strength. You demonstrate mature, proven mastery and consistent execution in this dimension.',
  },
};

export function getScoreBand(score: number): ScoreBand {
  if (score <= 14) return SCORE_BANDS.critical;
  if (score <= 21) return SCORE_BANDS.emerging;
  if (score <= 28) return SCORE_BANDS.developing;
  return SCORE_BANDS.strong;
}

// Pillar-specific contextual diagnostic insights depending on score band
const PILLAR_INSIGHTS: Record<string, Record<string, string>> = {
  identity: {
    critical:
      'Your foundation reveals significant ambiguity regarding your personal non-negotiables, internal drivers, and blind spots. Without grounded self-awareness, subsequent strategic choices risk being driven by external expectations rather than internal conviction.',
    emerging:
      'You possess an intuitive sense of who you are, but you have not yet formalized your core values or objectively examined your cognitive blind spots. Codifying these insights will create an unshakeable base for decisions.',
    developing:
      'You have clear self-awareness and can identify your key strengths and motivations. Deepening your ability to operate steadily under external criticism or high-stakes pressure will solidify your personal leadership.',
    strong:
      'You possess profound, tested clarity of identity. Your choices align with your core values, your blind spots are managed with humility, and your sense of purpose remains uncompromised by outside noise.',
  },
  clarify: {
    critical:
      'Your priorities are currently fragmented or diluted across too many competing interests. A lack of firm filtering criteria makes it difficult to maintain sustained focus on what truly matters.',
    emerging:
      'You know what you care about in principle, but your daily calendar and commitments do not yet fully align with those priorities. Deliberately eliminating non-essential obligations is your immediate leverage point.',
    developing:
      'You maintain good directional focus and generally allocate your time toward strategic goals. Continuing to sharpen your decision filters will protect you from high-opportunity distractions.',
    strong:
      'You demonstrate exceptional clarity and ruthless prioritization. Your calendar reflects your conviction, and you have built the discipline to decline attractive opportunities that fall outside your primary mandate.',
  },
  crystallize: {
    critical:
      'Your envisioned future remains in the realm of vague aspiration. Without concrete 3-to-5 year milestones and measurable definitions of success, it will be impossible to formulate an actionable execution strategy.',
    emerging:
      'You have a general sense of where you want to go, but key details regarding tangible deliverables and horizons remain fuzzy. Translating your vision into written, verifiable outcomes will bridge idea and reality.',
    developing:
      'Your vision is well-formed with identifiable targets and timelines. Pushing further to clarify the specific systemic impact and value for beneficiaries will elevate it from a good plan to an inspiring movement.',
    strong:
      'Your vision is vivid, sharply articulated, and written down in meticulous detail. You have established tangible milestones that make your envisioned future feel both inevitable and measurable.',
  },
  articulate: {
    critical:
      'Others struggle to grasp the core essence, significance, or urgency of your vision. Miscommunication at this stage restricts your ability to rally supporters, partners, or essential resources.',
    emerging:
      'You can explain your ideas in conversation, but you often rely on technical jargon or extended explanations. Developing a concise, resonant two-minute narrative will drastically improve engagement.',
    developing:
      'You communicate your vision effectively to most listeners and handle common questions well. Tailoring your messaging with precision to diverse audiences (funders, partners, beneficiaries) will accelerate adoption.',
    strong:
      'You are a compelling, versatile champion for your vision. You articulate both purpose and urgency with clarity, easily winning conviction and enabling others to champion the narrative independently.',
  },
  architect: {
    critical:
      'You currently lack an operational blueprint to bridge your aspirations and real-world execution. Key dependencies, budgets, responsibilities, and risk contingencies have not been adequately engineered.',
    emerging:
      'You have outlined broad phases and plans, but operational realities such as specific resource allocations and failure contingency modes remain underdeveloped. Grounding the blueprint in operational mechanics is vital.',
    developing:
      'Your strategic roadmap is logical, resource-mapped, and supported by realistic timelines. Regularly stress-testing your operating model against market friction will enhance execution agility.',
    strong:
      'You have designed an elegant, robust architecture for execution. Roles, workflows, resources, risk mitigations, and key performance indicators are methodically integrated and resilient.',
  },
  launch: {
    critical:
      'You remain in prolonged preparation or planning mode. No substantive, real-world deliverable has been activated or delivered to actual users or beneficiaries.',
    emerging:
      'You have taken preliminary preparatory steps and announced intent, but operational activation is nascent. Moving immediately to deliver your first tangible deliverable will cross the threshold into reality.',
    developing:
      'You have crossed the starting line and initiated operations or delivered initial outputs. Establishing tighter feedback loops and systematically reviewing initial performance will solidify the launch.',
    strong:
      'You have successfully executed a validated launch. Real-world operations are active, initial deliverables have reached their target audience, and active feedback mechanisms are informing your next iterations.',
  },
  build: {
    critical:
      'Execution is ad-hoc, inconsistent, or excessively dependent on heroics. Without reliable workflows and operational habits, quality and delivery will remain erratic.',
    emerging:
      'You have achieved individual operational successes, but reliable systems and dependable processes have not yet solidified. Documenting standard workflows will transform sporadic wins into consistent performance.',
    developing:
      'You have stable, repeatable operations and healthy stakeholder relationships. Focusing on continuous optimization and financial/resource stability will prepare you for sustainable scaling.',
    strong:
      'You operate with dependable consistency and operational excellence. Documented systems, competent collaborators, and disciplined review cycles produce dependable, high-quality outcomes every time.',
  },
  scale: {
    critical:
      'Attempting expansion right now would likely break your operations. The core model is not yet sufficiently proven or structured to handle increased volume or geographic replication.',
    emerging:
      'You see opportunities to reach more people, but key bottlenecks in infrastructure, distribution, or team onboarding create friction. Standardizing your operational playbook is required before accelerating growth.',
    developing:
      'You have begun expanding your reach and validated your ability to replicate results. Monitoring unit economics and margin capacity will ensure your growth is healthy, sustainable, and value-accretive.',
    strong:
      'You have built a high-leverage growth engine. Your infrastructure readily absorbs expansion, training frameworks onboard contributors rapidly, and your reach is compounding consistently.',
  },
  lead: {
    critical:
      'The undertaking is completely centralized around your personal presence and effort. If you were absent, operations and decision-making would grind to a halt, creating catastrophic fragility.',
    emerging:
      'You recognize the need to delegate, but you still hold tightly to critical decisions and execution details. Actively mentoring trusted lieutenants and distributing authority is your primary leadership task.',
    developing:
      'You have developed capable leaders and successfully decentralized several functions. Codifying institutional culture, governance rules, and succession pathways will secure long-term continuity.',
    strong:
      'You practice generative, enduring leadership. Authority is decentralized, leaders are continuously nurtured, and institutional memory and culture ensure the mission thrives far beyond your direct involvement.',
  },
};

// Strategic recommendations considering framework dependencies
const PILLAR_ACTION_RECOMMENDATIONS: Record<
  string,
  { whyItMatters: string; focusArea: string; practicalAction: string }
> = {
  identity: {
    whyItMatters:
      'Unresolved identity compromises every downstream decision. A vision that does not stem from authentic conviction inevitably collapses under external pressure.',
    focusArea: 'Personal non-negotiables, core values, and blind spot awareness.',
    practicalAction:
      'Conduct a dedicated Personal Operating Audit: document your 5 core non-negotiable values, solicit blind-spot feedback from 3 trusted mentors, and write down the boundaries of what you will never compromise.',
  },
  clarify: {
    whyItMatters:
      'Vision without ruthless prioritization produces exhaustion rather than progress. Energy dispersed in all directions advances nowhere.',
    focusArea: 'Opportunity filtering and daily calendar realignment.',
    practicalAction:
      'Perform a two-week Commitment Audit: identify 3 ongoing commitments that dilute your primary vision, initiate deliberate exits from them, and block 15 hours weekly strictly dedicated to your core mandate.',
  },
  crystallize: {
    whyItMatters:
      'If you cannot describe the destination with tangible precision, neither you nor your team can determine the correct path to reach it.',
    focusArea: '3-year milestone mapping and measurable definition of success.',
    practicalAction:
      'Draft a one-page "Future State Blueprint": specify exact quantitative outcomes, user testimonials, and operational realities you expect to exist exactly 36 months from today.',
  },
  articulate: {
    whyItMatters:
      'A vision only moves as fast as it can be shared and understood. The quality of your articulation dictates your ability to attract top talent and capital.',
    focusArea: 'Two-minute core narrative and audience-specific messaging.',
    practicalAction:
      'Write a 150-word narrative addressing the Problem, the Urgency, the Solution, and the Desired Future. Rehearse until you can deliver it clearly and passionately in 90 seconds without notes.',
  },
  architect: {
    whyItMatters:
      'Passion without structure produces chaos. A solid architecture converts abstract desire into predictable operational execution.',
    focusArea: 'Operating model, resource allocation, and risk contingencies.',
    practicalAction:
      'Map your entire undertaking into a 4-phase execution roadmap: assign explicit milestones, key resource requirements, and risk mitigation triggers for the next 180 days.',
  },
  launch: {
    whyItMatters:
      'Planning only produces theory; activation produces truth. Real-world feedback begins only after your work encounters the market.',
    focusArea: 'Commencing actual operations and delivering the first minimum viable deliverable.',
    practicalAction:
      'Set an immutable launch date within the next 21 days. Deliver one real service, product release, or pilot event to a minimum of 5 actual participants, and record their unfiltered feedback.',
  },
  build: {
    whyItMatters:
      'Sporadic heroism cannot sustain a vision. Only dependable systems, repeatable workflows, and consistent delivery build lasting trust.',
    focusArea: 'Standard operating procedures and operational consistency.',
    practicalAction:
      'Document Standard Operating Procedures (SOPs) for the three most critical daily/weekly processes in your undertaking so that any team member can execute them with identical excellence.',
  },
  scale: {
    whyItMatters:
      'Premature scaling destroys businesses, but stagnant capacity artificially limits your vision from touching all who could benefit.',
    focusArea: 'Replication mechanics, distribution channels, and unit economics.',
    practicalAction:
      'Identify the single biggest operational bottleneck preventing a 3x increase in capacity. Design and implement one systemic automation or partnership channel to eliminate that bottleneck.',
  },
  lead: {
    whyItMatters:
      'Success without a successor is ultimate failure. The ultimate test of visionary leadership is creating an enterprise that thrives without you.',
    focusArea: 'Decentralized authority, leadership development, and institutional governance.',
    practicalAction:
      'Select two rising leaders and delegate 100% of a critical operational domain to them with explicit authority limits. Transition your role from direct decision-maker to executive advisor.',
  },
};

// ==========================================
// JOURNEY STAGE PINPOINTING ALGORITHM
// Evaluates sequential dependency to identify where in the 9-stage journey the person stands
// ==========================================
export function diagnoseJourneyStage(
  pillarResults: Record<string, PillarResult>,
  participantName: string
): JourneyDiagnosis {
  let activePillarIndex = 0;
  let foundFrontier = false;

  // 1. Sequential search: Find first unsolidified pillar (score < 22, i.e. < 63%)
  for (let i = 0; i < PILLARS.length; i++) {
    const p = PILLARS[i];
    const score = pillarResults[p.id]?.score || 7;
    if (score < 22 && !foundFrontier) {
      activePillarIndex = i;
      foundFrontier = true;
    }
  }

  // 2. If all pillars are >= 22, pinpoint lowest among advanced pillars (6 to 9)
  if (!foundFrontier) {
    let minScore = 36;
    let minIdx = 8;
    for (let i = 5; i < PILLARS.length; i++) {
      const p = PILLARS[i];
      const score = pillarResults[p.id]?.score || 7;
      if (score < minScore) {
        minScore = score;
        minIdx = i;
      }
    }
    activePillarIndex = minIdx;
  }

  // 3. Dependency vulnerability override:
  // If foundational pillars (1 to 3: Identity, Clarify, Crystallize) are critical (<= 17),
  // they take precedence because downstream stages are operating on fragile ground!
  for (let i = 0; i < 3; i++) {
    const p = PILLARS[i];
    if ((pillarResults[p.id]?.score || 0) <= 17) {
      activePillarIndex = i;
      break;
    }
  }

  const activePillar = PILLARS[activePillarIndex];
  const stageStatuses: Record<string, StageProgressStatus> = {};
  const consolidatedStages: Pillar[] = [];
  const horizonStages: Pillar[] = [];

  PILLARS.forEach((p, idx) => {
    if (idx < activePillarIndex) {
      stageStatuses[p.id] = 'consolidated';
      consolidatedStages.push(p);
    } else if (idx === activePillarIndex) {
      stageStatuses[p.id] = 'current_frontier';
    } else {
      stageStatuses[p.id] = 'horizon';
      horizonStages.push(p);
    }
  });

  const STAGE_DIAGNOSTICS: Record<
    string,
    {
      headline: string;
      summary: string;
      whatYouHaveBuilt: string;
      currentBottleneck: string;
      unlockRequirement: string;
    }
  > = {
    identity: {
      headline: 'Stage 01: IDENTITY — Foundational Self-Discovery',
      summary: `${participantName}, your diagnostic journey indicates you are currently at the foundational starting point: discovering who you are, codifying your personal non-negotiables, and grounding your convictions before committing to an external vision.`,
      whatYouHaveBuilt: 'An initial awareness that you are called to a meaningful life pursuit.',
      currentBottleneck:
        'Unclear personal values, unexamined blind spots, or reliance on external expectations rather than authentic inner conviction.',
      unlockRequirement:
        'Documenting your 5 core non-negotiables and identifying the authentic personal strengths that give you an advantage.',
    },
    clarify: {
      headline: 'Stage 02: CLARIFY — Strategic Prioritization',
      summary: `${participantName}, you understand who you are, but you are currently standing at the Clarify threshold: determining what truly matters most and cutting away diluting commitments.`,
      whatYouHaveBuilt: 'A solid foundation of personal self-awareness and core identity.',
      currentBottleneck:
        'Effort dispersed in too many directions, lack of clear criteria for declining opportunities, and daily calendar misaligned with primary focus.',
      unlockRequirement:
        'Establishing ruthless decision filters to decline good distractions and protecting dedicated focus blocks for your true mandate.',
    },
    crystallize: {
      headline: 'Stage 03: CRYSTALLIZE — Future State Definition',
      summary: `${participantName}, you have identified your priorities, but you are currently at the Crystallize frontier: translating general aspirations into a vivid, measurable 3-to-5 year picture of the future you intend to create.`,
      whatYouHaveBuilt: 'Clear personal values and disciplined focus on what matters most.',
      currentBottleneck:
        'A vision that remains abstract or aspirational rather than defined by concrete milestones, tangible deliverables, and beneficiary outcomes.',
      unlockRequirement:
        'Documenting a detailed 36-month future blueprint specifying quantitative milestones and verifiable evidence of success.',
    },
    articulate: {
      headline: 'Stage 04: ARTICULATE — Visionary Communication',
      summary: `${participantName}, you have defined what you want to build, and you are now at the Articulate threshold: giving your vision a resonant voice so others can understand, share, and invest in it.`,
      whatYouHaveBuilt: 'A vivid, well-crystallized definition of the envisioned future.',
      currentBottleneck:
        'Communicating the vision with excessive complexity, struggling to pitch succinctly within 2 minutes, or failing to win conviction from partners.',
      unlockRequirement:
        'Mastering a crisp 90-second core narrative addressing the Problem, the Urgency, the Solution, and the Desired Future.',
    },
    architect: {
      headline: 'Stage 05: ARCHITECT — Strategic Engineering',
      summary: `${participantName}, you can communicate your vision effectively, and you are currently at the Architect frontier: designing the operational blueprint, resource allocations, workflows, and risk mitigations required for real-world execution.`,
      whatYouHaveBuilt: 'Compelling visionary narrative and ability to inspire supporters.',
      currentBottleneck:
        'Lacking a phased implementation roadmap, undefined roles and responsibilities, or unbudgeted resource dependencies.',
      unlockRequirement:
        'Mapping out a 4-phase execution plan with defined milestones, required infrastructure, and contingency triggers.',
    },
    launch: {
      headline: 'Stage 06: LAUNCH — Real-World Activation',
      summary: `${participantName}, you have designed the strategy, and your primary diagnostic position is the Launch threshold: crossing from planning into tangible real-world activation by initiating actual operations and delivering your first substantive output.`,
      whatYouHaveBuilt: 'Comprehensive strategic architecture, clear vision, and communication readiness.',
      currentBottleneck:
        'Prolonged planning mode, perfectionism, or mistaking administrative setup (registration, announcements) for actual operational commencement.',
      unlockRequirement:
        'Delivering your first real service, pilot product, or initiative output to live participants within an immutable 21-day timeline.',
    },
    build: {
      headline: 'Stage 07: BUILD — Operational Consistency & Systems',
      summary: `${participantName}, you have crossed the launch line and activated operations; your current journey stage is Build: establishing reliable processes, repeatable workflows, and consistent capacity so you produce dependable results every time.`,
      whatYouHaveBuilt: 'Demonstrated real-world activation with actual deliverables in the market.',
      currentBottleneck:
        'Inconsistent delivery quality, reliance on heroics or improvisation, and fragile financial/operational processes.',
      unlockRequirement:
        'Codifying Standard Operating Procedures (SOPs) for core workflows to ensure dependable quality without reinventing methods.',
    },
    scale: {
      headline: 'Stage 08: SCALE — Multiplier Reach & Replication',
      summary: `${participantName}, you have achieved consistent operational quality; you are now at the Scale threshold: expanding capacity, multiplying your reach, and replicating your proven model to serve a significantly larger audience.`,
      whatYouHaveBuilt: 'Proven operational consistency, dependable quality, and strong stakeholder relationships.',
      currentBottleneck:
        'Infrastructure bottlenecks, non-scalable distribution channels, or onboarding friction that restricts growth.',
      unlockRequirement:
        'Establishing scalable distribution partnerships and standardizing contributor onboarding to absorb 3x expansion smoothly.',
    },
    lead: {
      headline: 'Stage 09: LEAD — Enduring Legacy & Continuity',
      summary: `${participantName}, you have built and scaled a high-impact undertaking; you are at the pinnacle stage of the journey: Lead. Your primary focus is developing others, decentralizing authority, and building institutional structures that outlast your personal involvement.`,
      whatYouHaveBuilt: 'An expansive, proven, high-reach organization with demonstrated market success.',
      currentBottleneck:
        'Over-centralization of key decisions around yourself, lack of clear succession pathways, or vulnerability if you step away.',
      unlockRequirement:
        'Distributing executive authority to trusted rising leaders and establishing governance frameworks that protect the vision for generations.',
    },
  };

  const details = STAGE_DIAGNOSTICS[activePillar.id] || STAGE_DIAGNOSTICS['identity'];

  return {
    currentStage: activePillar,
    stageNumber: activePillar.number,
    headline: details.headline,
    summary: details.summary,
    consolidatedStages,
    activeFrontier: activePillar,
    horizonStages,
    stageStatuses,
    whatYouHaveBuilt: details.whatYouHaveBuilt,
    currentBottleneck: details.currentBottleneck,
    unlockRequirement: details.unlockRequirement,
  };
}

export function calculateAssessmentResults(
  participantName: string,
  responses: Record<string, ScoreValue>,
  startedAt: string
): AssessmentResult {
  const pillarResults: Record<string, PillarResult> = {};
  let totalScore = 0;

  PILLARS.forEach((pillar) => {
    const questions = getQuestionsByPillar(pillar.id);
    let pillarScore = 0;
    const answers: Record<number, number> = {};

    questions.forEach((q) => {
      const score = responses[q.id] || 1;
      pillarScore += score;
      answers[q.questionNumber] = score;
    });

    totalScore += pillarScore;
    const percentage = Math.round((pillarScore / 35) * 100 * 10) / 10;
    const band = getScoreBand(pillarScore);

    const bandKey =
      pillarScore <= 14
        ? 'critical'
        : pillarScore <= 21
        ? 'emerging'
        : pillarScore <= 28
        ? 'developing'
        : 'strong';

    const insight =
      PILLAR_INSIGHTS[pillar.id]?.[bandKey] ||
      `Demonstrated capability of ${percentage}% in ${pillar.name}.`;

    pillarResults[pillar.id] = {
      pillar,
      score: pillarScore,
      percentage,
      band,
      answers,
      insight,
    };
  });

  const overallPercentage = Math.round((totalScore / 315) * 100 * 10) / 10;
  const overallBand = getScoreBand(Math.round(totalScore / 9));

  // Sort pillars by score descending for strengths and ascending for gaps
  const sortedPillars = Object.values(pillarResults).sort(
    (a, b) => b.score - a.score || a.pillar.number - b.pillar.number
  );

  // Highest scoring pillars (Top 3)
  const strengths = sortedPillars.slice(0, 3);

  // Lowest scoring pillars (Bottom 3)
  const developmentGaps = [...sortedPillars].reverse().slice(0, 3);

  // Generate up to 3 prioritized development priorities.
  const priorityCandidates: PillarResult[] = [];
  
  // Check foundational pillars (1 to 5: Identity, Clarify, Crystallize, Articulate, Architect)
  const foundationalWeaknesses = PILLARS.slice(0, 5)
    .map((p) => pillarResults[p.id])
    .filter((res) => res.score <= 21);

  if (foundationalWeaknesses.length > 0) {
    foundationalWeaknesses.sort((a, b) => a.score - b.score);
    priorityCandidates.push(foundationalWeaknesses[0]);
    if (foundationalWeaknesses.length > 1) {
      priorityCandidates.push(foundationalWeaknesses[1]);
    }
  }

  const lowestOverall = [...sortedPillars].reverse();
  for (const item of lowestOverall) {
    if (priorityCandidates.length >= 3) break;
    if (!priorityCandidates.some((p) => p.pillar.id === item.pillar.id)) {
      priorityCandidates.push(item);
    }
  }

  const priorities: DevelopmentPriority[] = priorityCandidates.slice(0, 3).map((pr) => {
    const rec = PILLAR_ACTION_RECOMMENDATIONS[pr.pillar.id] || {
      whyItMatters: `Strengthening ${pr.pillar.name} reinforces the integrity of your overall journey.`,
      focusArea: `Key competencies and execution disciplines in ${pr.pillar.name}.`,
      practicalAction: `Design a 30-day focus sprint targeting ${pr.pillar.name} core behaviors.`,
    };

    return {
      pillar: pr.pillar,
      pillarScore: pr.score,
      whyItMatters: rec.whyItMatters,
      focusArea: rec.focusArea,
      practicalAction: rec.practicalAction,
    };
  });

  // Calculate the primary journey stage position
  const journeyDiagnosis = diagnoseJourneyStage(pillarResults, participantName);

  return {
    participantName,
    startedAt,
    completedAt: new Date().toISOString(),
    totalScore,
    overallPercentage,
    overallBand,
    pillarResults,
    strengths,
    developmentGaps,
    priorities,
    journeyDiagnosis,
  };
}
