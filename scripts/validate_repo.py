#!/usr/bin/env python3
"""Repository quality gate: deliverables, IDs, traceability, test references, BPMN and the learning lab.

Checks (each prints OK or the problems found; exit code 1 if any check fails):
  1. required deliverables exist
  2. every ID family is defined in its one source document, without duplicates
  3. every ID referenced anywhere in Markdown, Gherkin or HTML is defined
  4. traceability: Must requirements have stories; every FR/NFR has tests; BAT/DEF consistency
  5. automated test names quoted in docs/09-acceptance/test-cases.md exist in the test files
  6. BPMN files are well-formed BPMN 2.0 and every sequence flow points to an existing node
  7. learning lab: every module has the required sections; every quiz has a separate answer key

Run: python3 scripts/validate_repo.py
"""
from __future__ import annotations

import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP = {".git", "node_modules", "out", ".next", "test-results", "playwright-report", "__pycache__", "generated"}
failures: list[str] = []


def files(*suffixes: str):
    for p in ROOT.rglob("*"):
        if p.is_file() and p.suffix in suffixes and not any(part in SKIP for part in p.parts):
            yield p


def text(rel: str) -> str:
    return (ROOT / rel).read_text(encoding="utf-8")


def report(name: str, problems: list[str]):
    if problems:
        failures.append(name)
        print(f"FAIL {name} ({len(problems)})")
        for pr in problems[:40]:
            print(f"   - {pr}")
        if len(problems) > 40:
            print(f"   … and {len(problems) - 40} more")
    else:
        print(f"OK   {name}")


# ---------------------------------------------------------------- 1. deliverables
REQUIRED = [
    "README.md", "START-HERE.md", "PROJECT-ROADMAP.md", "CONTRIBUTING.md", "LICENSE", "CASE_STUDY.md", "EVIDENCE.md",
    "docs/00-documentation-map.md",
    "docs/01-opportunity/problem-statement.md", "docs/01-opportunity/strategic-analysis.md", "docs/01-opportunity/options-and-business-case.md",
    "docs/01-opportunity/kpi-tree.md", "docs/01-opportunity/registers.md",
    "docs/02-discovery/context.md", "docs/02-discovery/sources.md", "docs/02-discovery/stakeholders.md", "docs/02-discovery/interview-notes.md", "docs/02-discovery/glossary.md",
    "docs/03-workshops/event-storming-plan.md", "docs/03-workshops/event-storming-board.md", "docs/03-workshops/workshop-dialogue.md", "docs/03-workshops/decision-log.md",
    "docs/04-process/as-is.md", "docs/04-process/to-be.md", "docs/04-process/gap-analysis.md", "docs/04-process/uml.md",
    "docs/04-process/bpmn/as-is.bpmn", "docs/04-process/bpmn/to-be.bpmn",
    "docs/05-requirements/exception-rules.md", "docs/05-requirements/dmn/exception-decisions.dmn", "docs/05-requirements/requirements.md", "docs/05-requirements/traceability.md",
    "docs/06-backlog/product-vision-and-roadmap.md", "docs/06-backlog/story-map.md", "docs/06-backlog/user-stories.md", "docs/06-backlog/prioritisation.md",
    "docs/06-backlog/definition-of-ready-done.md", "docs/06-backlog/features/exception-decision.feature",
    "docs/07-design/personas-and-journeys.md", "docs/07-design/ux-specification.md", "docs/07-design/design.md",
    "docs/08-delivery/sprint-plan.md", "docs/08-delivery/roles-and-responsibilities.md", "docs/08-delivery/refinement-log.md", "docs/08-delivery/sprint-review.md",
    "docs/09-acceptance/test-strategy.md", "docs/09-acceptance/test-cases.md", "docs/09-acceptance/test-results.md", "docs/09-acceptance/bat-plan.md", "docs/09-acceptance/bat-log.md",
    "docs/10-go-live/release-readiness.md", "docs/10-go-live/communication-plan.md", "docs/10-go-live/support-handover.md", "docs/10-go-live/release-note.md",
    "docs/11-measure/benefits-review.md",
    "docs/12-architecture/README.md", "docs/12-architecture/integration-and-api.md", "docs/12-architecture/data-model-and-states.md", "docs/12-architecture/security-privacy-observability.md",
    "docs/13-quality/reviews.md",
    "demo/README.md", "demo/mock-apis/openapi.yaml", "demo/mock-data/generate.mjs", "demo/application/package.json",
    "site/assets/exception-rules.mjs", "tests/exception-rules.test.mjs",
    "learning/README.md", "learning/progress-tracker.md", "learning/glossary.md",
    "learning/interview-preparation/README.md", "learning/interview-preparation/questions.md", "learning/interview-preparation/defend-your-case.md",
    "learning/assessment/README.md",
    "portfolio/README.md", "portfolio/cv-description.md", "portfolio/case-study/case-study.pdf", "portfolio/presentation/interview-deck.pptx",
    "portfolio/content/case.json", "portfolio/role-requirement-matrix.md", "portfolio/views/recruiter-view.md", "portfolio/views/hiring-manager-view.md",
    "portfolio/views/technical-view.md", "portfolio/demo/2-minute-demo.md", "portfolio/demo/5-minute-demo.md", "portfolio/demo/15-minute-demo.md",
    "portfolio/executive-summary/executive-summary.pdf", "portfolio/career/linkedin-project.md",
    "docs/12-architecture/adr/README.md", "docs/10-go-live/operations-runbook.md", "docs/10-go-live/change-and-adoption.md",
    "docs/07-design/usability-test-plan.md", "docs/06-backlog/release-2-edi-status.md",
    "site/index.html", "site/workspace/index.html", "site/workspace/evidence.json", "site/learning/index.html", "site/for/recruiters/index.html",
    ".github/workflows/ci.yml", ".github/workflows/pages.yml",
]
report("required deliverables", [f"missing: {r}" for r in REQUIRED if not (ROOT / r).exists()])

# ---------------------------------------------------------------- 2. ID definitions
# family -> (regex for one ID, source file(s) where it is defined)
FAMILIES = {
    "BR": (r"BR-\d", ["docs/05-requirements/requirements.md"]),
    "FR": (r"FR-\d{2}", ["docs/05-requirements/requirements.md"]),
    "NFR": (r"NFR-\d{2}", ["docs/05-requirements/requirements.md"]),
    "DQ": (r"DQ-\d", ["docs/05-requirements/requirements.md"]),
    "ER": (r"ER-\d{2}", ["docs/05-requirements/exception-rules.md"]),
    "D": (r"D-\d{2}", ["docs/03-workshops/decision-log.md"]),
    "H": (r"H-\d{2}", ["docs/03-workshops/event-storming-board.md"]),
    "K": (r"K\d", ["docs/01-opportunity/kpi-tree.md"]),
    "BAT": (r"BAT-\d{2}", ["docs/09-acceptance/bat-plan.md"]),
    "DEF": (r"DEF-\d{2}", ["docs/09-acceptance/bat-log.md"]),
    "A": (r"A-\d{2}", ["docs/01-opportunity/registers.md"]),
    "C": (r"C-\d{2}", ["docs/01-opportunity/registers.md"]),
    "R": (r"R-\d{2}", ["docs/01-opportunity/registers.md"]),
    "DEP": (r"DEP-\d{2}", ["docs/01-opportunity/registers.md"]),
    "TC": (r"TC-\d{2}", ["docs/09-acceptance/test-cases.md"]),
    "OQ": (r"OQ-\d{2}", ["docs/12-architecture/README.md"]),
    "S": (r"S-\d{2}", ["docs/02-discovery/sources.md"]),
    "RQ": (r"RQ-\d{2}", ["docs/02-discovery/sources.md"]),
    "TA": (r"TA-\d", ["docs/12-architecture/integration-and-api.md"]),
    "EF": (r"EF-\d", ["docs/04-process/gap-analysis.md"]),
    "UX": (r"UX-\d", ["docs/07-design/ux-specification.md"]),
}


def first_cells(md: str) -> list[str]:
    out = []
    for line in md.splitlines():
        if line.startswith("|") and not re.match(r"^\|\s*-", line):
            cell = line.split("|")[1].strip()
            cell = re.sub(r"\*\*|`", "", cell)
            cell = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", cell)
            out.append(cell)
    return out


defined: dict[str, set[str]] = {}
problems: list[str] = []
for fam, (pat, sources) in FAMILIES.items():
    ids: list[str] = []
    for src in sources:
        md = text(src)
        if fam == "D":
            ids += re.findall(rf"^## ({pat})\s*$", md, re.M)
        elif fam == "K":  # the KPI table itself (7 columns), not the "how each baseline is measured" table
            ids += [ln.split("|")[1].strip() for ln in md.splitlines() if re.match(rf"^\| {pat} \|", ln) and ln.count("|") >= 8]
        else:
            ids += [c for c in first_cells(md) if re.fullmatch(pat, c)]
    dupes = sorted({i for i in ids if ids.count(i) > 1})
    problems += [f"{fam}: {d} defined twice in {', '.join(sources)}" for d in dupes]
    if not ids:
        problems.append(f"{fam}: no definitions found in {sources}")
    defined[fam] = set(ids)

# Stories: headings in user-stories.md plus the release 2/3 table; acceptance criteria: feature files and story bullets
stories_md = text("docs/06-backlog/user-stories.md")
story_ids = re.findall(r"^### ((?:US|EN)-\d+)\b", stories_md, re.M) + [c for c in first_cells(stories_md) if re.fullmatch(r"US-\d{2}", c)]
problems += [f"US/EN: {d} defined twice" for d in sorted({s for s in story_ids if story_ids.count(s) > 1})]
defined["US"] = {s for s in story_ids if s.startswith("US")}
defined["EN"] = {s for s in story_ids if s.startswith("EN")}
ac_ids: list[str] = []
for f in (ROOT / "docs/06-backlog/features").glob("*.feature"):
    ft = f.read_text(encoding="utf-8")
    ac_ids += re.findall(r"^\s*\|\s*(AC-\d{2}\.\d+)\s*\|", ft, re.M)
    ac_ids += re.findall(r"^\s*Scenario:\s*(AC-\d{2}\.\d+)\b", ft, re.M)
ac_ids += re.findall(r"^- (AC-\d{2}\.\d+)\s", stories_md, re.M)
dupe_ac = sorted({a for a in ac_ids if ac_ids.count(a) > 1})
# A criterion may be both a Gherkin scenario and a story bullet; that is the same definition, not a duplicate.
problems += [f"AC: {d} defined more than twice" for d in dupe_ac if ac_ids.count(d) > 2]
defined["AC"] = set(ac_ids)
FAMILIES["US"] = (r"US-\d{2}", [])
FAMILIES["EN"] = (r"EN-\d", [])
FAMILIES["AC"] = (r"AC-\d{2}\.\d+", [])
report("ID definitions (one source, no duplicates)", problems)

# ---------------------------------------------------------------- 3. references
ref_problems = []
for f in files(".md", ".feature", ".html", ".mjs", ".ts", ".tsx", ".yaml"):
    rel = f.relative_to(ROOT).as_posix()
    if rel.startswith(("demo/mock-data/", "demo/application/src/generated")):
        continue
    body = f.read_text(encoding="utf-8", errors="ignore")
    body = re.sub(r"https?://\S+", "", body)
    for m in re.finditer(r"(?<![\w-])(BR-\d|FR-\d{2}|NFR-\d{2}|DQ-\d|ER-\d{2}|D-\d{2}|H-\d{2}|K\d|BAT-\d{2}|DEF-\d{2}|A-\d{2}|C-\d{2}|R-\d{2}|DEP-\d{2}|TC-\d{2}|OQ-\d{2}|S-\d{2}|RQ-\d{2}|TA-\d|EF-\d|UX-\d|US-\d{2}|EN-\d|AC-\d{2}\.\d+)(?![\w-]|\.\d)", body):
        token = m.group(1)
        fam = re.match(r"[A-Z]+", token).group(0)
        if token not in defined.get(fam, set()):
            ref_problems.append(f"{rel}: {token} is not defined")
report("ID references resolve", sorted(set(ref_problems)))

# ---------------------------------------------------------------- 4. traceability
tr = []
req_md = text("docs/05-requirements/requirements.md")
for line in req_md.splitlines():
    m = re.match(r"^\| (FR-\d{2}) \| .* \| (Must|Should|Could|Won't[^|]*) \| ([^|]*) \|$", line)
    if m:
        fr, prio, story = m.groups()
        refs = re.findall(r"(?:US|EN)-\d+", story)
        if prio == "Must" and not refs:
            tr.append(f"{fr} is Must but has no story")
        tr += [f"{fr} points to unknown story {r}" for r in refs if r not in defined["US"] | defined["EN"]]
tests_md = text("docs/09-acceptance/test-cases.md")
summary = tests_md.split("## Requirements → tests")[1] if "## Requirements → tests" in tests_md else ""
for fr in sorted(defined["FR"] | defined["NFR"]):
    if fr in {"FR-15", "FR-16", "FR-17"}:  # Won't (R2)
        continue
    if not re.search(rf"^\| {fr}\b", summary, re.M):
        tr.append(f"{fr} has no line in the requirements → tests summary")
bat_log = text("docs/09-acceptance/bat-log.md")
for b in sorted(defined["BAT"]):
    if b not in bat_log:
        tr.append(f"{b} planned but not in the BAT log")
for ref in sorted(set(re.findall(r"US-\d{2}|EN-\d", text("docs/06-backlog/prioritisation.md")))):
    if ref not in defined["US"] | defined["EN"]:
        tr.append(f"prioritisation lists unknown story {ref}")
backlog_csv = text("data/backlog.csv")
for s in sorted(defined["US"] | defined["EN"]):
    if s not in backlog_csv:
        tr.append(f"{s} is not in data/backlog.csv")
report("traceability", tr)

# ---------------------------------------------------------------- 5. test names quoted in test-cases.md
test_titles: list[str] = []
for f in list((ROOT / "tests").glob("*.mjs")) + list((ROOT / "demo/application/tests").rglob("*.ts")):
    test_titles += re.findall(r"""\btest\(\s*[`"'](.+?)[`"']\s*,""", f.read_text(encoding="utf-8"))
for f in (ROOT / "docs/06-backlog/features").glob("*.feature"):  # decision examples become test names "AC-xx title"
    test_titles += [f"{a} {t.strip()}" for a, t in re.findall(r"^\s*\|\s*(AC-\d{2}\.\d+)\s*\|\s*([^|]+)\|", f.read_text(encoding="utf-8"), re.M)]
tn = []
auto_col = [line.split("|")[-2] for line in tests_md.splitlines() if line.startswith("| TC-")]
for cell in auto_col:
    for quoted in re.findall(r"`([^`]+)`", cell):
        parts = [p.strip() for p in quoted.split("…") if p.strip()]
        if not any(all(p in title for p in parts) for title in test_titles):
            tn.append(f"no test named like: {quoted}")
report("test names in test-cases.md exist", tn)

# ---------------------------------------------------------------- 6. BPMN
bp = []
NS = {"bpmn": "http://www.omg.org/spec/BPMN/20100524/MODEL"}
for f in sorted((ROOT / "docs/04-process/bpmn").glob("*.bpmn")):
    try:
        tree = ET.parse(f)
    except ET.ParseError as e:
        bp.append(f"{f.name}: not well-formed XML ({e})")
        continue
    root = tree.getroot()
    if root.tag != f"{{{NS['bpmn']}}}definitions":
        bp.append(f"{f.name}: root is not bpmn:definitions")
    ids = {el.get("id") for el in root.iter() if el.get("id")}
    for flow in root.iter(f"{{{NS['bpmn']}}}sequenceFlow"):
        for attr in ("sourceRef", "targetRef"):
            if flow.get(attr) not in ids:
                bp.append(f"{f.name}: {flow.get('id')} {attr}={flow.get(attr)} does not exist")
    if not list(root.iter(f"{{{NS['bpmn']}}}startEvent")) or not list(root.iter(f"{{{NS['bpmn']}}}endEvent")):
        bp.append(f"{f.name}: needs a start and an end event")
for f in sorted((ROOT / "docs/05-requirements/dmn").glob("*.dmn")):
    try:
        root = ET.parse(f).getroot()
    except ET.ParseError as e:
        bp.append(f"{f.name}: not well-formed XML ({e})")
        continue
    if root.tag != "{https://www.omg.org/spec/DMN/20191111/MODEL/}definitions":
        bp.append(f"{f.name}: root is not a DMN 1.3 definitions element")
report("BPMN 2.0 and DMN 1.3 files", bp)

# ---------------------------------------------------------------- 7. learning lab
SECTIONS = [
    "Leerdoelen", "Uitleg", "Begrippen", "Voorbeelden", "In deze repository", "Stap voor stap",
    "Begeleide oefening", "Zelfstandige uitdaging", "Quiz", "Veelgemaakte fouten", "Interviewvragen", "Competentiechecklist",
]
ll = []
modules = sorted((ROOT / "learning/modules").glob("*/README.md")) if (ROOT / "learning/modules").exists() else []
if len(modules) < 10:
    ll.append(f"expected 10 modules, found {len(modules)}")
for m in modules:
    md = m.read_text(encoding="utf-8")
    heads = re.findall(r"^## (?:\d+\.\s*)?(.+)$", md, re.M)
    for s in SECTIONS:
        if not any(h.startswith(s) for h in heads):
            ll.append(f"{m.parent.name}: missing section '{s}'")
    quiz = m.parent / "quiz.md"
    key = ROOT / "learning/answer-keys" / f"{m.parent.name}.md"
    if not quiz.exists():
        ll.append(f"{m.parent.name}: no quiz.md")
    if not key.exists():
        ll.append(f"{m.parent.name}: no answer key in learning/answer-keys/")
    elif quiz.exists():
        nq = len(re.findall(r"^### Q\d+", quiz.read_text(encoding="utf-8"), re.M))
        na = len(re.findall(r"^### Q\d+", key.read_text(encoding="utf-8"), re.M))
        if nq != na or nq == 0:
            ll.append(f"{m.parent.name}: {nq} questions but {na} answers")
        if re.search(r"(?i)antwoord\s*:", quiz.read_text(encoding="utf-8")):
            ll.append(f"{m.parent.name}: quiz.md seems to contain answers")
report("learning lab structure", ll)

# ---------------------------------------------------------------- 8. portfolio manifest
import json as _json
mf = []
case = _json.loads(text("portfolio/content/case.json"))
statuses = set(case["statuses"])
ids = [e["id"] for e in case["evidence"]]
mf += [f"evidence ID {i} used twice" for i in sorted({i for i in ids if ids.count(i) > 1})]
for e in case["evidence"]:
    if e["status"] not in statuses:
        mf.append(f"{e['id']}: unknown status {e['status']}")
    if not (ROOT / e["path"].split("#")[0]).exists():
        mf.append(f"{e['id']}: path does not exist: {e['path']}")
    if e.get("demo") and not (e["demo"].startswith("control-tower/") or (ROOT / "site" / e["demo"]).exists()):
        mf.append(f"{e['id']}: demo page does not exist: {e['demo']}")
links = [l for w in case["workstreams"] for l in w["links"]] + case["architecture"]["links"] + [[d["id"], d["path"]] for d in case["decisions"]]
for label, path in links:
    if not path.startswith("http") and not (ROOT / path.split("#")[0]).exists():
        mf.append(f"link '{label}' points to a missing file: {path}")
for d in case["decisions"]:
    if d["id"] not in defined["D"]:
        mf.append(f"decision {d['id']} is not in the decision log")
for o in case["outcomes"]:
    if o["kpi"] not in defined["K"]:
        mf.append(f"outcome {o['kpi']} is not in the KPI tree")
report("portfolio manifest (portfolio/content/case.json)", mf)

print()
if failures:
    print(f"{len(failures)} check(s) failed: {', '.join(failures)}")
    sys.exit(1)
print("All repository checks passed.")
