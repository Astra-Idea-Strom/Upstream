---
name: retrieval-ranking
description: >-
  Rank and fuse retrieval candidates: BM25 scoring, dense cosine retrieval,
  Reciprocal Rank Fusion, score calibration, cut-off selection and cross-encoder
  reranking. Use when building or debugging a retriever, a tool/skill router, a
  search feature, or whenever results are "close but wrong", over-selected, or
  returning noise below the relevance floor.
---

# Retrieval Ranking: Hybrid Scoring, Fusion & Calibration

## 0. Activation Boundary
**Use for:** ranking, fusing, thresholding and evaluating candidate sets.
**Do not use for:** chunking strategy or prompt assembly (use `rag`), embedding
model selection (use `embeddings`), or SQL query tuning (use `postgresql`).

## 1. Pick the retriever by query shape
| Query shape | Best leg | Why |
| :--- | :--- | :--- |
| Identifiers, error codes, library names, rare tokens | **BM25 / lexical** | Exact tokens embeddings have never seen |
| Paraphrase, colloquial, no shared vocabulary | **Dense** | "make it work on phones" ↔ "responsive layout" |
| Both, i.e. real user traffic | **Hybrid + RRF** | Each leg covers the other's blind spot |

Never ship dense-only. Lexical recovers the exact-match cases that dense
silently misses, and it costs nothing at runtime.

## 2. BM25, correctly
```
score(q,d) = Σ_t idf(t) · f(t,d)·(k1+1) / ( f(t,d) + k1·(1 − b + b·|d|/avgdl) )
idf(t)     = ln(1 + (N − df(t) + 0.5)/(df(t) + 0.5))
k1 = 1.2   b = 0.75          # defaults; only tune with an eval set open
```
- Precompute `idf`, `tf` and `doc_len` at build time. Runtime does arithmetic only.
- Strip stopwords **before** indexing, or function words dominate short documents.
- Repeat high-value fields (name, aliases) in the indexed document to weight them
  without inventing a field-weighting scheme.

## 3. Fusion: RRF
```
RRF(d) = Σ_r  w_r / (k + rank_r(d))          k = 60
```
- Operates on **ranks**, so incompatible scales (BM25 12.4 vs cosine 0.85) fuse safely.
- k = 60 is the published default; the optimum is flat over [20, 100].
- Weighted RRF (`w_r`) is not canonical but is standard practice when one leg is
  known-stronger. Weight the leg you measured, not the leg you like.

## 4. The magnitude trap
RRF discards magnitude. With one active ranker, **every rank-1 result scores
1/(k+1)** whether it was a bullseye or a stray token hit. Therefore:

> Use fused ranks for **ordering**. Keep a separate raw-score signal for
> **thresholding**. Never threshold on an RRF score.

## 5. Choosing how many results to return
Three independent gates, all must pass:
1. **Absolute floor** — raw score below a measured noise level ⇒ drop. Sets the
   "return nothing" behaviour, which is a feature, not a failure.
2. **Relative floor** — `score < α · top_score` ⇒ drop (α ≈ 0.3–0.4).
3. **Elbow** — walk the ranked list, stop at the first large drop (>35–40 %).

A fixed top-k is an admission that you never calibrated. Fixed *minimums* are
worse: they guarantee a wrong answer on every query that needed zero results.

## 6. Reranking (second stage)
Retrieve 50–200 candidates with hybrid + RRF, then rerank the shortlist with a
cross-encoder that sees query and document together. Bi-encoders embed
independently and cannot model fine-grained interaction. Only add a reranker
after measuring: it costs latency on every query.

## 7. Anti-Patterns
- **Threshold on fused scores** — see §4.
- **Dense-only retrieval** — loses every identifier and rare-token query.
- **Tuning k1/b/k without an eval set** — you are moving numbers, not quality.
- **HyDE in precision-critical domains** — generated pseudo-documents fabricate
  plausible-but-wrong specifics and pull the query vector off target.
- **Padding to a minimum result count** — manufactured false positives.

## 8. Verification Check
- Do I threshold on a raw score rather than a fused rank?
- Does the system return zero results for an irrelevant query?
- Have I measured precision, recall and cost — not just eyeballed the top hit?
- Is every ranking constant traceable to a measurement or a cited default?
