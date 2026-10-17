# Portfolio

> The presentation layer of this case. Everything here is derived from the [documentation](../docs/00-documentation-map.md) and the [demo](../demo/README.md); nothing here adds new claims. The landing page and the evidence navigator are generated from one [content manifest](content/case.json).

## By reader

| Reader | Start with | Time |
|---|---|---|
| Recruiter | [recruiter view](views/recruiter-view.md) · [5-minute tour](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/for/recruiters/) | 90 s – 5 min |
| Hiring manager | [hiring manager view](views/hiring-manager-view.md) — ambiguity, trade-offs, what is not claimed | 10 min |
| Architect, developer, tester | [technical view](views/technical-view.md) — boundaries, contract, ADRs, runbook, tests | 15 min |
| Anyone checking a claim | [role requirement matrix](role-requirement-matrix.md) · [evidence navigator](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/workspace/) | 5 min |

## Material

| What | File | Use it for |
|---|---|---|
| **Executive summary** (A4, PDF) | [`executive-summary/executive-summary.pdf`](executive-summary/executive-summary.pdf) · [one page in Markdown, EN + NL](executive-summary/README.md) | the shortest version; an attachment |
| **Executive case study** (5 pages, PDF) | [`case-study/case-study.pdf`](case-study/case-study.pdf) · source [`case-study.html`](case-study/case-study.html) | reading before an interview |
| **Interview presentation** (10 slides, speaker notes) | [`presentation/interview-deck.pptx`](presentation/interview-deck.pptx) · [talk track](presentation/README.md) | a 10-minute case presentation |
| **Steering committee deck** (in-case artefact) | [`presentation/steering-committee-deck.pptx`](presentation/steering-committee-deck.pptx) | showing how the analyst asks a sponsor for a decision |
| **Demo scripts** | [2 minutes](demo/2-minute-demo.md) · [5 minutes](demo/5-minute-demo.md) · [15 minutes](demo/15-minute-demo.md) | a live demo, timed, with what to say and what not to claim |
| **Walkthrough video** (65 s, no sound, captions) | [GIF](walkthrough/walkthrough.gif) · [MP4 on the site](https://phlppgdfry.github.io/shipment-exception-management-business-analysis/assets/walkthrough/walkthrough.mp4) | e-mail, LinkedIn, people who won't click |
| **Screenshots** of the control tower | [`screenshots/`](screenshots/) | CV, LinkedIn, slides |
| **CV and LinkedIn text** | [`cv-description.md`](cv-description.md) · [`career/linkedin-project.md`](career/linkedin-project.md) | a CV or LinkedIn "projects" entry |
| **Content manifest** | [`content/case.json`](content/case.json) | the single source for the landing page and navigator: pillars, workstreams, decisions, KPIs, evidence with status, limits, lessons |

## Evidence statuses

Every item in the manifest carries one of six statuses, shown on the landing page and filterable in the navigator: **executed** (run by a tool in this repository), **validated model** (a standard file checked by a validator), **documented analysis**, **proposed design** (not built or run in a real organisation), **simulated** (fictional workshops, sprints, BAT, pilot) and **pending real validation** (needs real people, data or a system). The definitions are in the manifest.

## Rebuilding

```bash
python3 scripts/build_site.py                                                          # landing page + evidence index from the manifest
cd demo/application
BASE_PATH=/shipment-exception-management-business-analysis/control-tower npm run build
node scripts/capture-screenshots.mjs                                                    # portfolio/screenshots
node scripts/record-walkthrough.mjs                                                     # video + GIF (needs ffmpeg)
node scripts/render-pdf.mjs ../../portfolio/case-study/case-study.html ../../portfolio/case-study/case-study.pdf
node scripts/render-pdf.mjs ../../portfolio/executive-summary/executive-summary.html ../../portfolio/executive-summary/executive-summary.pdf
cd ../.. && python3 scripts/build_interview_deck.py                                     # needs python-pptx==1.0.2
```

**Known limitation:** the decks were checked with a text-fit estimate, not opened in PowerPoint or Keynote in this environment. Open them once before an interview.
