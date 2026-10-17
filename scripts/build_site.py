#!/usr/bin/env python3
"""Build the landing page (site/index.html) and the evidence navigator data (site/workspace/evidence.json)
from the content manifest portfolio/content/case.json and the documentation tree.

  python3 scripts/build_site.py          write both
  python3 scripts/build_site.py --check  fail if the committed files are out of date (CI)
"""
from __future__ import annotations

import json
import re
import sys
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPO = "https://github.com/phlppgdfry/shipment-exception-management-business-analysis"
BLOB = f"{REPO}/blob/main/"
case = json.loads((ROOT / "portfolio/content/case.json").read_text(encoding="utf-8"))
STATUS = case["statuses"]

# Simple 24×24 stroke icons (drawn for this site).
ICON = {
    "search": '<circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4.5 4.5"/>',
    "rules": '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    "screen": '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    "gate": '<path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-6h6v6"/>',
    "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    "phone": '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',
    "users": '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.5c2.8.2 5 1.8 5 5"/>',
    "flow": '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M6 8.5V12a3 3 0 0 0 3 3h6.5"/>',
}


def icon(name: str) -> str:
    return f'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">{ICON[name]}</svg>'


def href(path: str) -> str:
    """Repository path → GitHub URL; site-relative paths (control-tower/, learning/…) stay relative."""
    if path.startswith(("http", "control-tower/", "learning/", "for/", "workspace/", "process/", "rules/", "event-storming/", "prototype/", "assets/")):
        return path
    return BLOB + path


def a(label: str, path: str, cls: str = "") -> str:
    c = f' class="{cls}"' if cls else ""
    return f'<a{c} href="{escape(href(path))}">{escape(label)}</a>'


def chips(items: list[str]) -> str:
    out = []
    for i, it in enumerate(items):
        if i:
            out.append('<span class="arrow" aria-hidden="true">→</span>')
        out.append(f'<span class="chipbox">{escape(it)}</span>')
    return f'<div class="flowchips" role="list">{"".join(out)}</div>'.replace('<span class="chipbox">', '<span class="chipbox" role="listitem">')


def badge(status: str) -> str:
    return f'<span class="status status-{status}">{escape(STATUS[status]["label"])}</span>'


def landing() -> str:
    ev = case["evidence"]
    counts = {k: sum(1 for e in ev if e["status"] == k) for k in STATUS}
    pillars = "".join(f'<li>{icon(p["icon"])}<div><b>{escape(p["title"])}</b><span>{escape(p["text"])}</span></div></li>' for p in case["pillars"])
    tiers = "".join(f'<li><span class="status status-{k}">{escape(v["label"])}</span><b>{counts[k]}</b><span>{escape(v["meaning"])}</span></li>' for k, v in STATUS.items())
    challenge = "".join(f'<li>{icon(c["icon"])}<div><b>{escape(c["title"])}</b><span>{escape(c["text"])}</span></div></li>' for c in case["challenge"])
    role = "".join(f'<li>{icon(c["icon"])}<div><b>{escape(c["title"])}</b><span>{escape(c["text"])}</span></div></li>' for c in case["myRole"])
    journey = "".join(f'<li><span class="n">{i + 1:02d}</span>{escape(s)}</li>' for i, s in enumerate(case["journey"]))
    streams = "".join(
        f'''<article class="stream" aria-labelledby="ws-{w["id"]}">
        <span class="stream-no" aria-hidden="true">{w["id"]}</span>
        <div>
          <h3 id="ws-{w["id"]}">{escape(w["title"])}</h3>
          <p class="tagline">{escape(w["tagline"])}</p>
          <div class="two-col tight">
            <div><p class="label">Problem</p><p>{escape(w["problem"])}</p></div>
            <div><p class="label">Design choice</p><p>{escape(w["choice"])}</p></div>
          </div>
          {chips(w["flow"])}
          <p class="links">{" · ".join(a(l, p) + ' <span aria-hidden="true">↗</span>' for l, p in w["links"])}</p>
        </div>
      </article>'''
        for w in case["workstreams"]
    )
    arch = case["architecture"]
    arch_html = f'''<div class="panel-box">
        <p class="small">Proposed architecture (release 1)</p>
        {chips(arch["flow"])}
        <p class="notes">{" · ".join(escape(n) for n in arch["notes"])}</p>
        <p class="small">{escape(arch["caption"])}</p>
      </div>
      <p class="links">{" · ".join(a(l, p) + ' <span aria-hidden="true">↗</span>' for l, p in arch["links"])}</p>'''
    decisions = "".join(
        f'<article class="card decision"><p class="label">{escape(d["id"])} · {escape(d["owner"])}</p><h3>{escape(d["title"])}</h3><p>{escape(d["text"])}</p><p class="links">{a("Decision log", d["path"])} <span aria-hidden="true">↗</span></p></article>'
        for d in case["decisions"]
    )
    impl = "".join(f'<li><span class="n">{i + 1:02d}</span><b>{escape(s["step"])}</b><span class="when">{escape(s["when"])}</span><span>{escape(s["text"])}</span></li>' for i, s in enumerate(case["implementation"]))
    outcomes = "".join(
        f'<article class="outcome"><p class="label">{escape(o["kpi"])}</p><h3>{escape(o["label"])}</h3><p class="kpi-move">{escape(o["baseline"])} <span aria-hidden="true">→</span><span class="sr-only"> to </span> {escape(o["target"])}</p><p class="small">Owner: {escape(o["owner"])}</p></article>'
        for o in case["outcomes"]
    )
    evidence = "".join(
        f'''<li class="ev">
          <span class="ev-id">{escape(e["id"])}</span>
          <div><b>{escape(e["title"])}</b><span>{escape(e["why"])}</span><span class="ev-meta">{badge(e["status"])} <span class="area">{escape(e["area"])}</span></span></div>
          <span class="ev-links">{a("Open evidence", e["path"])} <span aria-hidden="true">↗</span>{(" · " + a("Try it", e["demo"])) if e.get("demo") else ""}</span>
        </li>'''
        for e in ev
    )
    limits = "".join(f"<li>{escape(x)}</li>" for x in case["limits"])
    lessons = "".join(f"<li>{escape(x)}</li>" for x in case["lessons"])

    return f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Shipment exceptions — a business analysis case</title>
  <meta name="description" content="{escape(case["subtitle"])}">
  <meta property="og:title" content="{escape(case["title"])}">
  <meta property="og:description" content="{escape(case["subtitle"])}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://phlppgdfry.github.io/shipment-exception-management-business-analysis/assets/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="assets/style.css">
  <!-- Generated by scripts/build_site.py from portfolio/content/case.json — edit the manifest, not this file. -->
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="brand" href="./">Shipment exceptions <span class="brand-sub">Independent portfolio case</span></a>
      <nav aria-label="Sections">
        <a href="for/recruiters/">For recruiters</a>
        <a href="workspace/">Evidence</a>
        <a href="control-tower/">Control tower</a>
        <a href="learning/">Learning Lab</a>
        <a href="{BLOB}portfolio/case-study/case-study.pdf">Case study PDF</a>
      </nav>
    </div>
  </header>

  <main id="main">
    <section class="hero wrap">
      <p class="eyebrow">Business analysis · short-sea &amp; door-to-door logistics · Philippe Godfroy</p>
      <h1>{escape(case["title"])}</h1>
      <p class="lede">{escape(case["subtitle"])}</p>
      <div class="cta-row">
        <a class="btn primary" href="control-tower/">Open the control tower <span aria-hidden="true">→</span></a>
        <a class="btn" href="#walkthrough">Watch 65 s</a>
        <a class="btn" href="{BLOB}portfolio/case-study/case-study.pdf">Case study PDF <span aria-hidden="true">↗</span></a>
        <a class="btn" href="workspace/">Browse the evidence</a>
        <a class="btn" href="{REPO}">GitHub <span aria-hidden="true">↗</span></a>
      </div>
      <ul class="pillars">{pillars}</ul>
      <p class="note">{escape(case["disclosure"])}</p>
    </section>

    <section class="wrap section" aria-labelledby="tiers-title">
      <h2 id="tiers-title">What kind of evidence is this?</h2>
      <p class="measure">Every artefact carries one of these labels, so nothing simulated is presented as achieved.</p>
      <ul class="tiers">{tiers}</ul>
    </section>

    <section id="walkthrough" class="wrap section" aria-labelledby="video-title">
      <h2 id="video-title">The scenario in 65 seconds</h2>
      <figure class="diagram">
        <video controls muted playsinline preload="none" poster="assets/walkthrough/walkthrough-poster.png" aria-describedby="walkthrough-caption">
          <source src="assets/walkthrough/walkthrough.mp4" type="video/mp4">
          <a href="control-tower/">Open the control tower</a> to see the scenario.
        </video>
        <figcaption id="walkthrough-caption">No sound; captions in the video. A sailing delay hits eleven orders, the rules turn four into exceptions, the shift lead assigns the critical one, the customer gets one clear message, a new window is agreed, and the audit trail and test results show why.</figcaption>
      </figure>
    </section>

    <section class="wrap section two-col" aria-label="Challenge and role">
      <div>
        <h2>The challenge</h2>
        <p class="measure">Since the new TMS went live, customers see statuses — but not whether their <strong>delivery window</strong> is at risk. So they call.</p>
        <ul class="iconlist">{challenge}</ul>
      </div>
      <div class="divided">
        <h2>My role</h2>
        <p class="measure">{escape(case["role"])}</p>
        <ul class="iconlist">{role}</ul>
        <p class="small">The Product Owner decides scope and priority; the analyst prepares the decisions.</p>
      </div>
    </section>

    <section id="journey" class="wrap section" aria-labelledby="journey-title">
      <h2 id="journey-title">From opportunity to production readiness</h2>
      <ol class="timeline">{journey}</ol>
      <p class="measure">A pain point stays traceable through requirement, rule, story, test and KPI — and a script checks it on every change.</p>
    </section>

    <section id="workstreams" class="wrap section" aria-label="Workstreams">
      {streams}
    </section>

    <section id="architecture" class="wrap section" aria-labelledby="arch-title">
      <h2 id="arch-title">Business and IT, connected</h2>
      <p class="measure">A small component next to the TMS — not a new platform. Behaviour is specified precisely enough to build and test; the demo proves it.</p>
      {arch_html}
    </section>

    <section id="decisions" class="wrap section" aria-labelledby="decisions-title">
      <h2 id="decisions-title">Decisions that shaped the release</h2>
      <p class="measure">The analyst prepares options with consequences; the owner decides; the reason is written down the same day.</p>
      <div class="grid cards-3">{decisions}</div>
    </section>

    <section id="implementation" class="wrap section" aria-labelledby="impl-title">
      <h2 id="impl-title">Controlled implementation</h2>
      <p class="measure">A two-sprint pilot, accepted by the business, switched on customer by customer — and a stage gate before anything scales.</p>
      <ol class="timeline steps">{impl}</ol>
      <p class="links">{a("BAT log", "docs/09-acceptance/bat-log.md")} ↗ · {a("Go/no-go", "docs/10-go-live/release-readiness.md")} ↗ · {a("Change & adoption", "docs/10-go-live/change-and-adoption.md")} ↗ · {a("Runbook", "docs/10-go-live/operations-runbook.md")} ↗</p>
    </section>

    <section id="outcomes" class="wrap section" aria-labelledby="outcomes-title">
      <h2 id="outcomes-title">Business outcomes</h2>
      <p class="measure">Illustrative baselines and targets — assumptions to be measured in the pilot, not achieved results.</p>
      <div class="grid cards-4">{outcomes}</div>
      <p class="links">{a("Business case and sensitivity", "docs/01-opportunity/options-and-business-case.md")} ↗ · {a("KPI tree", "docs/01-opportunity/kpi-tree.md")} ↗ · {a("Benefits review", "docs/11-measure/benefits-review.md")} ↗</p>
    </section>

    <section id="evidence" class="wrap section" aria-labelledby="evidence-title">
      <h2 id="evidence-title">Evidence</h2>
      <p class="measure">{len(ev)} curated artefacts connect the story to inspectable work. For everything else, use the <a href="workspace/">evidence navigator</a> or the <a href="{BLOB}EVIDENCE.md">evidence matrix</a>.</p>
      <ol class="evidence-list">{evidence}</ol>
    </section>

    <section id="routes" class="wrap section" aria-labelledby="routes-title">
      <h2 id="routes-title">Three ways in</h2>
      <div class="grid cards-3">
        <article class="card"><span class="chip ok">5 minutes</span><h3><a href="for/recruiters/">For recruiters</a></h3><p>A guided tour: problem, approach, the working demo and what is not claimed.</p></article>
        <article class="card"><span class="chip warn">30+ minutes</span><h3><a href="workspace/">Explore the case</a></h3><p>Search every document by area and evidence type, from business case to runbook.</p></article>
        <article class="card"><span class="chip">Dutch · ±60 h</span><h3><a href="learning/">Learning Lab</a></h3><p>Ten modules, quizzes, competency tasks and interview defence on this case's own artefacts.</p></article>
      </div>
    </section>

    <section id="lessons" class="wrap section two-col" aria-label="Limitations and lessons">
      <div><h2>Limitations</h2><ul class="checklist measure">{limits}</ul></div>
      <div><h2>Lessons</h2><ul class="checklist measure">{lessons}</ul></div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="wrap">
      <p>{escape(case["disclosure"])} It contains no confidential information from any real employer or the hiring company.</p>
      <p>Philippe Godfroy · <a href="https://github.com/phlppgdfry">GitHub</a> · <a href="{BLOB}portfolio/README.md">Portfolio kit</a> · <a href="{BLOB}learning/ai-provenance.md">AI provenance</a></p>
    </div>
  </footer>
</body>
</html>
'''


def first_heading(md: str) -> str:
    m = re.search(r"^# (.+)$", md, re.M)
    return re.sub(r"[*`]", "", m.group(1)).strip() if m else ""


def summary(md: str) -> str:
    m = re.search(r"\*\*What this is:\*\*\s*(.+?)(?:\s\*\*For:\*\*|$)", md, re.M)
    text = m.group(1) if m else ""
    return re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", re.sub(r"[*`]", "", text)).strip()


AREAS = [
    ("docs/01-opportunity", "Discovery"), ("docs/02-discovery", "Discovery"), ("docs/03-workshops", "Workshops"), ("docs/04-process", "Process"),
    ("docs/05-requirements", "Requirements"), ("docs/06-backlog", "Delivery"), ("docs/07-design", "Design"), ("docs/08-delivery", "Delivery"),
    ("docs/09-acceptance", "Testing"), ("docs/10-go-live", "Go-live"), ("docs/11-measure", "Measure"), ("docs/12-architecture", "Architecture"),
    ("docs/13-quality", "Quality"), ("demo", "Demo"), ("portfolio", "Portfolio"),
]


def navigator() -> dict:
    curated = {e["path"].split("#")[0]: e for e in case["evidence"]}
    items = []
    for prefix, area in AREAS:
        for f in sorted((ROOT / prefix).rglob("*.md")):
            rel = f.relative_to(ROOT).as_posix()
            if any(p in rel for p in ("node_modules", "/out/", "generated", "application/README.md")):
                continue
            md = f.read_text(encoding="utf-8")
            title = first_heading(md) or rel
            e = curated.get(rel)
            status = e["status"] if e else ("simulated" if re.search(r"(?i)\*simulated", md[:1200]) else "proposed" if prefix in ("docs/10-go-live", "docs/12-architecture") else "documented")
            heads = [re.sub(r"[*`#]", "", h).strip() for h in re.findall(r"^#{2,3} (.+)$", md, re.M)]
            ids = sorted(set(re.findall(r"\b(?:BR|FR|NFR|ER|US|EN|AC|D|K|BAT|DEF|TC|ADR|OQ|UX)-\d+(?:\.\d+)?\b", md)))[:40]
            body = re.sub(r"\]\([^)]*\)|https?://\S+|```.*?```", " ", md, flags=re.S).lower()
            # test-results.md is rewritten by every test run; indexing its body would make this index stale each time
            words = [] if rel.endswith("test-results.md") else list(dict.fromkeys(w for w in re.findall(r"[a-z][a-z0-9-]{2,}", body)))[:400]
            items.append({"id": e["id"] if e else "", "title": title, "path": rel, "url": BLOB + rel, "area": area, "status": status, "summary": e["why"] if e else summary(md), "keywords": " ".join(heads + ids + words)})
    for e in case["evidence"]:
        p = e["path"].split("#")[0]
        if not p.endswith(".md"):
            items.append({"id": e["id"], "title": e["title"], "path": p, "url": BLOB + p, "area": e["area"], "status": e["status"], "summary": e["why"], "keywords": e["title"]})
    order = {k: i for i, k in enumerate(STATUS)}
    items.sort(key=lambda x: (x["id"] == "", x["id"], x["area"], x["title"]))
    return {"statuses": STATUS, "areas": sorted({i["area"] for i in items}), "items": items, "statusOrder": list(order)}


def main() -> int:
    outputs = {
        ROOT / "site/index.html": landing(),
        ROOT / "site/workspace/evidence.json": json.dumps(navigator(), ensure_ascii=False, indent=1) + "\n",
    }
    stale = []
    for path, text in outputs.items():
        if "--check" in sys.argv:
            if not path.exists() or path.read_text(encoding="utf-8") != text:
                stale.append(path.relative_to(ROOT).as_posix())
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text, encoding="utf-8")
    if stale:
        print(f"Out of date: {', '.join(stale)}. Run: python3 scripts/build_site.py")
        return 1
    print("Site up to date." if "--check" in sys.argv else f"Wrote {len(outputs)} files.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
