---
name: edtech-learning
description: >-
  Educational technology: spaced repetition (SM-2/FSRS), quiz generation, mastery learning rubrics, and retention tracking. Use when building learning platforms, calculating review intervals, generating educational quizzes, or tracking student mastery. Not for general personal finance or health applications (that is personal-finance or health-wellness-safety).
---

# EdTech & Learning: Spaced Repetition (SM-2), Adaptive Quizzes & Rubric Grading

## 1. Core Learning Science Invariants

1. **Empirically Proven Spaced Repetition (SM-2)**: Schedule memory reviews based on cognitive forgetting curves. Each successful recall increases the subsequent review interval exponentially; incorrect answers reset or shorten the interval.
2. **Adaptive Challenge Calibration (Zone of Proximal Development)**: Quizzes must adjust difficulty based on performance. Too easy causes boredom; too difficult causes abandonment. Target a 70–80% success rate.
3. **Pedagogical Alignment (Bloom's Taxonomy)**: Differentiate questions by cognitive depth: Remember -> Understand -> Apply -> Analyze -> Evaluate -> Create.
4. **Actionable Constructive Feedback**: Essay or project feedback must reference specific rubric criteria, explain *why* points were deducted, and offer concrete revision guidance.

---

## 2. Key Implementation Patterns

### A. The SuperMemo-2 (SM-2) Spaced Repetition Algorithm
```typescript
export interface SM2Card {
  repetitions: number; // Consecutive successful recalls
  interval: number;    // Days until next review
  easeFactor: number;  // Difficulty factor (min 1.3, default 2.5)
}

/**
 * Calculates next review interval based on user rating.
 * @param card Current card state
 * @param grade User grade: 0 (blackout) to 5 (perfect recall)
 */
export function calculateSM2(card: SM2Card, grade: number): SM2Card {
  if (grade < 0 || grade > 5) {
    throw new Error("Grade must be an integer between 0 and 5");
  }

  let { repetitions, interval, easeFactor } = card;

  if (grade >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions++;
  } else {
    // Failed recall: reset repetitions and schedule for immediate tomorrow
    repetitions = 0;
    interval = 1;
  }

  // Update Ease Factor (EF)
  easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  return { repetitions, interval, easeFactor };
}
```

### B. Rubric Evaluation Prompt Schema
```markdown
<role>
You are an expert pedagogical evaluator. Grade the student's submission against the rubric below.
</role>

<rubric>
Criteria 1: Thesis Clarity (Weight: 30%)
- Level 4: Clear, provocative, well-scoped thesis.
- Level 2: Vague or overbroad claim.
- Level 0: Missing thesis.

Criteria 2: Supporting Evidence (Weight: 40%)
Criteria 3: Coherence & Structure (Weight: 30%)
</rubric>

<student_submission>
{{submission_text}}
</student_submission>

<output_format>
Return valid JSON:
{
  "total_score": number,
  "criteria_breakdown": [
    { "name": string, "score": number, "max": number, "feedback": string }
  ],
  "strengths": [string],
  "actionable_improvements": [string]
}
</output_format>
```

---

## 3. Anti-Patterns to Avoid

- **Linear Review Intervals**: Reviewing flashcards every 2 days forever regardless of mastery, leading to review fatigue.
- **Punitive Feedback**: Presenting errors as permanent failures rather than iterative learning opportunities.
- **Multiple Choice with Obvious Distractors**: Offering quiz options where 3 choices are absurdly wrong, eliminating real cognitive recall.

---

## 4. Verification Checklist

- [ ] SM-2 algorithm correctly calculates intervals and enforces minimum ease factor (1.3).
- [ ] Streak calculation accounts for user local timezone boundaries.
- [ ] Quiz generators produce distractors of equivalent plausibility and length.
- [ ] Rubric feedback references specific rubric criteria with actionable suggestions.
