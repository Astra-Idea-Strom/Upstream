#!/usr/bin/env python3
"""
Benchmark and validation test suite for the deterministic Skill Router v3.
Validates intent understanding, graph dependency resolution, priority arbitration,
noise rejection, and the minimum sufficient skill constraint (typically 2-5 skills).
Directly tests tools/route3.py (no forked implementation).
"""

import json
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT_DIR / "tools"))

from route3 import route

INDEX_FILE = ROOT_DIR / "skills-index.json"


def test_no_forked_router():
    src = Path(__file__).read_text(encoding="utf-8")
    assert "from route3 import route" in src or "import route3" in src, \
        "test_router.py must import route3.py, not re-implement it"
    assert "\ndef route_skills(" not in src, \
        "test_router.py must not implement custom router logic"


def run_route(query: str, max_skills: int = 5) -> dict:
    res = route(query, hard_cap=max_skills)
    return {
        "lead_skill": res["lead"],
        "skills": res["skills"]
    }


# Benchmark test cases
TEST_CASES = [
    {
        "name": "Frontend-only Component",
        "query": "Build a responsive pricing card component with dark mode support",
        "expected_present": ["responsive-design"],
        "expected_absent": ["database", "sql", "docker", "threejs"],
        "min_skills": 1,
        "max_skills": 5,
    },
    {
        "name": "Backend-only Stripe Webhook",
        "query": "Create an idempotent Stripe checkout webhook handler with HMAC verification and rate limit",
        "expected_present": ["api-security"],
        "expected_absent": ["3d-web", "threejs", "visual-design"],
        "min_skills": 1,
        "max_skills": 5,
    },
    {
        "name": "Security-only OWASP Audit",
        "query": "Audit our session handling and credentials against OWASP Top 10 and secret leaks",
        "expected_present": ["owasp", "secrets-management"],
        "expected_absent": ["threejs", "audio-speech-processing"],
        "min_skills": 2,
        "max_skills": 5,
    },
    {
        "name": "Full-Stack Collaborative Board",
        "query": "Build a collaborative task management board with realtime WebSockets and PostgreSQL",
        "expected_present": ["realtime", "postgresql"],
        "expected_absent": ["threejs", "audio-speech-processing"],
        "min_skills": 2,
        "max_skills": 5,
    },
    {
        "name": "Three.js / 3D Visualization",
        "query": "Create an interactive 3D product visualizer in WebGL using Three.js",
        "expected_lead": "3d-web",
        "expected_present": ["3d-web", "threejs"],
        "expected_absent": ["sql", "postgresql", "docker", "git", "embeddings", "skill-routing"],
        "disallow_unexpected_noise": True,
        "allowed_extra": ["frontend-engineering"],
        "min_skills": 2,
        "max_skills": 5,
    },
    {
        "name": "AI / RAG Pipeline",
        "query": "Implement a PDF question answering system with vector search, embeddings, and citations",
        "expected_present": ["rag", "embeddings"],
        "expected_absent": ["threejs", "docker"],
        "min_skills": 2,
        "max_skills": 5,
    },
    {
        "name": "Debugging Memory Leak",
        "query": "Fix memory leak, event loop lag, and debug crash in Node.js server",
        "expected_present": ["debugging"],
        "expected_absent": ["threejs", "3d-web"],
        "min_skills": 1,
        "max_skills": 5,
    },
    {
        "name": "Ambiguous NL: 'make this page look better'",
        "query": "make this page look better and professional",
        "expected_lead": "human-ui-design",
        "expected_present": ["human-ui-design"],
        "expected_absent": ["database", "sql", "docker", "security-review"],
        "min_skills": 1,
        "max_skills": 5,
    },
    {
        "name": "Ambiguous NL: 'add login'",
        "query": "add login to this app",
        "expected_lead": "authentication",
        "expected_present": ["authentication"],
        "expected_absent": ["threejs", "audio-speech-processing"],
        "min_skills": 1,
        "max_skills": 5,
    },
    {
        "name": "Ambiguous NL: 'make it work on mobile'",
        "query": "make it work on mobile devices",
        "expected_present": ["responsive-design"],
        "expected_absent": ["sql", "docker"],
        "min_skills": 1,
        "max_skills": 5,
    },
    {
        "name": "Ambiguous NL: 'this isn't working, fix it'",
        "query": "this isn't working, fix it please",
        "expected_lead": "debugging",
        "expected_present": ["debugging"],
        "expected_absent": ["threejs", "3d-web"],
        "min_skills": 1,
        "max_skills": 5,
    },
    {
        "name": "Ambiguous NL: 'add whatever security is needed'",
        "query": "add whatever security is needed for my API",
        "expected_present": ["owasp"],
        "expected_absent": ["threejs", "3d-web"],
        "min_skills": 1,
        "max_skills": 5,
    },
    {
        "name": "Colloquial UI polish must not route to security gate",
        "query": "make this button look nicer",
        "expected_lead": "human-ui-design",
        "expected_absent": ["security-review"],
        "disallow_unexpected_noise": True,
        "allowed_extra": ["web-design", "visual-design", "advanced-css", "frontend-engineering", "design-systems"],
        "min_skills": 1,
        "max_skills": 5,
    },
    {
        "name": "Stopword-only overlap must score zero",
        "query": "is it possible to do this for me",
        "expected_absent": ["security-review", "tdd-workflow"],
        "min_skills": 0,
        "max_skills": 5,
    },
    {
        "name": "Exact trigger phrase owns the lead",
        "query": "is this safe to merge",
        "expected_lead": "security-review",
        "min_skills": 1,
        "max_skills": 5,
    },
]


def main() -> int:
    print("=== Testing Skill Selection Router Benchmark Suite ===")
    test_no_forked_router()
    print("[PASS] Structural check: router is imported from route3.py (no fork).")

    failures = 0

    for idx, tc in enumerate(TEST_CASES, start=1):
        min_s = tc.get("min_skills", 1)
        max_s = tc.get("max_skills", 5)
        decision = run_route(tc["query"], max_skills=max_s)
        selected = [s["name"] for s in decision["skills"]]
        lead = decision["lead_skill"]

        print(f"\n[Test {idx}] {tc['name']}")
        print(f"  Query:    \"{tc['query']}\"")
        print(f"  Lead:     {lead}")
        print(f"  Selected ({len(selected)}): {selected}")

        test_failed = False

        if "expected_lead" in tc:
            if lead != tc["expected_lead"]:
                print(f"  [FAIL] Expected lead '{tc['expected_lead']}', got '{lead}'")
                test_failed = True

        for exp in tc.get("expected_present", []):
            if exp not in selected:
                print(f"  [FAIL] Expected skill '{exp}' was not selected")
                test_failed = True

        for absent in tc.get("expected_absent", []):
            if absent in selected:
                print(f"  [FAIL] Forbidden skill '{absent}' was selected")
                test_failed = True

        if tc.get("disallow_unexpected_noise", False):
            allowed = set(tc.get("expected_present", []) + tc.get("allowed_extra", []))
            if "expected_lead" in tc and tc["expected_lead"]:
                allowed.add(tc["expected_lead"])
            noise = set(selected) - allowed
            if noise:
                print(f"  [FAIL] Unexpected noise skills selected: {noise}")
                test_failed = True

        if len(selected) < min_s:
            print(f"  [FAIL] Selected skills ({len(selected)}) < min_skills ({min_s})")
            test_failed = True
        elif len(selected) > max_s:
            print(f"  [FAIL] Selected skills ({len(selected)}) > max_skills ({max_s})")
            test_failed = True

        if test_failed:
            failures += 1
        else:
            print("  [PASS] All constraints, lead expectations, and bounds satisfied.")

    print("\n" + "=" * 42)
    print(f"Results: {len(TEST_CASES) - failures}/{len(TEST_CASES)} tests passed.")
    if failures == 0:
        print("[SUCCESS] 100% router benchmark tests passed cleanly against route3.py!")
        return 0
    else:
        print(f"[FAIL] {failures} test(s) failed in router benchmark suite.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
