---
name: rag
description: >-
  Retrieval-augmented generation pipelines: chunking strategies, vector search retrieval, context injection, and reranking. Use when grounding LLM responses in external documents, building semantic search workflows, or integrating vector context. Not for basic vector embeddings or standalone database indexing (that is embeddings or nosql).
---

# RAG: Semantic Chunking, Hybrid Retrieval & Grounded Synthesis

## 1. Core RAG Invariants

1. **Strict Context Grounding**: The generator must synthesize answers strictly from retrieved documents. If retrieved context lacks the necessary information, the model must explicitly state "The provided documents do not contain information to answer this question" rather than hallucinating.
2. **Chunk Size & Overlap Calibration**: Chunks must balance context retention against noise. Typical sweet spot: 500–1000 tokens with 10–15% overlap (50–150 tokens) to avoid boundary fragmentation.
3. **Hybrid Search Superiority**: Combine dense semantic vector search (for conceptual similarity) with sparse BM25 lexical search (for exact keywords, part numbers, and IDs) using Reciprocal Rank Fusion (RRF).
4. **Attribution with Direct Citations**: Every asserted claim must cite its source document chunk (`[Doc 2, Page 4]`).

---

## 2. Key Implementation Patterns

### A. Document Chunking with Overlap (Python)
```python
def recursive_chunk_text(text: str, chunk_size: int = 800, overlap: int = 100) -> list[str]:
    chunks = []
    start = 0
    text_len = len(text)

    while start < text_len:
        end = min(start + chunk_size, text_len)
        # Avoid splitting words in the middle
        if end < text_len:
            space_idx = text.rfind(" ", start, end)
            if space_idx != -1:
                end = space_idx

        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)

        # Advance with overlap
        start = max(start + 1, end - overlap)

    return chunks
```

### B. Reciprocal Rank Fusion (RRF) for Hybrid Retrieval
```python
def reciprocal_rank_fusion(
    bm25_results: list[str],
    vector_results: list[str],
    k: int = 60,
    top_n: int = 5
) -> list[str]:
    scores = {}

    for rank, doc_id in enumerate(bm25_results):
        scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (k + rank + 1)

    for rank, doc_id in enumerate(vector_results):
        scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (k + rank + 1)

    sorted_docs = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return [doc_id for doc_id, _ in sorted_docs[:top_n]]
```

### C. Grounded Synthesis Prompt Template
```markdown
<context>
[Doc 1 - ID: 104]
Our return window is 30 days from delivery for unused items in original packaging.

[Doc 2 - ID: 109]
Refunds are credited back to the original payment method within 5-7 business days.
</context>

<instructions>
Answer the question using ONLY the facts stated in <context>.
Cite sources using [Doc ID].
If the answer cannot be determined from the context, respond:
"I do not have sufficient information in the provided documentation to answer."
</instructions>

<question>
How long do I have to return an opened software license?
</question>
```

---

## 3. Anti-Patterns to Avoid

- **Gigantic Monolithic Chunks**: Passing 8,000-token chunks where the relevant sentence is drowned in irrelevant text ("needle in a haystack" degradation).
- **Pure Vector Search for IDs and Codes**: Using semantic embeddings to search for order numbers like `ORD-98421`, which fails because embeddings encode semantic meaning, not alphanumeric identifiers.
- **Synthesizing Without Mandatory Citations**: Letting the model answer without attributing claims to specific chunk IDs, making verification impossible.

---

## 4. Verification Checklist

- [ ] Chunking preserves sentence and paragraph boundaries with overlap.
- [ ] Retrieval incorporates hybrid search (BM25 + vector).
- [ ] Prompts enforce refusal when context is irrelevant.
- [ ] Output responses provide verifiable citations for each factual assertion.
