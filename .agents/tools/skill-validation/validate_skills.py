#!/usr/bin/env python3
"""
Automated validation script for the AI Engineering Skill System.
Validates YAML frontmatter, file paths, dependency graph integrity,
structural rules, README synchronization, and build_index freshness.
"""

import json
import os
import re
import subprocess
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    yaml = None

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
INDEX_FILE = ROOT_DIR / "skills-index.json"
README_FILE = ROOT_DIR / "README.md"
BUILD_INDEX_SCRIPT = ROOT_DIR / "tools" / "build_index.py"

MIN_BODY_BYTES = 1500
MIN_HEADINGS = 3

STRAY_IGNORE_DIRS = {".git", ".gemini", "solutions", "__pycache__"}
STRAY_IGNORE_FILES = {"IMPROVEMENT-TRACKER.md", ".gitignore", "LICENSE"}


def extract_frontmatter(file_path: Path):
    errors = []
    if not file_path.is_file():
        return None, "", [f"File does not exist: {file_path}"]

    try:
        content = file_path.read_text(encoding="utf-8")
    except Exception as e:
        return None, "", [f"Could not read {file_path}: {e}"]

    match = re.match(r"^---\r?\n(.*?)\r?\n---", content, re.DOTALL)
    if not match:
        return None, content, [f"Missing YAML frontmatter in {file_path}"]

    fm_raw = match.group(1)
    body = content[match.end():]
    data = {}

    if yaml is not None:
        try:
            parsed = yaml.safe_load(fm_raw)
            if isinstance(parsed, dict):
                data = parsed
        except Exception as e:
            errors.append(f"YAML parsing error in {file_path}: {e}")

    if not data:
        name_match = re.search(r"^name:\s*([a-zA-Z0-9\-_.]+)", fm_raw, re.MULTILINE)
        if name_match:
            data["name"] = name_match.group(1).strip()
        desc_match = re.search(r"^description:\s*(.*?)$", fm_raw, re.MULTILINE)
        if desc_match:
            v = desc_match.group(1).strip()
            if v in (">-", ">", "|", "|-", ""):
                lines = []
                for line in fm_raw[desc_match.end():].splitlines():
                    if line.startswith("  ") or line.startswith("\t"):
                        lines.append(line.strip())
                    elif not line.strip() and lines:
                        lines.append("")
                    else:
                        break
                data["description"] = re.sub(r"\s+", " ", " ".join(lines)).strip()
            else:
                if (v.startswith('"') and v.endswith('"')) or (v.startswith("'") and v.endswith("'")):
                    v = v[1:-1].strip()
                data["description"] = v

    return data, body, errors


def validate_readme_counts(readme_text: str, skills_on_disk: list):
    errors = []
    cat_counts = {}
    for p in skills_on_disk:
        cat = p.parent.parent.name
        cat_counts[cat] = cat_counts.get(cat, 0) + 1

    total_disk = len(skills_on_disk)

    for cat, count in cat_counts.items():
        pattern = rf"(?:├──\s+{cat}/|`{cat}/`|\*\*{cat}\*\*|#\s+{cat}\b)[^|\n]*?(\d+)\s*skills?"
        m = re.search(pattern, readme_text, re.IGNORECASE)
        if m:
            found_count = int(m.group(1))
            if found_count != count:
                errors.append(f"README count mismatch for '{cat}': found {found_count}, disk has {count}")

    return errors


def validate_readme_tree(readme_text: str, skills_on_disk: list):
    errors = []
    for p in skills_on_disk:
        skill_name = p.parent.name
        if skill_name not in readme_text:
            errors.append(f"Skill '{skill_name}' not found in README")
    return errors


def check_stray_files(root_dir: Path):
    stray = []
    for item in root_dir.rglob("*"):
        if any(ignored in item.parts for ignored in STRAY_IGNORE_DIRS):
            continue
        if item.name.startswith("test_") and item.suffix in (".txt", ".tmp"):
            stray.append(str(item.relative_to(root_dir)))
        elif item.name == "cards" and item.is_dir():
            if (item / "test.json").is_file():
                stray.append(str((item / "test.json").relative_to(root_dir)))
        elif item.suffix == ".pyc":
            stray.append(str(item.relative_to(root_dir)))
    return stray


def main() -> int:
    print(f"=== Validating Skill System at: {ROOT_DIR} ===")

    if not INDEX_FILE.is_file():
        print(f"[FAIL] Missing index file: {INDEX_FILE}")
        return 1

    try:
        with open(INDEX_FILE, "r", encoding="utf-8") as f:
            registry = json.load(f)
    except Exception as e:
        print(f"[FAIL] Error parsing JSON index: {e}")
        return 1

    skills = registry.get("skills", [])
    total_skills_field = registry.get("total_skills", 0)
    print(f"Found {len(skills)} registered skills in skills-index.json (total_skills={total_skills_field})")

    skill_names = {s["name"] for s in skills}
    errors = []
    warnings = []

    # 1. Total skills check (a)
    all_disk_skills = sorted(ROOT_DIR.glob("**/SKILL.md"))
    if total_skills_field != len(skills):
        errors.append(f"total_skills ({total_skills_field}) != len(skills) ({len(skills)}) in index")
    if len(skills) != len(all_disk_skills):
        errors.append(f"Registered skills ({len(skills)}) != disk skills ({len(all_disk_skills)})")

    # 2. Manifest check (b)
    manifest_file = ROOT_DIR / "skills-manifest.json"
    if manifest_file.is_file():
        try:
            m_data = json.loads(manifest_file.read_text(encoding="utf-8"))
            m_skills = m_data.get("skills", [])
            if len(m_skills) != len(skills):
                errors.append(f"Manifest skill count ({len(m_skills)}) != index count ({len(skills)})")
        except Exception as e:
            errors.append(f"Invalid skills-manifest.json: {e}")

    # 3. README synchronization (c, d)
    if README_FILE.is_file():
        readme_text = README_FILE.read_text(encoding="utf-8")
        readme_count_errors = validate_readme_counts(readme_text, all_disk_skills)
        errors.extend(readme_count_errors)
        readme_tree_errors = validate_readme_tree(readme_text, all_disk_skills)
        errors.extend(readme_tree_errors)

    # 4. Stray files check (m)
    strays = check_stray_files(ROOT_DIR)
    for s in strays:
        errors.append(f"Stray file detected: {s}")

    # 5. Validate individual skills (e, f, g, h, i, j, k)
    registered_skill_files = set()
    for s in skills:
        name = s.get("name")
        cat = s.get("category")
        rel_path = s.get("path")

        if not name or not cat or not rel_path:
            errors.append(f"Invalid entry: missing name, category, or path: {s}")
            continue

        skill_file = ROOT_DIR / rel_path / "SKILL.md"
        if not skill_file.is_file():
            if (ROOT_DIR / rel_path).is_file():
                skill_file = ROOT_DIR / rel_path
            else:
                errors.append(f"Missing SKILL.md file for skill '{name}' at {skill_file}")
                continue

        registered_skill_files.add(skill_file.resolve())

        fm, body, fm_errors = extract_frontmatter(skill_file)
        errors.extend(fm_errors)
        if not fm:
            continue

        folder_name = skill_file.parent.name
        fm_name = fm.get("name")
        if not fm_name:
            errors.append(f"Skill at {skill_file} missing 'name' in frontmatter")
        elif fm_name != folder_name:
            errors.append(f"Frontmatter name '{fm_name}' != folder name '{folder_name}' in {skill_file}")
        elif fm_name != name:
            errors.append(f"Frontmatter name '{fm_name}' != index name '{name}' in {skill_file}")

        desc = fm.get("description", "")
        if not desc:
            errors.append(f"Skill '{name}' missing 'description' in frontmatter")
        else:
            if len(desc) > 1024:
                errors.append(f"Skill '{name}' description exceeds 1024 characters ({len(desc)})")

            if "use when" not in desc.lower():
                warnings.append(f"Skill '{name}' description missing 'Use when' trigger phrase")

            idx_desc = s.get("description", "")
            if desc.strip() != idx_desc.strip():
                errors.append(f"Skill '{name}' description in SKILL.md differs from skills-index.json")

            keywords = [w for w in re.findall(r"[A-Za-z0-9\-]{4,}", desc)
                        if w.lower() not in {"this", "that", "with", "when", "into", "from", "only", "about"}]
            body_lower = body.lower()
            missing_kw = [kw for kw in keywords if kw.lower() not in body_lower]
            if len(missing_kw) > 6:
                warnings.append(f"Skill '{name}' description has multiple keywords not found in body: {missing_kw[:3]}")

        file_size = skill_file.stat().st_size
        if file_size < 2500 or file_size > 6500:
            warnings.append(f"Skill '{name}' file size {file_size} bytes is outside 2.5 KB - 6.5 KB target")

        body_no_code = re.sub(r'```[\s\S]*?```', '', body)
        body_no_code = re.sub(r'`[^`\n]+`', '', body_no_code)
        if re.search(r"(?<!\\)\$[^$\n]+\$", body_no_code) or "$$" in body_no_code:
            warnings.append(f"Skill '{name}' contains LaTeX math notation ($...$)")

        if len(body.encode("utf-8")) < MIN_BODY_BYTES:
            warnings.append(f"Thin skill file: '{name}' body is {len(body.encode('utf-8'))} bytes (min {MIN_BODY_BYTES})")
        if len(re.findall(r"^#{2,}\s", body, re.MULTILINE)) < MIN_HEADINGS:
            warnings.append(f"Skill '{name}' has fewer than {MIN_HEADINGS} sections")

        if "security_sensitive" not in s:
            errors.append(f"Skill '{name}' is missing required 'security_sensitive' field")
        elif not isinstance(s["security_sensitive"], bool):
            errors.append(f"Skill '{name}' has non-boolean 'security_sensitive': {s['security_sensitive']!r}")

        for req in s.get("requires", []):
            if req not in skill_names:
                errors.append(f"Skill '{name}' requires unknown skill '{req}'")

        for comp in s.get("complements", []):
            if comp not in skill_names:
                warnings.append(f"Skill '{name}' complements unindexed skill '{comp}'")

    for disk_file in all_disk_skills:
        if disk_file.resolve() not in registered_skill_files:
            warnings.append(f"Unindexed SKILL.md found on disk: {disk_file.relative_to(ROOT_DIR)}")

    # 6. Check (l): run build_index.py --check
    if BUILD_INDEX_SCRIPT.is_file():
        res = subprocess.run([sys.executable, str(BUILD_INDEX_SCRIPT), "--check"],
                             capture_output=True, text=True)
        if res.returncode != 0:
            errors.append(f"build_index.py --check failed: {res.stderr.strip() or res.stdout.strip()}")

    print("\n--- Validation Summary ---")
    print(f"Total Registered Skills: {len(skills)}")
    print(f"Total SKILL.md on Disk:  {len(all_disk_skills)}")
    print(f"Total Errors Found:      {len(errors)}")
    print(f"Total Warnings:          {len(warnings)}")

    if warnings:
        print(f"\nWarnings ({len(warnings)}):")
        for w in warnings:
            print(f"  [WARN] {w}")

    if errors:
        print(f"\nErrors ({len(errors)}):")
        for e in errors:
            print(f"  [ERROR] {e}")
        print("\n[FAIL] Skill system validation failed.")
        return 1

    print(f"\n[SUCCESS] All {len(skills)} skills validated successfully! System integrity 100%.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
