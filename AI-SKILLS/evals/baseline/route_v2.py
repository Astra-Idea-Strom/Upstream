#!/usr/bin/env python3
"""
Intelligent Skill Router & Progressive Disclosure CLI
Selects the minimum sufficient set of skills (2-8) for a user request
using skills-manifest.json (lightweight) or skills-index.json.
Enforces priority arbitration (critical > high > normal), category specificity,
and strict dependency retention with zero generic keyword noise.
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path

# Auto-detect AI-SKILLS root directory
script_dir = Path(__file__).resolve().parent
search_candidates = [
    script_dir.parent.parent,          # evals/baseline/ -> AI-SKILLS/
    script_dir.parent,                 # tools/ -> AI-SKILLS/
    script_dir,                        # AI-SKILLS/
    Path.cwd() / "AI-SKILLS",          # from workspace root
    Path.cwd(),                        # inside AI-SKILLS/
]
ROOT_DIR = script_dir.parent.parent
for candidate in search_candidates:
    if (candidate / "skills-index.json").is_file():
        ROOT_DIR = candidate
        break

MANIFEST_FILE = ROOT_DIR / "skills-manifest.json"
INDEX_FILE = ROOT_DIR / "skills-index.json"

CATEGORY_SPECIFICITY = {
    "domains": 10,
    "security": 10,
    "backend": 9,
    "frontend": 9,
    "data": 8,
    "ai": 8,
    "devops": 8,
    "testing": 8,
    "core": 4,
    "tools": 3,
}

PRIORITY_WEIGHT = {
    "critical": 15,
    "high": 8,
    "normal": 0,
}

STOPWORDS = frozenset({
    "a", "an", "the", "this", "that", "these", "those", "there", "here",
    "is", "are", "was", "were", "be", "been", "being", "am",
    "to", "for", "in", "on", "at", "of", "with", "by", "from", "into",
    "about", "as", "out", "up", "over", "and", "or", "but", "if", "then",
    "than", "so", "not", "no", "do", "does", "did", "done",
    "can", "could", "should", "would", "will", "shall", "may", "might", "must",
    "i", "we", "you", "me", "us", "my", "our", "your", "their", "its", "it",
    "what", "how", "when", "which", "who", "why", "whose",
    "please", "help", "need", "needs", "want", "wants", "make", "makes",
    "get", "gets", "let", "some", "any", "all", "more", "most", "very",
    "have", "has", "had", "just", "like", "also", "too", "now",
})

MIN_TRIGGER_OVERLAP = 2
MIN_MATCH_SCORE = 5

INTENT_PATTERNS = [
    (
        r"(make.*look (better|nicer|cleaner|prettier|modern|good)|make.*professional|"
        r"ugly|improve design|modernize|looks? (bad|dated|cheap|off)|"
        r"polish the (ui|design|look))",
        ["human-ui-design", "visual-design", "web-design", "advanced-css"],
    ),
    (
        r"\b(add login|auth|signup|sign in|user accounts|session)\b",
        ["authentication", "authorization", "api-security", "database"],
    ),
    (
        r"\b(make.*work on mobile|mobile friendly|responsive|screen sizes|phone layout)\b",
        ["responsive-design", "ui-ux", "advanced-css", "frontend-engineering"],
    ),
    (
        r"\b(this isn'?t working|fix it|broken|bug|crash|error in|fix this)\b",
        ["debugging", "unit-testing", "code-review"],
    ),
    (
        r"\b(add.*security|make.*secure|harden|vulnerability|safe)\b",
        ["owasp", "secure-coding", "api-security"],
    ),
    (
        r"\b(write.*test first|tdd|red green refactor)\b",
        ["tdd-workflow", "unit-testing"],
    ),
    (
        r"\b(retry logic|circuit breaker|error boundary|handle error)\b",
        ["error-handling", "unit-testing"],
    ),
    (
        r"\b(review pr|pr review|merge gate|block merge)\b",
        ["security-review", "code-review"],
    ),
]


def load_registry() -> tuple[list[dict], str]:
    """Loads manifest if available, falling back to full index."""
    if MANIFEST_FILE.is_file():
        with open(MANIFEST_FILE, "r", encoding="utf-8") as f:
            return json.load(f)["skills"], "manifest"
    elif INDEX_FILE.is_file():
        with open(INDEX_FILE, "r", encoding="utf-8") as f:
            return json.load(f)["skills"], "index"
    raise FileNotFoundError(f"Neither {MANIFEST_FILE} nor {INDEX_FILE} found.")


def generate_manifest() -> int:
    """Generates skills-manifest.json from skills-index.json."""
    if not INDEX_FILE.is_file():
        print(f"Error: {INDEX_FILE} does not exist.", file=sys.stderr)
        return 1

    with open(INDEX_FILE, "r", encoding="utf-8") as f:
        full_index = json.load(f)

    manifest_skills = []
    for s in full_index.get("skills", []):
        manifest_skills.append({
            "name": s["name"],
            "category": s["category"],
            "path": s["path"],
            "description": s["description"],
            "triggers": s.get("triggers", []),
            "capabilities": s.get("capabilities", []),
            "requires": s.get("requires", []),
            "complements": s.get("complements", []),
            "priority": s.get("priority", "normal"),
            "security_sensitive": s.get("security_sensitive", False),
        })

    manifest = {
        "version": full_index.get("version", "2.0.0"),
        "total_skills": len(manifest_skills),
        "description": "Lightweight runtime manifest for progressive skill disclosure.",
        "skills": manifest_skills,
    }

    with open(MANIFEST_FILE, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    size_kb = MANIFEST_FILE.stat().st_size / 1024
    print(f"[OK] Generated {MANIFEST_FILE} ({len(manifest_skills)} skills, {size_kb:.1f} KB)")
    return 0


def route_skills(
    query: str,
    max_skills: int = 8,
    min_skills: int = 2,
    registry: list[dict] | None = None,
) -> dict:
    """
    Two-stage progressive routing with priority arbitration.
    Returns structured routing decision with leading skill and supporting skills.
    """
    if registry is None:
        registry, _ = load_registry()

    skills_by_name = {s["name"]: s for s in registry}
    normalized = query.lower()
    scores = {s["name"]: 0 for s in registry}

    # 1. Colloquial Intent Matching (Primary target receives full boost; supporting receive secondary)
    for pattern, boost_skills in INTENT_PATTERNS:
        if re.search(pattern, normalized):
            for rank_idx, b in enumerate(boost_skills):
                if b in scores:
                    scores[b] += 18 if rank_idx == 0 else 10

    # 2. Token, Trigger & Capability Matching
    tokens = set(re.findall(r"[a-z0-9\-/.]+", normalized))
    stemmed_tokens = {t.rstrip("s") for t in tokens}
    content_tokens = tokens - STOPWORDS

    for s in registry:
        name = s["name"]
        # Trigger matches
        for trigger in s.get("triggers", []):
            trigger_lower = trigger.lower()

            # Exact phrase containment stays the strongest signal (beats +18 intent boost)
            if trigger_lower in normalized:
                scores[name] += 20
                continue

            # Content-bearing terms only: stopwords never earn points.
            trigger_terms = {
                t.rstrip("s")
                for t in re.findall(r"[a-z0-9\-/.]+", trigger_lower)
                if t not in STOPWORDS
            }
            if not trigger_terms:
                continue

            overlap = trigger_terms & stemmed_tokens
            if not overlap:
                continue

            # Single-term triggers ("react", "jsx", "s3") are inherently
            # specific, so one hit is a real match. Multi-term phrases must
            # overlap on at least MIN_TRIGGER_OVERLAP content words.
            if len(trigger_terms) == 1:
                scores[name] += 5
            elif len(overlap) >= MIN_TRIGGER_OVERLAP:
                scores[name] += 5

        # Capability matches
        for cap in s.get("capabilities", []):
            cap_lower = cap.lower()
            if cap_lower in normalized:
                scores[name] += 8
            elif len(cap_lower.split("-")) > 1:
                cap_parts = set(cap_lower.split("-")) - {
                    "design", "visualizer", "processing", "engine", "service"
                }
                if cap_parts and cap_parts.issubset(tokens):
                    scores[name] += 6

        # Description keyword overlap (requires >= 2 distinct content words overlap)
        desc_words = set(re.findall(r"[a-z0-9\-/.]+", s.get("description", "").lower()))
        desc_overlap = content_tokens.intersection(desc_words)
        if len(desc_overlap) >= 2:
            scores[name] += len(desc_overlap) * 1

    # Filter by minimum relevance threshold (eliminates 1-point generic description noise)
    matched = [name for name, sc in scores.items() if sc >= MIN_MATCH_SCORE]

    # Apply Priority & Category Specificity Arbitration for tie-breaking and ranking
    # Deterministic tie-breaking includes skill name as final tie-breaker
    def rank_key(name: str):
        s = skills_by_name[name]
        raw_score = scores[name]
        prio_bonus = PRIORITY_WEIGHT.get(s.get("priority", "normal"), 0)
        cat_bonus = CATEGORY_SPECIFICITY.get(s.get("category", "core"), 0)
        return (raw_score, prio_bonus, cat_bonus, name)

    sorted_candidates = sorted(matched, key=rank_key, reverse=True)

    # Pick top candidates
    selected = set(sorted_candidates[:5])

    # 3. Resolve 'requires' dependencies recursively
    to_resolve = list(selected)
    required_deps = set()
    while to_resolve:
        curr = to_resolve.pop(0)
        curr_skill = skills_by_name.get(curr)
        if curr_skill:
            for req in curr_skill.get("requires", []):
                if req not in selected:
                    selected.add(req)
                    to_resolve.append(req)
                required_deps.add(req)

    # 4. Enforce bounds - only pad if candidate has genuine relevance (>= MIN_MATCH_SCORE)
    if len(selected) < min_skills and sorted_candidates:
        for c in sorted_candidates:
            selected.add(c)
            if len(selected) >= min_skills:
                break

    if len(selected) > max_skills:
        # Keep dependencies of top skills; prune non-required peripheral matches first
        def prune_key(name: str):
            is_req = 1 if (name in required_deps or name in sorted_candidates[:3]) else 0
            return (is_req, *rank_key(name))
        selected_sorted = sorted(selected, key=prune_key, reverse=True)
        selected = set(selected_sorted[:max_skills])

    final_ordered = sorted(list(selected), key=rank_key, reverse=True)

    # Identify leading skill
    lead_skill = final_ordered[0] if final_ordered else None

    # Detect conflict / simultaneous trigger arbitration if relevant
    arbitration_note = None
    if lead_skill and len(final_ordered) > 1:
        second_skill = final_ordered[1]
        lead_meta = skills_by_name[lead_skill]
        second_meta = skills_by_name[second_skill]
        if scores[lead_skill] > 0 and scores[second_skill] > 0:
            arbitration_note = (
                f"Lead skill '{lead_skill}' (priority: {lead_meta.get('priority')}, cat: {lead_meta.get('category')}) "
                f"arbitrated ahead of '{second_skill}' (priority: {second_meta.get('priority')}, cat: {second_meta.get('category')})."
            )

    results = []
    for name in final_ordered:
        s = skills_by_name[name]
        rel_path = s.get("path", "")
        skill_file = Path(rel_path) / "SKILL.md"
        results.append({
            "name": name,
            "category": s.get("category"),
            "priority": s.get("priority", "normal"),
            "security_sensitive": s.get("security_sensitive", False),
            "path": str(skill_file).replace("\\", "/"),
            "is_lead": (name == lead_skill),
        })

    return {
        "query": query,
        "lead_skill": lead_skill,
        "total_selected": len(results),
        "arbitration_note": arbitration_note,
        "skills": results,
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Intelligent Skill Router CLI (Manifest-Only Progressive Disclosure)"
    )
    parser.add_argument("query", nargs="*", help="User request in natural language")
    parser.add_argument("--max", type=int, default=8, help="Maximum skills to activate (default: 8)")
    parser.add_argument("--min", type=int, default=2, help="Minimum skills to activate (default: 2)")
    parser.add_argument("--json", action="store_true", help="Output machine-readable JSON")
    parser.add_argument("--paths", action="store_true", help="Output SKILL.md file paths only")
    parser.add_argument(
        "--generate-manifest",
        action="store_true",
        help="Rebuild skills-manifest.json from skills-index.json",
    )

    args = parser.parse_args()

    if args.generate_manifest:
        return generate_manifest()

    query_str = " ".join(args.query).strip()
    if not query_str:
        parser.print_help()
        return 1

    try:
        decision = route_skills(query_str, max_skills=args.max, min_skills=args.min)
    except Exception as e:
        print(f"Routing error: {e}", file=sys.stderr)
        return 1

    if args.json:
        print(json.dumps(decision, indent=2))
        return 0

    if args.paths:
        for s in decision["skills"]:
            print(s["path"])
        return 0

    # Human-readable format
    print(f"\n[Skill Router Decision] Target: {decision['total_selected']} skills")
    print(f"Query: \"{decision['query']}\"")
    if decision["arbitration_note"]:
        print(f"Arbitration: {decision['arbitration_note']}")
    print("-" * 65)
    for idx, s in enumerate(decision["skills"], 1):
        lead_flag = " [LEAD]" if s["is_lead"] else ""
        sec_flag = " [SECURITY-SENSITIVE]" if s.get("security_sensitive") else ""
        print(f"{idx}. {s['name']}{lead_flag}{sec_flag}")
        print(f"   Category: {s['category']} | Priority: {s['priority']}")
        print(f"   Path:     AI-SKILLS/{s['path']}")
    print("-" * 65)
    print("Action: Load ONLY the above SKILL.md files into session context.\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
