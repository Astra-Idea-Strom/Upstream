---
name: ai-evaluation
description: >-
  Model output evaluation, automated scoring rubrics, benchmark datasets, pairwise comparisons, and regression testing. Use when measuring LLM generation quality, evaluating prompt variations, testing AI model upgrades, or running offline eval suites. Not for live production telemetry or traces (that is monitoring or observability).
---

# AI Evaluation: Hallucination Detection, RAGAS Metrics & LLM Judges

## 1. Core AI Evaluation Invariants

1. **Empirical Benchmarks Over "Vibes"**: AI systems must be evaluated against a versioned golden dataset containing ground-truth question/context/answer triplets.
2. **The RAG Triad Metrics**:
   - **Faithfulness**: Is the answer factually grounded in the retrieved context? (Hallucination detector).
   - **Answer Relevance**: Does the generated answer directly answer the user's prompt without tangents?
   - **Context Recall**: Did the retrieval pipeline fetch all necessary information to answer the question?
3. **Calibrated LLM-as-a-Judge**: When using an LLM to grade outputs, provide a structured 1–5 scoring rubric with explicit grading criteria for each point level and force an explanation before the score.
4. **CI Regression Testing for Prompts**: System prompt changes must run against the golden evaluation set to ensure overall accuracy does not degrade.

---

## 2. Key Implementation Patterns

### A. LLM-as-a-Judge Evaluation Prompt Rubric
```markdown
<role>
You are an impartial evaluator assessing the factual faithfulness of an AI-generated answer based strictly on the provided context.
</role>

<input_data>
[Context]: {{context}}
[Question]: {{question}}
[Generated Answer]: {{answer}}
</input_data>

<rubric>
Score 1: The answer completely contradicts or hallucinates facts not present in the context.
Score 3: The answer contains mostly accurate claims but includes at least one ungrounded assumption.
Score 5: Every single claim in the answer is 100% directly substantiated by the context.
</rubric>

<output_format>
Output valid JSON matching:
{
  "reasoning": "Step-by-step verification of each sentence in the answer against context",
  "faithfulness_score": 1 | 2 | 3 | 4 | 5,
  "hallucinated_claims": ["claim 1", "claim 2"]
}
</output_format>
```

### B. Automated RAGAS-Style Evaluation Runner (Python)
```python
import json
from typing import TypedDict

class EvalResult(TypedDict):
    question: str
    faithfulness: float
    relevance: float
    passed: bool

def evaluate_rag_sample(question: str, context: str, answer: str) -> EvalResult:
    # 1. Run judge prompt for faithfulness
    faith_response = call_judge_model(FAITHFULNESS_PROMPT.format(
        question=question, context=context, answer=answer
    ))
    faith_score = json.loads(faith_response)["faithfulness_score"] / 5.0

    # 2. Run judge prompt for relevance
    rel_response = call_judge_model(RELEVANCE_PROMPT.format(
        question=question, answer=answer
    ))
    rel_score = json.loads(rel_response)["relevance_score"] / 5.0

    # Pass criteria: Faithfulness >= 0.8 and Relevance >= 0.8
    passed = faith_score >= 0.8 and rel_score >= 0.8

    return {
        "question": question,
        "faithfulness": faith_score,
        "relevance": rel_score,
        "passed": passed
    }
```

---

## 3. Anti-Patterns to Avoid

- **Eyeballing Model Outputs Manually**: Declaring a prompt "good" after testing 2 ad-hoc queries, only to have edge cases fail in production.
- **Unconstrained Free-Text Judges**: Asking an LLM judge "is this good?" without a structured rubric, leading to erratic and uncalibrated scores.
- **Evaluating Answer Without Context**: Grading factual accuracy without referencing the specific context provided to the model during generation.

---

## 4. Verification Checklist

- [ ] Golden evaluation set contains at least 30 representative test cases.
- [ ] Automated evaluation runs in CI or pre-merge pipeline.
- [ ] Evaluation metrics cover faithfulness, relevance, and context recall.
- [ ] Judge prompts output structured JSON with reasoning before the score.
