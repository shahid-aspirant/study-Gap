/**
 * StudyGap Diagnostic Engine
 * 
 * Algorithm:
 * 1. Calculate accuracy per primary concept.
 * 2. Map incorrect answers to their underlying foundational prerequisite tags.
 * 3. Detect dependency chain breaks (e.g., struggling with Loops because of Variables).
 * 4. Rank and identify the single most critical "Root-Cause Gap".
 * 5. Generate transparent, actionable diagnostic insights.
 */

function runStudyGapDiagnosis(userAnswers, questions) {
  const conceptStats = {};
  const prereqMisses = {};
  const questionResults = [];
  let totalCorrect = 0;

  // Step 1: Process each question
  questions.forEach((q, idx) => {
    const selected = userAnswers[idx];
    const isCorrect = selected === q.correctIndex;
    if (isCorrect) totalCorrect++;

    // Track primary concept stats
    if (!conceptStats[q.primaryConcept]) {
      conceptStats[q.primaryConcept] = { total: 0, correct: 0, prereqs: [] };
    }
    conceptStats[q.primaryConcept].total += 1;
    if (isCorrect) {
      conceptStats[q.primaryConcept].correct += 1;
    } else {
      // Track prerequisite tag when an answer is wrong
      prereqMisses[q.foundationalPrereq] = (prereqMisses[q.foundationalPrereq] || 0) + 1;
      conceptStats[q.primaryConcept].prereqs.push(q.foundationalPrereq);
    }

    questionResults.push({
      questionId: q.id,
      questionText: q.question,
      codeSnippet: q.codeSnippet,
      selectedChoice: selected !== undefined ? q.options[selected] : "Not answered",
      correctChoice: q.options[q.correctIndex],
      isCorrect,
      primaryConcept: q.primaryConcept,
      foundationalPrereq: q.foundationalPrereq,
      explanation: q.explanation,
      trapExplanation: q.trapExplanation
    });
  });

  const overallScorePercent = Math.round((totalCorrect / questions.length) * 100);

  // Step 2: Calculate mastery per concept
  const conceptMastery = Object.keys(conceptStats).map(concept => {
    const data = conceptStats[concept];
    const masteryPercent = Math.round((data.correct / data.total) * 100);
    return {
      concept,
      total: data.total,
      correct: data.correct,
      masteryPercent,
      isWeak: masteryPercent < 70
    };
  });

  // Step 3: Identify the primary Root-Cause Prerequisite Gap
  let primaryGapPrereq = null;
  let maxPrereqMissCount = 0;

  for (const [prereq, count] of Object.entries(prereqMisses)) {
    if (count > maxPrereqMissCount) {
      maxPrereqMissCount = count;
      primaryGapPrereq = prereq;
    }
  }

  // Fallback if 100% correct
  const isPerfect = totalCorrect === questions.length;

  let diagnosticSummary = "";
  let rootCauseData = null;

  if (isPerfect) {
    diagnosticSummary = "Outstanding! You demonstrated solid mastery across both foundational primitives and complex control flow.";
  } else {
    // If we have a detected gap, look up remediation
    rootCauseData = CONCEPT_REMEDIATION[primaryGapPrereq] || {
      conceptName: primaryGapPrereq || "Core Fundamentals",
      whyItMatters: "Building strong fundamentals prevents compounding errors in higher-level coding problems.",
      quickRule: "Trace each line of code slowly and note variable state on paper.",
      practiceQuestion: "Practice writing manual trace tables for variables."
    };

    // Find which higher-level topic this foundational gap impacted
    const impactedHigherConcepts = conceptMastery
      .filter(c => c.isWeak)
      .map(c => c.concept);

    if (impactedHigherConcepts.length > 0) {
      diagnosticSummary = `Your mistakes in **${impactedHigherConcepts.join(", ")}** show that the true stumbling block is **${rootCauseData.conceptName}**. Instead of endlessly practicing advanced problems, reviewing this prerequisite will unlock your progress.`;
    } else {
      diagnosticSummary = `You performed well overall, but tripped up on **${rootCauseData.conceptName}**. Reviewing this nuance will push your accuracy to 100%.`;
    }
  }

  return {
    totalQuestions: questions.length,
    totalCorrect,
    overallScorePercent,
    isPerfect,
    conceptMastery,
    primaryGapPrereq,
    rootCauseData,
    diagnosticSummary,
    questionResults
  };
}

if (typeof globalThis !== 'undefined') {
  globalThis.runStudyGapDiagnosis = runStudyGapDiagnosis;
}

