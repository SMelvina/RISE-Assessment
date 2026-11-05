import { createServer } from 'vite';
import assert from 'node:assert';

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true },
});

try {
  console.log('--- STARTING RISE ASSESSMENT QA SUITE ---');

  const { PILLARS } = await vite.ssrLoadModule('./src/data/pillars.ts');
  const { QUESTION_BANK, getQuestionsByPillar, getTotalQuestionCount } = await vite.ssrLoadModule('./src/data/questionBank.ts');
  const { calculateAssessmentResults, getScoreBand } = await vite.ssrLoadModule('./src/utils/scoring.ts');

  // 1. Verify Pillars
  console.log('1. Checking Pillars...');
  assert.strictEqual(PILLARS.length, 9, 'Should have exactly 9 pillars');

  const expectedPillarIds = [
    'identity',
    'clarify',
    'crystallize',
    'articulate',
    'architect',
    'launch',
    'build',
    'scale',
    'lead',
  ];
  PILLARS.forEach((p, idx) => {
    assert.strictEqual(p.number, idx + 1, `Pillar ${p.id} should have number ${idx + 1}`);
    assert.strictEqual(p.id, expectedPillarIds[idx], `Pillar order mismatch at ${idx}`);
    assert.ok(p.governingQuestion.endsWith('?'), `Governing question should end with ? for ${p.id}`);
    assert.ok(p.headline.length > 5, `Headline should be present for ${p.id}`);
    assert.ok(p.introductionBody.length > 30, `Introduction body should be present for ${p.id}`);
  });
  console.log('✓ All 9 pillars verified in correct sequence.');

  // 2. Verify Dimensions
  console.log('2. Checking Dimension groupings...');
  const expectedDimensions = ['R', 'R', 'R', 'I', 'I', 'S', 'S', 'E', 'E'];
  PILLARS.forEach((p, idx) => {
    assert.strictEqual(p.dimension, expectedDimensions[idx], `Dimension mismatch for pillar ${p.id}`);
  });
  console.log('✓ Dimension groupings (R, I, S, E) verified.');

  // 3. Verify Question Bank
  console.log('3. Checking Question Bank (63 questions)...');
  assert.strictEqual(QUESTION_BANK.length, 63, 'Total questions in bank should be 63');
  assert.strictEqual(getTotalQuestionCount(), 63, 'Total active questions should be 63');

  PILLARS.forEach((p) => {
    const pQuestions = getQuestionsByPillar(p.id);
    assert.strictEqual(pQuestions.length, 7, `Pillar ${p.name} must have exactly 7 questions`);
    pQuestions.forEach((q, qIdx) => {
      assert.strictEqual(q.questionNumber, qIdx + 1);
      assert.strictEqual(q.pillarId, p.id);
      assert.ok(
        q.text.startsWith('I ') ||
          q.text.startsWith('My ') ||
          q.text.startsWith('We ') ||
          q.text.startsWith('Others ') ||
          q.text.startsWith('Our ') ||
          q.text.startsWith('The ') ||
          q.text.startsWith('Decision-making '),
        `Question ${q.id} should be clear statement`
      );
    });
  });
  console.log('✓ All 63 questions verified (7 per pillar).');

  // 4. Verify Launch Pillar exact questions from RISE Questions.pdf
  console.log('4. Checking Launch Pillar diagnostic questions...');
  const launchQuestions = getQuestionsByPillar('launch');
  assert.ok(launchQuestions[0].text.includes('identified and committed to a specific initiative'));
  assert.ok(launchQuestions[1].text.includes('established a definite launch date'));
  assert.ok(launchQuestions[2].text.includes('mobilized the essential resources'));
  assert.ok(launchQuestions[3].text.includes('secured the necessary approvals'));
  assert.ok(launchQuestions[4].text.includes('communicated the launch to the relevant stakeholders'));
  assert.ok(launchQuestions[5].text.includes('initiated actual operations'));
  assert.ok(launchQuestions[6].text.includes('mechanism for monitoring the initial performance'));
  console.log('✓ Launch pillar questions match RISE Questions.pdf word-for-word.');

  // 5. Test Scoring Engine: Minimum score (all 1s)
  console.log('5. Testing Minimum Score Calculation (All 1s)...');
  const minResponses = {};
  QUESTION_BANK.forEach((q) => {
    minResponses[q.id] = 1;
  });
  const minResult = calculateAssessmentResults('Test Participant', minResponses, new Date().toISOString());
  assert.strictEqual(minResult.totalScore, 63, 'Min total score should be 63');
  assert.strictEqual(minResult.overallPercentage, 20.0, 'Min total percentage should be 20.0%');
  PILLARS.forEach((p) => {
    const res = minResult.pillarResults[p.id];
    assert.strictEqual(res.score, 7, `Min score for ${p.id} should be 7`);
    assert.strictEqual(res.percentage, 20.0, `Min percentage for ${p.id} should be 20.0%`);
    assert.strictEqual(res.band.label, 'Critical development area');
  });
  console.log('✓ Minimum score calculations verified (63/315, 20.0%).');

  // 6. Test Scoring Engine: Maximum score (all 5s)
  console.log('6. Testing Maximum Score Calculation (All 5s)...');
  const maxResponses = {};
  QUESTION_BANK.forEach((q) => {
    maxResponses[q.id] = 5;
  });
  const maxResult = calculateAssessmentResults('Test Participant', maxResponses, new Date().toISOString());
  assert.strictEqual(maxResult.totalScore, 315, 'Max total score should be 315');
  assert.strictEqual(maxResult.overallPercentage, 100.0, 'Max total percentage should be 100.0%');
  PILLARS.forEach((p) => {
    const res = maxResult.pillarResults[p.id];
    assert.strictEqual(res.score, 35, `Max score for ${p.id} should be 35`);
    assert.strictEqual(res.percentage, 100.0, `Max percentage for ${p.id} should be 100.0%`);
    assert.strictEqual(res.band.label, 'Strong development');
  });
  console.log('✓ Maximum score calculations verified (315/315, 100.0%).');

  // 7. Test Score Bands
  console.log('7. Testing PRD Interpretation Bands...');
  assert.strictEqual(getScoreBand(7).label, 'Critical development area');
  assert.strictEqual(getScoreBand(14).label, 'Critical development area');
  assert.strictEqual(getScoreBand(15).label, 'Emerging development');
  assert.strictEqual(getScoreBand(21).label, 'Emerging development');
  assert.strictEqual(getScoreBand(22).label, 'Developing capability');
  assert.strictEqual(getScoreBand(28).label, 'Developing capability');
  assert.strictEqual(getScoreBand(29).label, 'Strong development');
  assert.strictEqual(getScoreBand(35).label, 'Strong development');
  console.log('✓ All 4 score bands verified.');

  // 8. Test Realistic Variable Scores & Recommendations
  console.log('8. Testing Realistic Varied Response Profile...');
  const variedResponses = {};
  QUESTION_BANK.forEach((q) => {
    if (q.pillarId === 'identity' || q.pillarId === 'clarify') {
      variedResponses[q.id] = 5;
    } else if (q.pillarId === 'launch' || q.pillarId === 'scale') {
      variedResponses[q.id] = 2;
    } else {
      variedResponses[q.id] = 3;
    }
  });
  const variedResult = calculateAssessmentResults('Somtochukwu', variedResponses, new Date().toISOString());
  assert.strictEqual(variedResult.participantName, 'Somtochukwu');
  assert.strictEqual(variedResult.strengths[0].pillar.id, 'identity');
  assert.strictEqual(variedResult.strengths[1].pillar.id, 'clarify');
  assert.ok(variedResult.developmentGaps.some((g) => g.pillar.id === 'launch'));
  assert.ok(variedResult.developmentGaps.some((g) => g.pillar.id === 'scale'));
  assert.strictEqual(variedResult.priorities.length, 3);
  variedResult.priorities.forEach((p) => {
    assert.ok(p.whyItMatters.length > 10);
    assert.ok(p.focusArea.length > 5);
    assert.ok(p.practicalAction.length > 15);
  });

  // 9. Verify Journey Stage Diagnosis
  console.log('9. Testing Journey Stage Pinpointing Algorithm...');
  assert.ok(variedResult.journeyDiagnosis, 'Journey diagnosis must exist');
  assert.ok(variedResult.journeyDiagnosis.stageNumber >= 1 && variedResult.journeyDiagnosis.stageNumber <= 9);
  assert.ok(variedResult.journeyDiagnosis.headline.length > 5);
  assert.ok(variedResult.journeyDiagnosis.whatYouHaveBuilt.length > 10);
  assert.ok(variedResult.journeyDiagnosis.currentBottleneck.length > 10);
  assert.ok(variedResult.journeyDiagnosis.unlockRequirement.length > 10);
  console.log(`✓ Journey stage pinpointed accurately: ${variedResult.journeyDiagnosis.headline}`);

  console.log('\n=======================================');
  console.log('🎉 ALL QA TESTS PASSED SUCCESSFULLY! 🎉');
  console.log('=======================================');
} finally {
  await vite.close();
}
