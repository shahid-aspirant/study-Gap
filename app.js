/**
 * StudyGap Application Controller
 */

// Application State
let currentQuestionIndex = 0;
let userAnswers = {};
let activeQuestions = JAVA_QUESTIONS;

// Screen Navigation
function showScreen(screenId) {
  const screens = ['landing-screen', 'subject-screen', 'quiz-screen', 'results-screen'];
  screens.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (id === screenId) {
        el.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        el.classList.add('hidden');
      }
    }
  });
}

// Start New Quiz
function startQuiz() {
  currentQuestionIndex = 0;
  userAnswers = {};
  activeQuestions = JAVA_QUESTIONS;
  showScreen('quiz-screen');
  renderCurrentQuestion();
}

// Render Question on Quiz Screen
function renderCurrentQuestion() {
  const q = activeQuestions[currentQuestionIndex];
  const total = activeQuestions.length;

  // Header badges
  document.getElementById('quiz-topic-badge').textContent = q.primaryConcept;
  document.getElementById('question-progress-text').textContent = `Question ${currentQuestionIndex + 1} of ${total}`;
  
  // Progress Bar
  const pct = Math.round(((currentQuestionIndex + 1) / total) * 100);
  document.getElementById('percentage-badge').textContent = `${pct}% Completed`;
  document.getElementById('progress-bar-fill').style.width = `${pct}%`;

  // Question Text
  document.getElementById('question-text').textContent = q.question;

  // Code Snippet
  const codeContainer = document.getElementById('code-snippet-container');
  const codePre = document.getElementById('code-snippet');
  if (q.codeSnippet && q.codeSnippet.trim().length > 0) {
    codePre.textContent = q.codeSnippet;
    codeContainer.classList.remove('hidden');
  } else {
    codeContainer.classList.add('hidden');
  }

  // Options
  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';

  const selectedAnswer = userAnswers[currentQuestionIndex];

  q.options.forEach((optText, optIdx) => {
    const isSelected = selectedAnswer === optIdx;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `w-full text-left p-4 rounded-xl border-2 transition-all flex items-start space-x-3 text-sm sm:text-base ${
      isSelected
        ? 'border-brand-600 bg-brand-50/70 text-brand-900 font-semibold shadow-sm'
        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
    }`;

    // Alphabet letter badge (A, B, C, D)
    const letter = String.fromCharCode(65 + optIdx);
    btn.innerHTML = `
      <span class="inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold ${
        isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
      }">${letter}</span>
      <span class="flex-1 mt-0.5">${escapeHtml(optText)}</span>
    `;

    btn.onclick = () => selectOption(optIdx);
    optionsContainer.appendChild(btn);
  });

  // Navigation Button states
  const prevBtn = document.getElementById('prev-btn');
  prevBtn.disabled = currentQuestionIndex === 0;

  const nextBtnText = document.getElementById('next-btn-text');
  if (currentQuestionIndex === total - 1) {
    nextBtnText.textContent = "Complete & Analyze Gaps";
  } else {
    nextBtnText.textContent = "Next Question";
  }
}

// Select an option for current question
function selectOption(optionIndex) {
  userAnswers[currentQuestionIndex] = optionIndex;
  renderCurrentQuestion();
}

// Go to Previous Question
function goToPrevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderCurrentQuestion();
  }
}

// Go to Next Question (or finish)
function goToNextQuestion() {
  if (userAnswers[currentQuestionIndex] === undefined) {
    alert("Please choose an answer to proceed.");
    return;
  }

  if (currentQuestionIndex < activeQuestions.length - 1) {
    currentQuestionIndex++;
    renderCurrentQuestion();
  } else {
    // Finish and run diagnosis
    finishAndAnalyze();
  }
}

// Complete Assessment and trigger diagnosis
function finishAndAnalyze() {
  const diagnosis = runStudyGapDiagnosis(userAnswers, activeQuestions);
  displayResults(diagnosis);
  showScreen('results-screen');
}

// Display Diagnostic Results on Results Screen
function displayResults(data) {
  // Score display
  document.getElementById('result-score-percent').textContent = `${data.overallScorePercent}%`;
  document.getElementById('result-score-fraction').textContent = `${data.totalCorrect} / ${data.totalQuestions} Correct`;

  // 1. GAP ALERT HERO CARD
  const gapCard = document.getElementById('gap-alert-card');
  if (data.isPerfect) {
    gapCard.className = "rounded-2xl p-6 sm:p-7 border-2 border-emerald-300 bg-emerald-50/70 shadow-sm";
    gapCard.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="p-2 rounded-xl bg-emerald-100 text-emerald-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        </div>
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-800">No Foundational Gaps Detected</span>
          <h3 class="text-xl font-extrabold text-emerald-950 mt-1">Excellent Foundation!</h3>
          <p class="text-sm text-emerald-800 mt-2 leading-relaxed">${data.diagnosticSummary}</p>
        </div>
      </div>
    `;
  } else {
    gapCard.className = "rounded-2xl p-6 sm:p-7 border-2 border-rose-300 bg-gradient-to-br from-rose-50 to-amber-50 shadow-md";
    gapCard.innerHTML = `
      <div class="flex items-start space-x-3.5">
        <div class="p-2.5 rounded-xl bg-rose-100 text-rose-700 flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <div class="space-y-2">
          <div class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wide">
            <span>Primary Root-Cause Gap Identified</span>
          </div>
          <h3 class="text-xl sm:text-2xl font-black text-slate-900">
            ${data.rootCauseData.conceptName}
          </h3>
          <p class="text-sm text-slate-700 leading-relaxed font-normal">
            ${data.diagnosticSummary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
          </p>
          
          <div class="pt-2 flex flex-wrap items-center gap-2 text-xs font-medium">
            <span class="bg-white/80 border border-slate-300 px-3 py-1 rounded-lg text-slate-700">
              Foundational Root Tag: <strong>${data.primaryGapPrereq}</strong>
            </span>
            <span class="bg-rose-100/80 border border-rose-200 px-3 py-1 rounded-lg text-rose-800">
              Target Priority: High
            </span>
          </div>
        </div>
      </div>
    `;
  }

  // 2. TARGETED REMEDIATION CARD
  const remediationCard = document.getElementById('remediation-card');
  if (data.isPerfect) {
    remediationCard.innerHTML = `
      <h3 class="text-lg font-bold text-slate-900">Recommended Next Steps</h3>
      <p class="text-sm text-slate-600">You are ready to advance to Object-Oriented Programming (Inheritance, Polymorphism) and Data Structures (LinkedLists, HashMaps).</p>
    `;
  } else {
    remediationCard.innerHTML = `
      <div class="border-b border-slate-100 pb-3">
        <span class="text-xs font-bold uppercase tracking-wider text-brand-600">Actionable Remediation</span>
        <h3 class="text-lg font-extrabold text-slate-900 mt-0.5">How to Fix This Gap Right Now</h3>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Why It Matters</span>
          <p class="text-sm text-slate-700 leading-relaxed">${data.rootCauseData.whyItMatters}</p>
        </div>
        
        <div class="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 space-y-1.5">
          <span class="text-xs font-bold text-brand-600 uppercase tracking-wider">Quick Mental Rule</span>
          <p class="text-sm text-slate-800 font-medium leading-relaxed font-mono text-xs sm:text-sm">${data.rootCauseData.quickRule}</p>
        </div>
      </div>

      <div class="mt-4 p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2">
        <span class="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center">
          <span class="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
          Instant Micro-Practice Drill
        </span>
        <p class="text-sm text-amber-950 font-medium">${data.rootCauseData.practiceQuestion}</p>
      </div>
    `;
  }

  // 3. CONCEPT MASTERY BREAKDOWN
  const breakdownList = document.getElementById('concept-breakdown-list');
  breakdownList.innerHTML = '';
  data.conceptMastery.forEach(item => {
    const isWeak = item.masteryPercent < 70;
    const colorClass = isWeak ? 'bg-rose-500' : 'bg-emerald-500';
    const badgeColor = isWeak ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800';
    const statusText = isWeak ? 'Needs Review' : 'Solid';

    const row = document.createElement('div');
    row.className = 'space-y-1.5';
    row.innerHTML = `
      <div class="flex items-center justify-between text-xs sm:text-sm font-semibold">
        <div class="flex items-center space-x-2">
          <span class="text-slate-800">${escapeHtml(item.concept)}</span>
          <span class="px-2 py-0.5 rounded-full text-xs font-bold ${badgeColor}">${statusText}</span>
        </div>
        <span class="text-slate-500">${item.correct} / ${item.total} (${item.masteryPercent}%)</span>
      </div>
      <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div class="${colorClass} h-2 rounded-full" style="width: ${item.masteryPercent}%;"></div>
      </div>
    `;
    breakdownList.appendChild(row);
  });

  // 4. QUESTION AUDIT BREAKDOWN
  const auditList = document.getElementById('questions-audit-list');
  auditList.innerHTML = '';
  data.questionResults.forEach((qRes, i) => {
    const isRight = qRes.isCorrect;
    const item = document.createElement('div');
    item.className = `p-4 rounded-xl border text-xs sm:text-sm transition-all ${
      isRight ? 'border-slate-200 bg-white' : 'border-rose-200 bg-rose-50/40'
    }`;

    item.innerHTML = `
      <div class="flex items-start justify-between gap-3">
        <div class="space-y-1 flex-1">
          <div class="flex items-center space-x-2 font-mono text-xs">
            <span class="font-bold text-slate-500">Q${i + 1}</span>
            <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700">${escapeHtml(qRes.primaryConcept)}</span>
            ${!isRight ? `<span class="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-sans">Prereq: ${escapeHtml(qRes.foundationalPrereq)}</span>` : ''}
          </div>
          <p class="font-semibold text-slate-900">${escapeHtml(qRes.questionText)}</p>
          
          <div class="pt-2 text-xs space-y-1">
            <p><span class="text-slate-500">Your Answer:</span> <span class="${isRight ? 'text-emerald-700 font-bold' : 'text-rose-700 font-semibold'}">${escapeHtml(qRes.selectedChoice)}</span></p>
            ${!isRight ? `<p><span class="text-slate-500">Correct Answer:</span> <span class="text-emerald-700 font-bold">${escapeHtml(qRes.correctChoice)}</span></p>` : ''}
          </div>

          <div class="mt-3 p-3 rounded-lg bg-slate-100/80 text-slate-700 text-xs leading-relaxed">
            <p class="font-semibold text-slate-800 mb-0.5">Explanation:</p>
            <p>${escapeHtml(qRes.explanation)}</p>
            ${!isRight && qRes.trapExplanation ? `
              <p class="mt-2 text-rose-900 bg-rose-100/70 p-2 rounded border border-rose-200">
                <strong>Why you tripped:</strong> ${escapeHtml(qRes.trapExplanation)}
              </p>
            ` : ''}
          </div>
        </div>
        <div class="flex-shrink-0">
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
            isRight ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }">
            ${isRight ? '✓ Correct' : '✕ Missed'}
          </span>
        </div>
      </div>
    `;
    auditList.appendChild(item);
  });
}

// 1-Click Judge Demo Mode:
// Sets up the exact convincing scenario:
// Student scores 50%, missing questions tied to "Variables & State Tracking" / "Memory & Data Types",
// proving that their loop failures are caused by foundational variables knowledge.
function runOneClickJudgeDemo() {
  activeQuestions = JAVA_QUESTIONS;
  userAnswers = {
    0: 0, // Q1 (Variables & Data Types: 5/2) -> User chooses "2.5" (Missed: Memory & Data Types)
    1: 2, // Q2 (Scope) -> Correct
    2: 1, // Q3 (Operators) -> Correct
    3: 1, // Q4 (Conditionals) -> Correct
    4: 0, // Q5 (Loops: for i+=2) -> User chooses "2 times" (Missed: Variables & State Tracking)
    5: 2, // Q6 (Loops: accumulator) -> User chooses "8" (Missed: Variables & State Tracking)
    6: 2, // Q7 (Arrays) -> Correct
    7: 1  // Q8 (Methods) -> Correct
  };

  const diagnosis = runStudyGapDiagnosis(userAnswers, activeQuestions);
  displayResults(diagnosis);
  showScreen('results-screen');
}

// Utility: HTML escaping
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Initialization on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  showScreen('landing-screen');
});
